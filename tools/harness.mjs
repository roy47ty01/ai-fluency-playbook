/* Local verification for the site Worker: access gate, enrollment,
   owner approval, Stripe signature handling. Runs on a fake D1.
   The gate tests run with PAYWALL=on; free mode is tested in 2b. */
import worker, { handleAuthed, verifyStripeSignature, PLANS } from "../build/worker.js";

const origin = "https://example.com";

/* ---------------- tiny fake D1 ---------------- */
class FakeDB {
  constructor() {
    this.entitlements = new Map();
    this.visitors = new Map();
    this.accessLog = [];
    this.settings = new Map();
    this.orders = new Map();
    this.log = [];
  }
  prepare(sql) {
    const db = this;
    const norm = sql.replace(/\s+/g, " ").trim();
    const stmt = {
      params: [],
      bind(...a) { this.params = a; return this; },
      async run() {
        db.log.push(norm.slice(0, 40));
        if (/^CREATE/i.test(norm)) return { success: true };
        if (/INSERT INTO settings/.test(norm)) {
          db.settings.set(this.params[0], this.params[1]);
          return { success: true };
        }
        if (/INSERT INTO visitors/.test(norm)) {
          const [sub, email, name, first, last] = this.params;
          const prev = db.visitors.get(sub);
          db.visitors.set(sub, {
            sub, email: email || (prev && prev.email), name: name || (prev && prev.name),
            first_seen: prev ? prev.first_seen : first, last_seen: last,
            visits: prev ? prev.visits + 1 : 1
          });
          return { success: true };
        }
        if (/INSERT INTO access_log/.test(norm)) {
          const [sub, email, path, ua, country, at] = this.params;
          db.accessLog.push({ sub, email, path, user_agent: ua, country, at });
          return { success: true };
        }
        if (/INSERT INTO entitlements/.test(norm)) {
          const [email, sub, name, plan, source, note, created, updated] = this.params;
          const prev = db.entitlements.get(email) || {};
          db.entitlements.set(email, {
            email, status: "active",
            sub: sub || prev.sub || null, name: name || prev.name || null,
            plan: plan || prev.plan || null, source: source || prev.source || null,
            note: note || prev.note || null,
            created_at: prev.created_at || created, updated_at: updated
          });
          return { success: true };
        }
        if (/INSERT INTO orders/.test(norm)) {
          const [id, email, plan, amount, status, created] = this.params;
          db.orders.set(id, { id, email, plan, amount, status, created_at: created });
          return { success: true };
        }
        if (/UPDATE entitlements/.test(norm)) {
          const [status, updated, email] = this.params;
          const row = db.entitlements.get(email);
          if (row) { row.status = status; row.updated_at = updated; }
          return { success: true };
        }
        return { success: true };
      },
      async first() {
        if (/FROM settings /.test(norm)) {
          const v = db.settings.get(this.params[0]);
          return v === undefined ? null : { value: v };
        }
        if (/FROM entitlements WHERE email/.test(norm)) {
          const row = db.entitlements.get(this.params[0]);
          return row ? { ...row } : null;
        }
        return null;
      },
      async all() {
        if (/FROM entitlements/.test(norm)) {
          return { results: [...db.entitlements.values()].sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at))) };
        }
        if (/FROM visitors/.test(norm)) return { results: [...db.visitors.values()] };
        if (/FROM access_log/.test(norm)) return { results: [...db.accessLog].reverse().slice(0, 60) };
        return { results: [] };
      }
    };
    return stmt;
  }
}

