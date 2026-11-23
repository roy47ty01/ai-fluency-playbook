/* Local preview server that mimics the deployed Worker's headers, so you can
   see the same CSP and routing the real site sends. Not deployed.
   Run with: npm run preview   (then open http://localhost:3100) */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = new URL("../public/", import.meta.url).pathname;
const PORT = Number(process.env.PORT || 3100);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json"
};

const CSP = [
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

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  let path = decodeURIComponent(url.pathname);
  if (path === "/" || path === "/index.html") path = "/index.html";
  if (path === "/course") path = "/course.html";
  if (path === "/syllabus") path = "/syllabus.html";

  const safe = normalize(path).replace(/^(\.\.[/\\])+/, "");
  try {
    const body = await readFile(join(ROOT, safe));
    const type = TYPES[extname(safe)] || "application/octet-stream";
    const inline = path === "/index.html";
    res.writeHead(200, {
      "content-type": type,
      "content-security-policy": `${CSP}; script-src 'self' https://cdn.jsdelivr.net${inline ? " 'unsafe-inline'" : ""}`,
      "x-content-type-options": "nosniff",
      "referrer-policy": "same-origin",
      "cache-control": "no-store"
    });
    res.end(body);
  } catch (e) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
  }
}).listen(PORT, "0.0.0.0", () => console.log(`preview server on http://localhost:${PORT}`));
