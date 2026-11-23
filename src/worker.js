/* ============================================================
   The AI Fluency Playbook — site Worker

   Public:   /  /syllabus  /styles.css  /og.png
   Sign-in:  /enroll  (Freebuff sign-in = Google / GitHub / Apple)
   Paid:     /course  /app.js  /content*.js  /content-depth-*.js
             /tests.js  /tests-more.js  /quiz-utils.js  /research.js
   Owner:    /access  (who signed in, who paid, who may enter)

   Money: if STRIPE_SECRET_KEY and a plan price are set as Worker
   secrets, /enroll sends people to Stripe Checkout and access is
   gated. PAYWALL=on re-enables the gate; by default access is free.
   granted when Stripe confirms payment (webhook + success-page
   check). With no Stripe keys the site still sells: it collects a
   request and the owner approves it at /access.
   ============================================================ */
import { createFreebuffAuth, isSameOriginRequest } from "@freebuff/auth";

/* ---------------- plans ---------------- */
export const PLANS = {
  student: {
    id: "student", name: "Self-paced", price: 19, seats: 1,
    priceEnv: "STRIPE_PRICE_STUDENT",
    blurb: "The whole course for one person.",
    includes: ["All 38 lessons and 5 levels", "48 tested prompts", "Watchlist and 3D lab", "Progress saved, printable card", "Free updates to this edition"]
  },
  group: {
    id: "group", name: "Study group", price: 49, seats: 5,
    priceEnv: "STRIPE_PRICE_GROUP",
    blurb: "Five people, five accounts, one payment.",
    includes: ["Everything in Self-paced", "Five separate accounts", "Everyone keeps their own progress", "A six-week group schedule", "Discussion prompts per level"]
  },
  class: {
    id: "class", name: "Classroom", price: 149, seats: 30,
    priceEnv: "STRIPE_PRICE_CLASS",
    blurb: "A seminar, society or team — up to thirty accounts.",
    includes: ["Everything in Study group", "Up to 30 accounts", "A record of who has signed in", "Access list managed for you", "Useful for a whole module"]
  }
};

const DEFAULT_PLAN = "student";

/* ---------------- helpers ---------------- */
const esc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const now = () => new Date().toISOString();
const redirect = (location, status = 302) =>
  new Response(null, { status, headers: { location, "cache-control": "private, no-store" } });

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "private, no-store" }
  });

/* ---------------- security headers ---------------- */
const CSP_BASE = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://i.ytimg.com",
  "connect-src 'self' https://cdn.jsdelivr.net",
  "frame-ancestors 'self' https://*.freebuff.site https://*.style.dev",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'"
].join("; ");

/* the public landing page carries one inline JSON-LD block, so it alone
   allows inline scripts; nothing else on the site does. */
const cspFor = (allowInlineScript) =>
  allowInlineScript
    ? `${CSP_BASE}; script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'`
    : `${CSP_BASE}; script-src 'self' https://cdn.jsdelivr.net`;

function harden(res, { inlineScript = false, isPage = false } = {}) {
  const headers = new Headers(res.headers);
  headers.set("content-security-policy", cspFor(inlineScript));
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "same-origin");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
  if (isPage) headers.set("cache-control", "private, no-store");
  return new Response(res.body, { status: res.status, headers });
}