/* ---------------- helpers ---------------- */
let pass = 0, fail = 0;
function check(name, cond, detail = "") {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name}${detail ? " — " + detail : ""}`); }
}

const ASSETS = {
  fetch: async (req) => {
    const p = new URL(req.url).pathname;
    if (p === "/course" || p === "/course.html") return new Response("<html>COURSE-OK</html>", { headers: { "content-type": "text/html" } });
    if (/^\/(app|content|content-more|content-depth-[a-f]|tests|tests-more|quiz-utils|research)\.js$/.test(p))
      return new Response("export const LESSONS = [];", { headers: { "content-type": "text/javascript" } });
    if (p === "/") return new Response("<html>LANDING-OK</html>", { headers: { "content-type": "text/html" } });
    if (p === "/styles.css") return new Response(":root{}", { headers: { "content-type": "text/css" } });
    if (p === "/syllabus") return new Response("<html>SYLLABUS-OK</html>", { headers: { "content-type": "text/html" } });
    return new Response("missing", { status: 404 });
  }
};

/* every course asset must be behind the gate; if a new one is added to the
   site but not to this list, the harness stops proving it is protected */
const COURSE_ASSETS = [
  "/app.js", "/content.js", "/content-more.js", "/tests.js", "/tests-more.js",
  "/quiz-utils.js", "/research.js", "/content-depth-a.js", "/content-depth-f.js"
];

function makeEnv(db, extra = {}) {
  return {
    ASSETS,
    DB: db,
    APP_ORIGIN: origin,
    FREEBUFF_CLIENT_ID: "test-client",
    FREEBUFF_ISSUER: "https://issuer.invalid",
    PAYWALL: "on",
    ...extra
  };
}

const user = (email, sub = "sub-" + email, name = "Test Person") => ({ sub, email, name });
const post = (path, body, extraHeaders = {}) => {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  return new Request(origin + path, {
    method: "POST",
    body,
    headers: isForm ? { origin, ...extraHeaders } : { origin, "content-type": "application/x-www-form-urlencoded", ...extraHeaders }
  });
};

console.log("\n1. public entry (signed out)");
{
  const env = makeEnv(new FakeDB());
  const landing = await worker.fetch(new Request(origin + "/"), env);
  check("landing is public", landing.status === 200, String(landing.status));
  check("landing has a CSP header", !!landing.headers.get("content-security-policy"));
  check("landing allows its JSON-LD inline script", landing.headers.get("content-security-policy").includes("'unsafe-inline'"));
  check("no sniff header", landing.headers.get("x-content-type-options") === "nosniff");

  const course = await worker.fetch(new Request(origin + "/course"), env);
  check("course redirects to sign-in", course.status === 302 && course.headers.get("location").includes("/auth/freebuff/signin"), String(course.status));

  const api = await worker.fetch(new Request(origin + "/api/me"), env);
  check("api/me is 401 signed out", api.status === 401);

  const syl = await worker.fetch(new Request(origin + "/syllabus"), env);
  check("syllabus is public", syl.status === 200, String(syl.status));
  check("syllabus is not redirected", !syl.headers.get("location"));

  const unknown = await worker.fetch(new Request(origin + "/not-a-page"), env);
  check("unknown path 404s instead of redirecting", unknown.status === 404, String(unknown.status));

  const enroll = await worker.fetch(new Request(origin + "/enroll"), env);
  check("enroll needs sign-in", enroll.status === 302 && (enroll.headers.get("location") || "").includes("returnTo=%2Fenroll"), String(enroll.status));

  const gate = await worker.fetch(new Request(origin + "/app.js"), env);
  check("course js is not public", gate.status === 302, String(gate.status));
}

console.log("\n2. signed in, no access");
{
  const db = new FakeDB();
  const env = makeEnv(db, { OWNER_EMAIL: "site-owner@example.com" });
  const u = user("buyer@example.com");
  const course = await handleAuthed(new Request(origin + "/course"), env, u, null);
  check("course is blocked", course.status === 403, String(course.status));
  const body = await course.text();
  check("blocked page sells the course", body.includes("Get access"));

  for (const asset of COURSE_ASSETS) {
    const res = await handleAuthed(new Request(origin + asset), env, u, null);
    check(`course file blocked: ${asset}`, res.status === 403, String(res.status));
  }

  const enroll = await handleAuthed(new Request(origin + "/enroll?plan=group"), env, u, null);
  check("enroll page renders", enroll.status === 200);
  const html = await enroll.text();
  check("enroll shows the chosen plan price", html.includes("$49"));
  check("enroll says checkout is not switched on", html.includes("isn't switched on yet"));
}

console.log("\n2b. free mode: any signed-in account gets the whole course");
{
  const db = new FakeDB();
  const env = makeEnv(db, { PAYWALL: "", OWNER_EMAIL: "site-owner@example.com" });
  const stranger = user("anyone@example.com");

  const course = await handleAuthed(new Request(origin + "/course"), env, stranger, null);
  check("a signed-in stranger opens the course", course.status === 200, String(course.status));
  check("they get the real course html", (await course.text()).includes("COURSE-OK"));
  check("no entitlement row is needed", db.entitlements.size === 0, String(db.entitlements.size));

  for (const asset of COURSE_ASSETS) {
    const res = await handleAuthed(new Request(origin + asset), env, stranger, null);
    check(`free mode serves ${asset}`, res.status === 200, String(res.status));
  }

  const me = await handleAuthed(new Request(origin + "/api/me"), env, stranger, null);
  const body = await me.json();
  check("api/me reports free access", body.allowed === true && body.status === "free", JSON.stringify(body));

  const enroll = await handleAuthed(new Request(origin + "/enroll"), env, stranger, null);
  check("free mode sends /enroll to the course", enroll.status === 302 && enroll.headers.get("location") === "/course", `${enroll.status} ${enroll.headers.get("location")}`);

  const dash = await handleAuthed(new Request(origin + "/access"), env, stranger, null);
  check("free access does not hand out the owner dashboard", dash.status === 403, String(dash.status));

  /* signed out is still signed out */
  const signedOut = await worker.fetch(new Request(origin + "/course"), env);
  check("free mode still asks visitors to sign in", signedOut.status === 302, String(signedOut.status));

  /* the flag brings the paid gate back, unchanged */
  const paid = makeEnv(new FakeDB(), { OWNER_EMAIL: "site-owner@example.com" });
  const gated = await handleAuthed(new Request(origin + "/course"), paid, stranger, null);
  check("PAYWALL=on puts the gate back", gated.status === 403, String(gated.status));
}

console.log("\n3. request access (no Stripe keys)");
{
  const db = new FakeDB();
  const env = makeEnv(db, { OWNER_EMAIL: "site-owner@example.com" });
  const u = user("student@example.com");
  const fd = new FormData();
  fd.set("plan", "student");
  const res = await handleAuthed(post("/api/enroll", fd), env, u, null);
  check("enroll posts to a redirect", res.status === 303, String(res.status));
  check("redirect says requested", (res.headers.get("location") || "").includes("state=requested"));
  const row = db.entitlements.get("student@example.com");
  check("request stored as pending", !!row && row.status === "pending", JSON.stringify(row));
  check("plan recorded", row && row.plan === "student");

  const again = await handleAuthed(new Request(origin + "/course"), env, u, null);
  check("pending user still blocked", again.status === 403);
  const txt = await again.text();
  check("pending user sees the queue message", txt.includes("queue"));
}

console.log("\n4. cross-origin write is refused");
{
  const db = new FakeDB();
  const env = makeEnv(db, { OWNER_EMAIL: "site-owner@example.com" });
  const fd = new FormData();
  fd.set("plan", "student");
  const bad = new Request(origin + "/api/enroll", { method: "POST", body: fd, headers: { origin: "https://evil.example" } });
  const res = await handleAuthed(bad, env, user("x@example.com"), null);
  check("foreign origin gets 403", res.status === 403, String(res.status));
  check("nothing was written", db.entitlements.size === 0);
}

console.log("\n5. owner claims the site and approves");
{
  const db = new FakeDB();
  const env = makeEnv(db);
  const owner = user("owner@example.com");

  await handleAuthed(new Request(origin + "/course"), env, owner, null);
  check("first account becomes owner", db.settings.get("owner") === "owner@example.com", db.settings.get("owner"));

  const dash = await handleAuthed(new Request(origin + "/access"), env, owner, null);
  check("owner sees the dashboard", dash.status === 200);
  const dashHtml = await dash.text();
  check("dashboard has the add form", dashHtml.includes("Grant access by email"));

  const fd = new FormData();
  fd.set("email", "friend@example.com");
  fd.set("plan", "manual");
  const add = await handleAuthed(post("/access/add", fd), env, owner, null);
  check("adding a person redirects back", add.status === 303, String(add.status));
  check("person is active", db.entitlements.get("friend@example.com")?.status === "active");

  const friendCourse = await handleAuthed(new Request(origin + "/course"), env, user("friend@example.com"), null);
  check("approved person gets the course", friendCourse.status === 200, String(friendCourse.status));
  const courseHtml = await friendCourse.text();
  check("course html served", courseHtml.includes("COURSE-OK"));
  check("visit logged", db.accessLog.some((r) => r.email === "friend@example.com"));

  const revoke = new FormData();
  revoke.set("email", "friend@example.com");
  revoke.set("action", "revoke");
  await handleAuthed(post("/access/set", revoke), env, owner, null);
  check("revoked person active flag removed", db.entitlements.get("friend@example.com").status === "revoked");
  const after = await handleAuthed(new Request(origin + "/course"), env, user("friend@example.com"), null);
  check("revoked person is blocked again", after.status === 403, String(after.status));

  const notOwner = await handleAuthed(new Request(origin + "/access"), env, user("friend@example.com"), null);
  check("non-owner cannot open the dashboard", notOwner.status === 403);

  /* a squatter can always be displaced by setting OWNER_EMAIL */
  const fixed = makeEnv(db, { OWNER_EMAIL: "owner@example.com" });
  const squatter = await handleAuthed(new Request(origin + "/access"), fixed, user("random@example.com"), null);
  check("OWNER_EMAIL beats an auto-claimed owner", squatter.status === 403, String(squatter.status));
  const realOwner = await handleAuthed(new Request(origin + "/access"), fixed, user("owner@example.com"), null);
  check("configured owner still gets in", realOwner.status === 200, String(realOwner.status));
}

console.log("\n5b. the owner never pays, and never sees a paywall");
{
  const db = new FakeDB();
  const env = makeEnv(db, { OWNER_EMAIL: "me@example.com" });
  const me = user("me@example.com");

  const course = await handleAuthed(new Request(origin + "/course"), env, me, null);
  check("owner opens the course with no payment", course.status === 200, String(course.status));
  check("owner gets the real course html", (await course.text()).includes("COURSE-OK"));
  check("owner needs no entitlement row", db.entitlements.size === 0, String(db.entitlements.size));

  for (const asset of COURSE_ASSETS) {
    const res = await handleAuthed(new Request(origin + asset), env, me, null);
    check(`owner gets ${asset}`, res.status === 200, String(res.status));
  }

  const enroll = await handleAuthed(new Request(origin + "/enroll"), env, me, null);
  check("owner is sent from /enroll straight to the course", enroll.status === 302 && enroll.headers.get("location") === "/course", `${enroll.status} ${enroll.headers.get("location")}`);

  const dash = await handleAuthed(new Request(origin + "/access"), env, me, null);
  const dashHtml = await dash.text();
  check("dashboard tells the owner access is free", /without paying/i.test(dashHtml));

  /* one OWNER_EMAIL value may hold several addresses */
  const multi = makeEnv(new FakeDB(), { OWNER_EMAIL: " me@example.com , work@example.com " });
  const work = await handleAuthed(new Request(origin + "/course"), multi, user("work@example.com"), null);
  check("a second listed owner email also gets in", work.status === 200, String(work.status));
  const stranger = await handleAuthed(new Request(origin + "/access"), multi, user("someone@example.com"), null);
  check("an unlisted address is not the owner", stranger.status === 403, String(stranger.status));

  /* a request for access must not unlock anything by itself */
  const pendingDb = new FakeDB();
  const pendingEnv = makeEnv(pendingDb, { OWNER_EMAIL: "me@example.com" });
  const fd = new FormData();
  fd.set("plan", "student");
  await handleAuthed(post("/api/enroll", fd), pendingEnv, user("hopeful@example.com"), null);
  check("request leaves the row pending", pendingDb.entitlements.get("hopeful@example.com")?.status === "pending");
  const blocked = await handleAuthed(new Request(origin + "/course"), pendingEnv, user("hopeful@example.com"), null);
  check("a pending request does not open the course", blocked.status === 403, String(blocked.status));
  const blockedJs = await handleAuthed(new Request(origin + "/content.js"), pendingEnv, user("hopeful@example.com"), null);
  check("a pending request does not open the course files", blockedJs.status === 403, String(blockedJs.status));
}

console.log("\n6. invite list");
{
  const db = new FakeDB();
  const env = makeEnv(db, { INVITE_EMAILS: "a@school.edu, B@School.edu" });
  const res = await handleAuthed(new Request(origin + "/course"), env, user("b@school.edu"), null);
  check("invited email gets in (case-insensitive)", res.status === 200, String(res.status));
}

console.log("\n7. stripe signature");
{
  const secret = "whsec_test_secret";
  const payload = JSON.stringify({ type: "checkout.session.completed", data: { object: { id: "cs_1" } } });
  const t = Math.floor(Date.now() / 1000);
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(`${t}.${payload}`)));
  const sig = [...mac].map((b) => b.toString(16).padStart(2, "0")).join("");

  check("valid signature passes", await verifyStripeSignature(payload, `t=${t},v1=${sig}`, secret));
  check("wrong secret fails", !(await verifyStripeSignature(payload, `t=${t},v1=${sig}`, "other")));
  check("tampered payload fails", !(await verifyStripeSignature(payload + " ", `t=${t},v1=${sig}`, secret)));
  check("stale timestamp fails", !(await verifyStripeSignature(payload, `t=${t - 4000},v1=${sig}`, secret)));
  check("missing header fails", !(await verifyStripeSignature(payload, null, secret)));
}

console.log("\n8. webhook grants access");
{
  const db = new FakeDB();
  const secret = "whsec_test_secret";
  const env = makeEnv(db, { STRIPE_WEBHOOK_SECRET: secret, STRIPE_SECRET_KEY: "sk_test" });
  const payload = JSON.stringify({
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_123", payment_status: "paid", amount_total: 1900,
        customer_details: { email: "paid@example.com" },
        client_reference_id: "sub-paid",
        metadata: { plan: "student", sub: "sub-paid", email: "paid@example.com" }
      }
    }
  });
  const t = Math.floor(Date.now() / 1000);
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(`${t}.${payload}`)));
  const sig = [...mac].map((b) => b.toString(16).padStart(2, "0")).join("");

  const res = await worker.fetch(new Request(origin + "/api/stripe-webhook", {
    method: "POST", body: payload, headers: { "stripe-signature": `t=${t},v1=${sig}`, "content-type": "application/json" }
  }), env);
  check("webhook accepts a good signature", res.status === 200, String(res.status));
  check("buyer granted active access", db.entitlements.get("paid@example.com")?.status === "active", JSON.stringify(db.entitlements.get("paid@example.com")));
  check("order recorded", db.orders.get("cs_test_123")?.amount === 1900);
  check("source marked stripe", db.entitlements.get("paid@example.com")?.source === "stripe");

  const badRes = await worker.fetch(new Request(origin + "/api/stripe-webhook", {
    method: "POST", body: payload, headers: { "stripe-signature": "t=1,v1=deadbeef" }
  }), env);
  check("webhook rejects a bad signature", badRes.status === 400, String(badRes.status));
}

console.log("\n9. plan data");
{
  check("three plans", Object.keys(PLANS).length === 3);
  check("prices are numbers", Object.values(PLANS).every((p) => typeof p.price === "number" && p.price > 0));
  check("student is the cheapest", PLANS.student.price < PLANS.group.price && PLANS.group.price < PLANS.class.price);
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
