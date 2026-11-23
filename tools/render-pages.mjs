/* Renders the signed-in Worker pages to static files in build/ for visual review.
   Run with: npm run build && node tools/render-pages.mjs */
import { handleAuthed } from "../build/worker.js";
import { writeFileSync, mkdirSync } from "node:fs";

class DB {
  constructor() { this.rows = new Map(); this.visitors = []; this.log = []; }
  prepare(sql) {
    const norm = sql.replace(/\s+/g, " ").trim();
    const self = this;
    return {
      params: [],
      bind(...a) { this.params = a; return this; },
      async run() {
        if (/INSERT INTO entitlements/.test(norm)) {
          const [e, s, n, p, src, note, c, u] = this.params;
          const prev = self.rows.get(e) || {};
          self.rows.set(e, { email: e, sub: s || prev.sub, name: n || prev.name, plan: p, status: "active", source: src, note, created_at: prev.created_at || c, updated_at: u });
        } else if (/UPDATE entitlements/.test(norm)) {
          const [st, up, em] = this.params;
          const r = self.rows.get(em);
          if (r) { r.status = st; r.updated_at = up; }
        } else if (/INSERT INTO visitors/.test(norm)) {
          self.visitors.push({ email: this.params[1], name: this.params[2], first_seen: this.params[3], last_seen: this.params[4], visits: 2 });
        } else if (/INSERT INTO access_log/.test(norm)) {
          self.log.push({ email: this.params[1], path: this.params[2], at: this.params[5], country: "NL" });
        }
        return { success: true };
      },
      async first() {
        if (/FROM settings /.test(norm)) return null;
        if (/FROM entitlements WHERE email/.test(norm)) return self.rows.get(this.params[0]) || null;
        return null;
      },
      async all() {
        if (/FROM entitlements/.test(norm)) return { results: [...self.rows.values()] };
        if (/FROM visitors/.test(norm)) return { results: self.visitors };
        if (/FROM access_log/.test(norm)) return { results: self.log };
        return { results: [] };
      }
    };
  }
}

const env = {
  OWNER_EMAIL: "owner@example.com",
  APP_ORIGIN: "https://example.com",
  ASSETS: { fetch: async () => new Response("x") },
  DB: new DB()
};

const buyer = { sub: "sub-1", email: "buyer@example.com", name: "Ama Mensah" };
const fd = new FormData();
fd.set("plan", "group");
const post = await handleAuthed(
  new Request("https://example.com/api/enroll", { method: "POST", body: fd, headers: { origin: "https://example.com" } }),
  env, buyer, null
);
const row = env.DB.rows.get("buyer@example.com");

const enroll = await handleAuthed(new Request("https://example.com/enroll?plan=group&state=requested"), env, buyer, null);
const owner = { sub: "sub-2", email: "owner@example.com", name: "Owner" };
env.DB.rows.set("friend@example.com", { email: "friend@example.com", name: "Kai", plan: "manual", status: "active", source: "owner", created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
const dash = await handleAuthed(new Request("https://example.com/access"), env, owner, null);

mkdirSync(new URL("../build/", import.meta.url), { recursive: true });
writeFileSync(new URL("../build/preview-enroll.html", import.meta.url), await enroll.text());
writeFileSync(new URL("../build/preview-access.html", import.meta.url), await dash.text());
console.log("enroll:", post.status, "request status:", row && row.status, "| enroll page:", enroll.status, "| dashboard:", dash.status);