/* ---------------- database ---------------- */
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS visitors (
     sub TEXT PRIMARY KEY, email TEXT, name TEXT,
     first_seen TEXT NOT NULL, last_seen TEXT NOT NULL, visits INTEGER NOT NULL DEFAULT 0
   )`,
  `CREATE TABLE IF NOT EXISTS access_log (
     id INTEGER PRIMARY KEY AUTOINCREMENT, sub TEXT NOT NULL, email TEXT,
     path TEXT, user_agent TEXT, country TEXT, at TEXT NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)`,
  `CREATE TABLE IF NOT EXISTS entitlements (
     email TEXT PRIMARY KEY, sub TEXT, name TEXT, plan TEXT,
     status TEXT NOT NULL DEFAULT 'pending', source TEXT,
     note TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS orders (
     id TEXT PRIMARY KEY, email TEXT, plan TEXT, amount INTEGER,
     status TEXT NOT NULL, created_at TEXT NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS access_log_at ON access_log (at DESC)`
];

let schemaReady = false;
async function ensureSchema(db) {
  if (!db) return;
  if (schemaReady) return;
  for (const sql of SCHEMA) {
    try { await db.prepare(sql).run(); } catch (e) { /* exists, or no permission */ }
  }
  schemaReady = true;
}

async function getSetting(db, key) {
  if (!db) return null;
  try {
    const row = await db.prepare("SELECT value FROM settings WHERE key = ?").bind(key).first();
    return row ? row.value : null;
  } catch (e) { return null; }
}

async function setSetting(db, key, value) {
  if (!db) return;
  try {
    await db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
      .bind(key, value).run();
  } catch (e) {}
}

/* OWNER_EMAIL may hold a comma-separated list, so the same person can sign
   in with a work address or a personal one and still be the owner. */
const ownerList = (env) =>
  (env.OWNER_EMAIL || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

/* The course is free while the owner works through it themselves. Setting
   PAYWALL=on as a site variable puts the paid gate back exactly as it was —
   no code change, and nobody's saved progress is affected. */
const paywallOn = (env) => String(env.PAYWALL || "").trim().toLowerCase() === "on";

/* first account to arrive owns the site, unless OWNER_EMAIL is set */
async function resolveOwner(env, user) {
  const configured = ownerList(env);
  if (configured.length) return configured.join(", ");
  let owner = await getSetting(env.DB, "owner");
  if (!owner && user && user.email) {
    owner = String(user.email).toLowerCase();
    await setSetting(env.DB, "owner", owner);
  }
  return owner;
}

const invites = (env) =>
  (env.INVITE_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

async function entitlement(env, email) {
  if (!env.DB || !email) return null;
  try {
    return await env.DB.prepare("SELECT email, plan, status, source, created_at FROM entitlements WHERE email = ?")
      .bind(email).first();
  } catch (e) { return null; }
}

async function accessFor(env, user, owner) {
  const email = (user.email || "").toLowerCase();
  const configured = ownerList(env);
  const isOwner = configured.length
    ? !!email && configured.includes(email)
    : !!owner && email === owner;
  if (isOwner) return { isOwner, allowed: true, status: "owner", row: null };
  if (!paywallOn(env)) return { isOwner: false, allowed: true, status: "free", row: null };
  if (invites(env).includes(email)) return { isOwner: false, allowed: true, status: "invited", row: null };
  const row = await entitlement(env, email);
  if (row && row.status === "active") return { isOwner: false, allowed: true, status: "active", row };
  return { isOwner: false, allowed: false, status: row ? row.status : "none", row };
}

async function grantAccess(env, { email, sub, name, plan, source }) {
  if (!env.DB || !email) return false;
  const clean = String(email).toLowerCase().trim();
  const ts = now();
  const seats = (PLANS[plan] || PLANS[DEFAULT_PLAN]).seats;
  try {
    await env.DB.prepare(
      `INSERT INTO entitlements (email, sub, name, plan, status, source, note, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'active', ?, ?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         status = 'active',
         sub = COALESCE(excluded.sub, entitlements.sub),
         name = COALESCE(excluded.name, entitlements.name),
         plan = COALESCE(excluded.plan, entitlements.plan),
         source = COALESCE(excluded.source, entitlements.source),
         note = COALESCE(excluded.note, entitlements.note),
         updated_at = excluded.updated_at`
    ).bind(clean, sub || null, name || null, plan || DEFAULT_PLAN, source || "owner", `seats:${seats}`, ts, ts).run();
    return true;
  } catch (e) { return false; }
}

async function setAccessStatus(env, email, status) {
  if (!env.DB || !email) return;
  try {
    await env.DB.prepare("UPDATE entitlements SET status = ?, updated_at = ? WHERE email = ?")
      .bind(status, now(), String(email).toLowerCase().trim()).run();
  } catch (e) {}
}

async function logVisit(env, user, request) {
  if (!env.DB) return;
  const db = env.DB;
  const ts = now();
  const email = user.email ? String(user.email).toLowerCase() : null;
  const name = user.name || null;
  try {
    await db.prepare(
      `INSERT INTO visitors (sub, email, name, first_seen, last_seen, visits)
       VALUES (?, ?, ?, ?, ?, 1)
       ON CONFLICT(sub) DO UPDATE SET
         last_seen = excluded.last_seen, visits = visitors.visits + 1,
         email = COALESCE(excluded.email, visitors.email),
         name = COALESCE(excluded.name, visitors.name)`
    ).bind(user.sub, email, name, ts, ts).run();
    const url = new URL(request.url);
    await db.prepare(
      "INSERT INTO access_log (sub, email, path, user_agent, country, at) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(
      user.sub, email, url.pathname,
      (request.headers.get("user-agent") || "").slice(0, 300),
      request.headers.get("cf-ipcountry") || null, ts
    ).run();
  } catch (e) { /* never break the page for a log write */ }
}

/* ---------------- HTML shell ---------------- */
function page(title, body, status = 200, opts = {}) {
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${esc(title)} — AI Fluency Playbook</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23080a10'/%3E%3Cpath d='M8 22 16 8l8 14' stroke='%23c8ff4d' stroke-width='2.4' fill='none'/%3E%3C/svg%3E" />
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box}
  :root{--lime:#c8ff4d;--cyan:#5ce1ff;--line:rgba(255,255,255,.1);--muted:#97a1b4;--dim:#69738a}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:32px 20px;
    background:radial-gradient(60% 50% at 50% 0%,#111827,#07090e 70%);color:#e9edf5;
    font:16.5px/1.65 "Inter Tight",-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif}
  main{max-width:760px;width:100%}
  main.wide{max-width:1000px}
  .brand{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--muted);margin-bottom:30px;text-decoration:none}
  .mark{width:11px;height:11px;border-radius:3px;background:linear-gradient(140deg,var(--lime),var(--cyan));box-shadow:0 0 16px rgba(200,255,77,.5)}
  h1{font-size:clamp(26px,4vw,38px);line-height:1.08;margin:0 0 14px;letter-spacing:-.025em;font-weight:500}
  h1 em{font-family:"Instrument Serif",Georgia,serif;font-style:italic;color:var(--lime)}
  h2{font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);margin:32px 0 10px;font-weight:500}
  p{color:var(--muted);margin:0 0 14px}
  strong{color:#e9edf5;font-weight:500}
  a{color:var(--cyan)}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;margin-top:8px;background:var(--lime);color:#0a0d12;
    font-weight:600;font-size:14.5px;padding:13px 22px;border-radius:999px;text-decoration:none;border:0;cursor:pointer;font-family:inherit}
  .btn:hover{filter:brightness(1.05)}
  .btn.ghost{background:transparent;color:#e9edf5;border:1px solid var(--line)}
  .btn.sm{font-size:12.5px;padding:7px 13px;margin:0}
  .btn.danger{background:transparent;color:#ff9aa7;border:1px solid rgba(255,122,138,.4)}
  code{font-family:"JetBrains Mono",ui-monospace,Menlo,monospace;font-size:12.5px;background:rgba(255,255,255,.07);padding:2px 6px;border-radius:5px}
  .card{border:1px solid var(--line);border-radius:14px;padding:22px;background:rgba(255,255,255,.025);margin-bottom:14px}
  .card.accent{border-color:rgba(200,255,77,.35);background:linear-gradient(150deg,rgba(200,255,77,.07),rgba(255,255,255,.015))}
  .card h3{margin:0 0 6px;font-size:19px;font-weight:500;letter-spacing:-.01em}
  .price{font-family:"Instrument Serif",Georgia,serif;font-size:40px;line-height:1;color:#e9edf5}
  .price small{font-size:19px;vertical-align:super;color:var(--dim);margin-right:2px}
  .muted{color:var(--dim);font-size:13px}
  ul.ticks{list-style:none;padding:0;margin:14px 0 0;display:flex;flex-direction:column;gap:7px}
  ul.ticks li{position:relative;padding-left:18px;font-size:13.6px;color:#c1ccdc}
  ul.ticks li::before{content:"·";position:absolute;left:5px;color:var(--lime);font-weight:700}
  table{width:100%;border-collapse:collapse;margin-top:10px;font-size:13.5px}
  th,td{text-align:left;padding:9px 8px;border-bottom:1px solid var(--line);vertical-align:top}
  th{color:var(--dim);font-weight:500;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase}
  td form{display:inline;margin:0}
  .pill{display:inline-block;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;padding:3px 8px;border-radius:999px;border:1px solid var(--line);color:var(--muted)}
  .pill.ok{color:#0a0d12;background:var(--lime);border-color:var(--lime);font-weight:600}
  .pill.wait{color:#ffd49a;border-color:rgba(255,182,77,.4)}
  .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .notice{border-left:2px solid var(--lime);padding:10px 0 10px 14px;font-size:14px;color:#cfd8e6;margin:16px 0}
  .notice.warn{border-color:#ffb64d}
  .notice.bad{border-color:#ff7a8a}
  input[type=email],input[type=text]{width:100%;background:rgba(255,255,255,.05);border:1px solid var(--line);border-radius:9px;
    color:#e9edf5;font:inherit;font-size:14px;padding:10px 12px}
  label{font-size:12px;color:var(--dim);letter-spacing:.04em;text-transform:uppercase}
  .signout{background:none;border:0;color:var(--muted);font:inherit;font-size:13px;text-decoration:underline;cursor:pointer;padding:0}
  @media(max-width:640px){.grid2{grid-template-columns:1fr}table{font-size:12.5px}th,td{padding:7px 5px}}
</style></head>
<body><main${opts.wide ? ' class="wide"' : ""}>
<a class="brand" href="/"><span class="mark"></span> AI Fluency Playbook</a>
${body}
</main></body></html>`;
  return harden(
    new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8" } }),
    { isPage: true }
  );
}

const signoutForm = `<form method="post" action="/auth/freebuff/signout"><button class="signout" type="submit">Sign out</button></form>`;

/* ---------------- pages ---------------- */
function enrollPage(env, user, { planId, state, message }) {
  const plan = PLANS[planId] || PLANS[DEFAULT_PLAN];
  const stripeOn = !!(env.STRIPE_SECRET_KEY && env[plan.priceEnv]);
  const otherPlans = Object.values(PLANS).filter((p) => p.id !== plan.id);

  const stateNote =
    state === "requested"
      ? `<div class="notice">Request received for <strong>${esc(user.email || "your account")}</strong>. You'll get an email once access is switched on — usually the same day.</div>`
      : state === "cancelled"
      ? `<div class="notice warn">Checkout was cancelled. Nothing was charged — you can try again whenever you like.</div>`
      : state === "error"
      ? `<div class="notice bad">${esc(message || "That didn't work. Try again, or email me and I'll sort it out by hand.")}</div>`
      : "";

  return page(
    "Get access",
    `<h1>You're nearly in, <em>${esc((user.name || user.email || "there").split("@")[0].split(" ")[0])}</em>.</h1>
     <p>Signed in as <strong>${esc(user.email || user.name || user.sub)}</strong> — access will unlock on this account. ${signoutForm}</p>
     ${stateNote}
     <div class="card accent">
       <div class="row" style="justify-content:space-between;align-items:flex-start">
         <div>
           <h3>${esc(plan.name)}</h3>
           <p class="muted">${esc(plan.blurb)}</p>
         </div>
         <p class="price"><small>$</small>${plan.price}</p>
       </div>
       <ul class="ticks">${plan.includes.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
       <form method="post" action="/api/enroll" style="margin-top:20px">
         <input type="hidden" name="plan" value="${esc(plan.id)}" />
         <button class="btn" type="submit">${stripeOn ? `Pay $${plan.price} by card` : `Request access — $${plan.price}`}</button>
       </form>
       <p class="muted" style="margin:14px 0 0">${
         stripeOn
           ? "Secure checkout by Stripe. Card details never touch this site. 30-day refund, no interrogation."
           : "Card checkout isn't switched on yet, so this sends an access request. You'll be invoiced directly — nothing is charged here."
       }</p>
     </div>
     <p class="muted">Want a different arrangement?</p>
     <div class="row">
       ${otherPlans.map((p) => `<a class="btn ghost sm" href="/enroll?plan=${p.id}">${esc(p.name)} · $${p.price}</a>`).join("")}
     </div>
     <p class="muted" style="margin-top:26px"><a href="/">← Back to the course page</a></p>`,
    200
  );
}

function blockedPage(env, user, planId) {
  const pending = planId === "pending";
  return page(
    "Access not granted",
    `<h1>${pending ? "Your request is in the queue." : "This course is paid access."}</h1>
     <p>Signed in as <strong>${esc(user.email || user.name || user.sub)}</strong>. ${signoutForm}</p>
     ${
       pending
         ? `<div class="notice">Thanks — your request is recorded. You'll get an email when access is switched on, usually the same day.</div>
            <p><a href="/enroll">See the plans</a> or <a href="/">go back to the main page</a>.</p>`
         : `<p>The lesson you tried to open is part of the course. One payment, lifetime access, 30-day refund.</p>
            <a class="btn" href="/enroll">Get access — from $${PLANS[DEFAULT_PLAN].price}</a>
            <p class="muted" style="margin-top:18px"><a href="/syllabus">Read the full syllabus</a> · <a href="/">Main page</a></p>`
     }`,
    403
  );
}

async function accessPage(env, owner, user) {
  const db = env.DB;
  let ent = [], visitors = [], recent = [], error = null;
  if (!db) {
    error = "No database is attached yet, so nothing can be recorded or approved.";
  } else {
    try {
      ent = (await db.prepare("SELECT email, name, plan, status, source, created_at, updated_at FROM entitlements ORDER BY updated_at DESC LIMIT 300").all()).results || [];
      visitors = (await db.prepare("SELECT email, name, first_seen, last_seen, visits FROM visitors ORDER BY last_seen DESC LIMIT 200").all()).results || [];
      recent = (await db.prepare("SELECT email, path, at, country FROM access_log ORDER BY id DESC LIMIT 60").all()).results || [];
    } catch (e) { error = "The database is attached but the tables aren't ready. Reload in a moment."; }
  }
  const pending = ent.filter((e) => e.status === "pending");
  const active = ent.filter((e) => e.status !== "pending");
  const money = active.filter((e) => e.source === "stripe");

  const actionForm = (email, action, label, cls) => `<form method="post" action="/access/set">
      <input type="hidden" name="email" value="${esc(email)}" />
      <input type="hidden" name="action" value="${esc(action)}" />
      <button class="btn sm ${cls}" type="submit">${esc(label)}</button>
    </form>`;

  const entRow = (e) => `<tr>
      <td>${esc(e.email)}<br><span class="muted">${esc(e.name || "")}</span></td>
      <td>${esc(e.plan || "—")}<br><span class="muted">${esc(e.source || "")}</span></td>
      <td><span class="pill ${e.status === "active" ? "ok" : e.status === "pending" ? "wait" : ""}">${esc(e.status)}</span></td>
      <td>${esc((e.created_at || "").slice(0, 16).replace("T", " "))}</td>
      <td class="row">
        ${e.status !== "active" ? actionForm(e.email, "approve", "Approve", "") : ""}
        ${e.status === "active" ? actionForm(e.email, "revoke", "Revoke", "ghost") : ""}
        ${e.status === "pending" ? actionForm(e.email, "deny", "Deny", "danger") : ""}
      </td>
    </tr>`;

  const visitorRow = (v) => `<tr>
      <td>${esc(v.email || "—")}<br><span class="muted">${esc(v.name || "")}</span></td>
      <td>${esc(String(v.visits))}</td>
      <td>${esc((v.first_seen || "").slice(0, 16).replace("T", " "))}</td>
      <td>${esc((v.last_seen || "").slice(0, 16).replace("T", " "))}</td>
    </tr>`;

  const visitRow = (r) => `<tr>
      <td>${esc((r.at || "").slice(0, 16).replace("T", " "))}</td>
      <td>${esc(r.email || "—")}</td>
      <td>${esc(r.path || "")}</td>
      <td>${esc(r.country || "")}</td>
    </tr>`;

  return page(
    "Owner dashboard",
    `<h1>Who has access, and who's been here.</h1>
     <p class="muted">Owner: <strong>${esc(owner || "not claimed")}</strong> · signed in as ${esc(user.email || user.sub)} · ${signoutForm}</p>
     <div class="notice ok">You are the owner, so the whole course is open to you without paying. Open it from <a href="/course">the course page</a> — nothing is charged to this account, ever.</div>
     ${paywallOn(env) ? "" : `<div class="notice ok">Access is free for every signed-in account at the moment. Set <code>PAYWALL=on</code> as a site variable when you want the paywall back.</div>`}
     ${env.OWNER_EMAIL ? "" : `<div class="notice warn">Ownership was auto-claimed by the first account to sign in. To lock it to one address for good, set <code>OWNER_EMAIL</code> as a site variable — it always wins over this.</div>`}
     ${error ? `<div class="notice bad">${esc(error)}</div>` : ""}
     <div class="grid2" style="margin:20px 0">
       <div class="card"><p class="muted">Pending requests</p><p class="price">${pending.length}</p></div>
       <div class="card"><p class="muted">Active accounts</p><p class="price">${active.length}</p></div>
       <div class="card"><p class="muted">Paid through Stripe</p><p class="price">${money.length}</p></div>
       <div class="card"><p class="muted">People who signed in</p><p class="price">${visitors.length}</p></div>
     </div>

     <h2>Waiting for you</h2>
     <table><thead><tr><th>Person</th><th>Plan</th><th>Status</th><th>Asked</th><th></th></tr></thead>
     <tbody>${pending.map(entRow).join("") || `<tr><td colspan="5" class="muted">No pending requests.</td></tr>`}</tbody></table>

     <h2>Grant access by email</h2>
     <form method="post" action="/access/add" class="row" style="align-items:flex-end">
       <div style="flex:2;min-width:220px"><label for="email">Email they'll sign in with</label>
         <input id="email" name="email" type="email" required placeholder="name@example.com" /></div>
       <div style="flex:1;min-width:130px"><label for="plan">Plan</label>
         <input id="plan" name="plan" type="text" value="manual" /></div>
       <button class="btn" type="submit">Add</button>
     </form>
     <p class="muted" style="margin-top:8px">Use the address on their Google / GitHub / Apple account — that's what the door checks.</p>

     <h2>Everyone with a record</h2>
     <table><thead><tr><th>Person</th><th>Plan</th><th>Status</th><th>Added</th><th></th></tr></thead>
     <tbody>${active.map(entRow).join("") || `<tr><td colspan="5" class="muted">Nobody yet.</td></tr>`}</tbody></table>

     <h2>People who have signed in</h2>
     <table><thead><tr><th>Person</th><th>Visits</th><th>First</th><th>Last</th></tr></thead>
     <tbody>${visitors.map(visitorRow).join("") || `<tr><td colspan="4" class="muted">No visits recorded.</td></tr>`}</tbody></table>

     <h2>Latest visits</h2>
     <table><thead><tr><th>When (UTC)</th><th>Who</th><th>Path</th><th>Country</th></tr></thead>
     <tbody>${recent.map(visitRow).join("") || `<tr><td colspan="4" class="muted">Nothing yet.</td></tr>`}</tbody></table>

     <p class="muted" style="margin-top:26px">
       Stripe keys live in Sites → Secrets, never in this repo. Set <code>STRIPE_SECRET_KEY</code>,
       <code>STRIPE_WEBHOOK_SECRET</code> and <code>STRIPE_PRICE_STUDENT</code> / <code>_GROUP</code> / <code>_CLASS</code>
       to switch card checkout on. Without them, requests arrive here for you to approve.
     </p>
     <p><a href="/">Main page</a> · <a href="/course">Open the course</a></p>`,
    200,
    { wide: true }
  );
}

/* ---------------- Stripe ---------------- */
async function stripeCall(env, path, init = {}) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "content-type": "application/x-www-form-urlencoded",
      ...(init.headers || {})
    }
  });
  let data = {};
  try { data = await res.json(); } catch (e) {}
  if (!res.ok) throw new Error((data && data.error && data.error.message) || `Stripe ${res.status}`);
  return data;
}

async function createCheckout(env, user, plan) {
  const priceId = env[plan.priceEnv];
  if (!env.STRIPE_SECRET_KEY || !priceId) return null;
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${env.APP_ORIGIN}/thanks?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${env.APP_ORIGIN}/enroll?plan=${plan.id}&state=cancelled`);
  if (user.email) params.set("customer_email", user.email);
  params.set("client_reference_id", user.sub);
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("metadata[plan]", plan.id);
  params.set("metadata[sub]", user.sub);
  if (user.email) params.set("metadata[email]", user.email);
  const session = await stripeCall(env, "checkout/sessions", { method: "POST", body: params.toString() });
  return session.url || null;
}

/* Stripe's scheme: HMAC-SHA256 over "<timestamp>.<payload>" with the
   webhook secret, compared in constant time, rejecting old timestamps. */
export async function verifyStripeSignature(payload, header, secret, toleranceSeconds = 300) {
  if (!header || !secret) return false;
  const parts = String(header).split(",");
  let timestamp = null;
  const signatures = [];
  for (const part of parts) {
    const [k, v] = part.split("=");
    if (k === "t") timestamp = v;
    if (k === "v1" && v) signatures.push(v);
  }
  if (!timestamp || !signatures.length) return false;
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > toleranceSeconds) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(`${timestamp}.${payload}`)));
  const expected = [...mac].map((b) => b.toString(16).padStart(2, "0")).join("");
  let ok = false;
  for (const sig of signatures) {
    if (sig.length !== expected.length) continue;
    let diff = 0;
    for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
    if (diff === 0) ok = true;
  }
  return ok;
}

async function recordOrder(env, { id, email, plan, amount, status }) {
  if (!env.DB) return;
  try {
    await env.DB.prepare(
      "INSERT INTO orders (id, email, plan, amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET status = excluded.status"
    ).bind(id, email || null, plan || null, amount || 0, status, now()).run();
  } catch (e) {}
}

async function handlePaidSession(env, session) {
  const email = (session.customer_details && session.customer_details.email) ||
                (session.metadata && session.metadata.email) ||
                session.customer_email || null;
  const plan = (session.metadata && session.metadata.plan) || DEFAULT_PLAN;
  const sub = (session.metadata && session.metadata.sub) || session.client_reference_id || null;
  await recordOrder(env, {
    id: String(session.id), email, plan,
    amount: session.amount_total || (PLANS[plan] ? PLANS[plan].price * 100 : 0),
    status: session.payment_status || "paid"
  });
  if (!email) return false;
  return grantAccess(env, { email, sub, plan, source: "stripe" });
}

/* ---------------- authed routing ---------------- */
export async function handleAuthed(req, env, user, auth) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const owner = await resolveOwner(env, user);
  const access = await accessFor(env, user, owner);

  if (path === "/api/me") {
    return json({ user: { sub: user.sub, email: user.email, name: user.name }, owner: access.isOwner, allowed: access.allowed, status: access.status });
  }

  const isPost = req.method === "POST";
  const sameOrigin = () => isSameOriginRequest(req, env.APP_ORIGIN);

  /* ---- enrollment ---- */
  if (path === "/enroll" && !isPost) {
    if (access.allowed) return redirect("/course");
    return enrollPage(env, user, { planId: url.searchParams.get("plan") || DEFAULT_PLAN, state: url.searchParams.get("state") });
  }

  if (path === "/api/enroll" && isPost) {
    if (!sameOrigin()) return page("Blocked", `<h1>That request came from somewhere else.</h1><p><a href="/enroll">Try again from the site.</a></p>`, 403);
    let form;
    try { form = await req.formData(); } catch (e) { form = new FormData(); }
    const plan = PLANS[String(form.get("plan") || DEFAULT_PLAN)] || PLANS[DEFAULT_PLAN];
    if (access.allowed) return redirect("/course");

    if (env.STRIPE_SECRET_KEY && env[plan.priceEnv] && user.email) {
      try {
        const checkoutUrl = await createCheckout(env, user, plan);
        if (checkoutUrl) return redirect(checkoutUrl, 303);
      } catch (e) {
        return enrollPage(env, user, { planId: plan.id, state: "error", message: "Card checkout is temporarily unavailable. Try the request option, or email me." });
      }
    }

    const email = (user.email || "").toLowerCase();
    if (email) {
      await grantAccess(env, { email, sub: user.sub, name: user.name, plan: plan.id, source: "request" });
      await setAccessStatus(env, email, "pending");
    }
    return redirect(`/enroll?plan=${plan.id}&state=requested`, 303);
  }

  if (path === "/api/checkout" && isPost) {
    /* kept for form-less clients */
    if (!sameOrigin()) return json({ error: "cross-origin" }, 403);
    return json({ error: "use /enroll" }, 400);
  }

  /* ---- Stripe webhook (no session on this route) ---- */
  if (path === "/api/stripe-webhook" && isPost) {
    const raw = await req.text();
    const ok = await verifyStripeSignature(raw, req.headers.get("stripe-signature"), env.STRIPE_WEBHOOK_SECRET);
    if (!ok) return json({ error: "bad signature" }, 400);
    let event = {};
    try { event = JSON.parse(raw); } catch (e) { return json({ error: "bad json" }, 400); }
    if (event.type === "checkout.session.completed" && event.data && event.data.object) {
      await handlePaidSession(env, event.data.object);
    }
    return json({ received: true });
  }

  /* ---- after payment ---- */
  if (path === "/thanks") {
    const sessionId = url.searchParams.get("session_id") || "";
    if (!sessionId || !env.STRIPE_SECRET_KEY) {
      return page("Payment", `<h1>Nothing to confirm.</h1><p>If you've just paid, your access is being switched on — reload <a href="/course">the course</a> in a minute.</p>`, 200);
    }
    try {
      const session = await stripeCall(env, `checkout/sessions/${encodeURIComponent(sessionId)}`);
      if (session.payment_status !== "paid") {
        return page("Payment pending", `<h1>Payment hasn't cleared yet.</h1><p>Stripe says <strong>${esc(session.payment_status || "unpaid")}</strong>. If you've just paid, give it a minute and reload.</p><p><a href="/enroll">Back to plans</a></p>`, 200);
      }
      const granted = await handlePaidSession(env, session);
      return page(
        "You're in",
        `<h1>Payment received. <em>You're in.</em></h1>
         <p>Access is active on <strong>${esc((session.customer_details && session.customer_details.email) || user.email || "your account")}</strong> — same account, so just open the course.</p>
         ${granted ? "" : `<div class="notice warn">The payment went through but I couldn't match it to this sign-in. Email me the receipt and I'll attach access within the day.</div>`}
         <a class="btn" href="/course">Open the course</a>
         <p class="muted" style="margin-top:18px">Receipt is in your email. Refund within 30 days, no questions.</p>`,
        200
      );
    } catch (e) {
      return page("Payment", `<h1>Couldn't confirm that payment.</h1><p>${esc(e.message || "Stripe didn't answer.")}</p><p>Reload in a moment, or email me the receipt and I'll attach access by hand.</p><p><a href="/course">Open the course</a></p>`, 200);
    }
  }

  /* ---- owner dashboard ---- */
  if (path === "/access" && !isPost) {
    if (!access.isOwner) {
      return page("Not yours", `<h1>This page is the owner's.</h1><p>You're signed in as ${esc(user.email || "someone")}.</p><p><a href="/">Main page</a></p>`, 403);
    }
    return accessPage(env, owner, user);
  }

  if ((path === "/access/set" || path === "/access/add") && isPost) {
    if (!access.isOwner) return page("Not yours", `<h1>Only the owner can change access.</h1>`, 403);
    if (!sameOrigin()) return page("Blocked", `<h1>That request came from somewhere else.</h1>`, 403);
    let form;
    try { form = await req.formData(); } catch (e) { form = new FormData(); }
    const email = String(form.get("email") || "").toLowerCase().trim().slice(0, 200);
    if (!email || !email.includes("@")) {
      return page("Check that", `<h1>That email doesn't look right.</h1><p><a href="/access">Back to the dashboard</a></p>`, 400);
    }
    if (path === "/access/add") {
      const plan = String(form.get("plan") || "manual").slice(0, 40);
      await grantAccess(env, { email, plan, source: "owner" });
    } else {
      const action = String(form.get("action") || "");
      if (action === "approve") await grantAccess(env, { email, plan: "manual", source: "owner" });
      else if (action === "revoke") await setAccessStatus(env, email, "revoked");
      else if (action === "deny") await setAccessStatus(env, email, "denied");
    }
    return redirect("/access", 303);
  }

  /* ---- the course itself ---- */
  if (isCoursePath(path)) {
    if (!access.allowed) return blockedPage(env, user, access.status);
    const isPage = path === "/course" || path === "/course/" || path === "/course.html";
    if (isPage && req.method === "GET") await logVisit(env, user, req);
    /* ask assets for the path as given: it canonicalises .html itself */
    const res = await env.ASSETS.fetch(req);
    return harden(res, { isPage });
  }

  /* ---- everything else is public static ---- */
  const res = await env.ASSETS.fetch(req);
  const isLanding = path === "/" || path === "/index.html";
  return harden(res, { inlineScript: isLanding && (res.headers.get("content-type") || "").includes("text/html") });
}

/* ---------------- what counts as the paid course ---------------- */
/* Every course asset lives behind the same gate. Adding a new content or
   test file without adding it here would serve it to anyone. */
const COURSE_ASSET = /^\/(app|content|content-more|content-depth-[a-f]|tests|tests-more|quiz-utils|research)\.js$/;
const isCoursePath = (p) =>
  p === "/course" || p === "/course/" || p === "/course.html" || COURSE_ASSET.test(p);

/* ---------------- public entry ---------------- */
let auth;
let wrapped;

function setup(env) {
  auth ??= createFreebuffAuth({
    clientId: env.FREEBUFF_CLIENT_ID,
    issuer: env.FREEBUFF_ISSUER,
    baseUrl: env.APP_ORIGIN
  });
  const signedIn = auth;
  wrapped ??= signedIn.wrap(async (req, e) => {
    const url = new URL(req.url);
    const path = url.pathname;

    /* webhook arrives without a session and must not be redirected */
    if (path === "/api/stripe-webhook" && req.method === "POST") {
      return handleAuthed(req, e, { sub: "stripe", email: null, name: "Stripe" }, signedIn);
    }

    const user = await signedIn.getUser(req);

    const publicPath =
      path === "/" || path === "/index.html" || path === "/syllabus" || path === "/syllabus/" ||
      path === "/syllabus.html" || path === "/styles.css" || path === "/robots.txt" ||
      path === "/sitemap.xml" || path === "/og.png" || path === "/favicon.ico";

    if (publicPath) {
      if (e.DB && path !== "/styles.css") await ensureSchema(e.DB);
      const res = await e.ASSETS.fetch(req);
      return harden(res, { inlineScript: (path === "/" || path === "/index.html") });
    }

    const gated =
      isCoursePath(path) ||
      path === "/enroll" || path === "/thanks" || path === "/access" ||
      path.startsWith("/access/") || path.startsWith("/api/");

    if (!user) {
      if (!gated) return harden(await e.ASSETS.fetch(req));
      if (path.startsWith("/api/")) return json({ error: "sign in required" }, 401);
      return redirect(`${url.origin}/auth/freebuff/signin?returnTo=${encodeURIComponent(url.pathname + url.search)}`, 302);
    }

    if (e.DB) await ensureSchema(e.DB);
    return handleAuthed(req, e, user, signedIn);
  });
  return wrapped;
}

export default {
  fetch(request, env) {
    return setup(env)(request, env);
  }
};
