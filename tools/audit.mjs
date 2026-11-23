/* Static audit: structure, links, a11y basics, contrast, CSS/JS sanity.
   Run with: npm run audit */
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";

const DIR = new URL("../public/", import.meta.url).pathname;
const files = (await readdir(DIR)).filter((f) => !f.startsWith("_"));
const htmlFiles = files.filter((f) => f.endsWith(".html"));

let problems = 0;
const fail = (msg) => { problems++; console.log(`  ✗ ${msg}`); };
const ok = (msg) => console.log(`  ✓ ${msg}`);

const read = (f) => readFile(join(DIR, f), "utf8");

/* ---------- html ---------- */
const knownRoutes = new Set(["/", "/course", "/syllabus", "/enroll", "/thanks", "/access", "/api/me"]);
const fileTargets = new Set(files);

for (const file of htmlFiles) {
  console.log(`\n${file}`);
  const html = await read(file);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  dupes.length ? fail(`duplicate id: ${[...new Set(dupes)].join(", ")}`) : ok(`${ids.length} ids, all unique`);

  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  h1 === 1 ? ok("exactly one h1") : fail(`${h1} h1 elements`);

  if (!/<html lang="/.test(html)) fail("missing html lang");
  if (!/<meta name="viewport"/.test(html)) fail("missing viewport");

  const title = (html.match(/<title>(.*?)<\/title>/s) || [, ""])[1].trim();
  title.length >= 15 && title.length <= 70 ? ok(`title ${title.length} chars`) : fail(`title length ${title.length}: "${title}"`);

  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [, ""])[1];
  if (!desc) fail("missing meta description");
  else if (desc.length < 60 || desc.length > 175) fail(`description ${desc.length} chars`);
  else ok(`description ${desc.length} chars`);

  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\balt=/.test(t));
  noAlt.length ? fail(`${noAlt.length} img without alt`) : ok(`${imgs.length} images, all have alt`);

  const targets = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map((m) => m[0]);
  const unsafe = targets.filter((t) => !/rel="[^"]*noopener/.test(t));
  unsafe.length ? fail(`${unsafe.length} target=_blank without noopener`) : ok(`${targets.length} new-tab links, all noopener`);

  const buttons = [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)];
  const emptyButtons = buttons.filter(([, attrs, inner]) =>
    !inner.replace(/<[^>]*>/g, "").trim() && !/aria-label=/.test(attrs));
  emptyButtons.length ? fail(`${emptyButtons.length} button with no accessible name`) : ok(`${buttons.length} buttons all named`);

  const inputs = [...html.matchAll(/<input\b[^>]*>/g)].map((m) => m[0]);
  const unlabeled = inputs.filter((t) => {
    if (/type="(hidden|checkbox)"/.test(t)) return false;
    if (/aria-label=/.test(t) || /\bid="/.test(t)) return false;
    return true;
  });
  const idRefs = [...html.matchAll(/<label[^>]*for="([^"]+)"/g)].map((m) => m[1]);
  const inputsWithId = inputs.filter((t) => /\bid="([^"]+)"/.test(t));
  const missingFor = inputsWithId.filter((t) => {
    if (/type="(hidden|checkbox)"/.test(t)) return false;
    const id = t.match(/\bid="([^"]+)"/)[1];
    return !idRefs.includes(id) && !/aria-label=/.test(t);
  });
  missingFor.length ? fail(`${missingFor.length} input with id but no label/aria-label`) : ok("inputs labelled");

  const hrefs = [...html.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]);
  const broken = [...new Set(hrefs)].filter((h) => {
    if (knownRoutes.has(h) || h === "/") return false;
    if (h === "/robots.txt" || h === "/sitemap.xml" || h === "/og.png") return true;
    return !fileTargets.has(h.replace(/^\//, ""));
  });
  broken.length ? fail(`links to nothing: ${broken.join(", ")}`) : ok(`${new Set(hrefs).size} internal links resolve`);

  if (/<script(?![^>]*src=)/.test(html) && !/<script type="application\/ld\+json">/.test(html)) {
    fail("inline <script> that is not JSON-LD (CSP has no unsafe-inline)");
  }
}

/* ---------- css ---------- */
console.log("\nstyles.css");
const css = await read("styles.css");
const open = (css.match(/{/g) || []).length;
const close = (css.match(/}/g) || []).length;
open === close ? ok(`braces balanced (${open})`) : fail(`unbalanced braces: ${open} { vs ${close} }`);

const decls = [...css.matchAll(/[;{]\s*([a-z-]+)\s*:/g)].length;
ok(`${decls} declarations`);
if (/allowedHosts\s*:\s*true/.test(css)) fail("allowedHosts: true found");

/* contrast of the palette against the page background */
const lum = (hex) => {
  const c = hex.replace("#", "").match(/../g).map((h) => parseInt(h, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const vars = Object.fromEntries([...css.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
for (const [name, hex] of Object.entries(vars)) {
  if (!["text", "muted", "dim", "line"].includes(name)) continue;
  const r = ratio(hex, vars.ink);
  const min = name === "text" ? 7 : 4.5;
  r >= min ? ok(`--${name} ${hex} on --ink: ${r.toFixed(2)}:1`) : fail(`--${name} ${hex} on --ink: ${r.toFixed(2)}:1 (needs ${min})`);
}
const dimOnPanel = ratio(vars.dim, vars.panel);
dimOnPanel >= 4.5 ? ok(`--dim on --panel: ${dimOnPanel.toFixed(2)}:1`) : fail(`--dim on --panel: ${dimOnPanel.toFixed(2)}:1`);

/* ---------- js ---------- */
console.log("\njs modules");
const jsModules = [
  "app.js", "landing-3d.js", "content.js", "content-more.js", "tests.js", "tests-more.js", "research.js", "quiz-utils.js",
  "content-depth-a.js", "content-depth-b.js", "content-depth-c.js",
  "content-depth-d.js", "content-depth-e.js", "content-depth-f.js"
];
for (const file of jsModules) {
  const js = await read(file);
  const tmp = join(tmpdir(), `${file}.mjs`);
  await writeFile(tmp, js);
  try {
    execFileSync("node", ["--check", tmp], { stdio: "pipe" });
    ok(`${file} passes node --check`);
  } catch (e) {
    fail(`${file}: ${(e.stderr || "").toString().split("\n").slice(0, 3).join(" ")}`);
  }
  if (/\bdebugger\b/.test(js)) fail(`${file} contains debugger`);
}

/* content integrity */
const { TRACKS, LESSONS } = await import(new URL("content.js", `file://${DIR}`));
const { EXTRA_LESSONS, PLAIN, VIDEOS } = await import(new URL("content-more.js", `file://${DIR}`));
const all = [...LESSONS, ...EXTRA_LESSONS];
console.log("\ncontent");
const ns = all.map((l) => l.n);
new Set(ns).size === ns.length ? ok(`${all.length} lessons, unique numbers`) : fail("duplicate lesson numbers");
const missingPlain = all.filter((l) => !PLAIN[l.n]);
missingPlain.length ? fail(`lessons without plain text: ${missingPlain.map((l) => l.n).join(",")}`) : ok("every lesson has plain + slow text");
const unknownTracks = all.filter((l) => !TRACKS.some((t) => t.id === l.track));
unknownTracks.length ? fail(`unknown track on ${unknownTracks.length} lessons`) : ok("every lesson is on a real track");
const emptyFields = all.filter((l) => !l.title || !l.promise || !l.why || !l.steps?.length || !l.prompt || !l.check);
emptyFields.length ? fail(`incomplete lessons: ${emptyFields.map((l) => l.n).join(",")}`) : ok("no empty lesson fields");
ok(`${VIDEOS.length} videos, ${TRACKS.length} tracks`);

/* ---------- depth layer ---------- */
console.log("\ndepth");
const DEPTH = {};
for (const s of ["a", "b", "c", "d", "e", "f"]) {
  const mod = await import(new URL(`content-depth-${s}.js`, `file://${DIR}`));
  const key = `DEPTH_${s.toUpperCase()}`;
  if (!mod[key]) fail(`content-depth-${s}.js does not export ${key}`);
  else Object.assign(DEPTH, mod[key]);
}
const words = (s) => String(s).split(/\s+/).filter(Boolean).length;
const noDepth = all.filter((l) => !DEPTH[l.n]);
noDepth.length ? fail(`lessons without deeper reading: ${noDepth.map((l) => l.n).join(",")}`) : ok("every lesson has a deeper-reading layer");
const thin = all.filter((l) => {
  const d = DEPTH[l.n];
  if (!d) return false;
  const n = words(d.lead) + d.sections.reduce((a, s) => a + s.p.reduce((b, p) => b + words(p), 0), 0) + d.worked.steps.reduce((a, s) => a + words(s), 0);
  return d.sections.length < 2 || n < 250;
});
thin.length ? fail(`depth too thin (needs 2+ sections, 250+ words): ${thin.map((l) => l.n).join(",")}`) : ok("every deep layer has 2+ sections and 250+ words of new teaching");
const badShape = all.filter((l) => {
  const d = DEPTH[l.n];
  return d && (!d.worked?.steps?.length || d.terms?.length < 2 || d.mistakes?.length < 2 || d.recap?.length !== 3);
});
badShape.length ? fail(`incomplete depth shape: ${badShape.map((l) => l.n).join(",")}`) : ok("every deep layer has a worked example, terms, mistakes and a 3-point recap");
const deepWords = all.reduce((a, l) => {
  const d = DEPTH[l.n];
  if (!d) return a;
  return a + words(d.lead) + d.sections.reduce((x, s) => x + s.p.reduce((y, p) => y + words(p), 0), 0);
}, 0);
ok(`${deepWords.toLocaleString()} words of new depth across ${all.length} lessons (average ${Math.round(deepWords / all.length)} per lesson)`);

/* ---------- tests ---------- */
console.log("\ntests");
const { LESSON_TESTS } = await import(new URL("tests.js", `file://${DIR}`));
const { LESSON_TESTS_2, MODULE_TESTS } = await import(new URL("tests-more.js", `file://${DIR}`));
const TESTS = { ...LESSON_TESTS, ...LESSON_TESTS_2 };
const noTest = all.filter((l) => !TESTS[l.n]);
noTest.length ? fail(`lessons without a test: ${noTest.map((l) => l.n).join(",")}`) : ok("every lesson has a test");
const badTest = [];
for (const [n, t] of Object.entries(TESTS)) {
  if (!t.qs || t.qs.length < 3) badTest.push(`${n}: fewer than 3 questions`);
  if (typeof t.pass !== "number" || t.pass < 1 || t.pass > t.qs.length) badTest.push(`${n}: bad pass mark`);
  t.qs.forEach(([q, opts, correct, why], i) => {
    if (!q || !why) badTest.push(`${n}.${i + 1}: missing question or explanation`);
    if (!Array.isArray(opts) || opts.length !== 4) badTest.push(`${n}.${i + 1}: needs exactly 4 options`);
    if (new Set(opts).size !== opts.length) badTest.push(`${n}.${i + 1}: duplicate options`);
    if (!Number.isInteger(correct) || correct < 0 || correct >= opts.length) badTest.push(`${n}.${i + 1}: correct index out of range`);
  });
}
badTest.length ? fail(`test problems: ${badTest.slice(0, 6).join("; ")}`) : ok(`${Object.keys(TESTS).length} lesson tests, 4 options each, explanations present`);
const missingTrackTest = TRACKS.filter((t) => !MODULE_TESTS[t.id]);
missingTrackTest.length ? fail(`tracks without a checkpoint: ${missingTrackTest.map((t) => t.id).join(",")}`) : ok(`checkpoint for all ${TRACKS.length} levels`);
const badMod = [];
for (const [id, t] of Object.entries(MODULE_TESTS)) {
  if (t.qs.length !== 10) badMod.push(`${id}: ${t.qs.length} questions`);
  if (t.pass !== 8) badMod.push(`${id}: pass mark ${t.pass}`);
  t.qs.forEach(([q, opts, correct, why], i) => {
    if (!q || !why || opts.length !== 4 || !Number.isInteger(correct) || correct < 0 || correct > 3) badMod.push(`${id}.${i + 1}`);
    if (new Set(opts).size !== opts.length) badMod.push(`${id}.${i + 1}: duplicate options`);
  });
}
badMod.length ? fail(`checkpoint problems: ${badMod.join("; ")}`) : ok("every checkpoint: 10 questions, pass 8");
const allQ = [...Object.values(TESTS).flatMap((t) => t.qs.map((q) => q[0])), ...Object.values(MODULE_TESTS).flatMap((t) => t.qs.map((q) => q[0]))];
new Set(allQ).size === allQ.length ? ok(`${allQ.length} questions, all distinct`) : fail(`duplicate question text (${allQ.length - new Set(allQ).size})`);
const { prepare } = await import(new URL("quiz-utils.js", `file://${DIR}`));
const spread = [0, 0, 0, 0];
for (const t of [...Object.values(TESTS), ...Object.values(MODULE_TESTS)]) for (const q of t.qs) spread[prepare(q).correct]++;
const totalQ = spread.reduce((a, b) => a + b, 0);
const minShare = Math.min(...spread) / totalQ;
minShare > 0.15
  ? ok(`after shuffling, correct answers spread across positions ${spread.join("/")} (min ${(minShare * 100).toFixed(0)}%)`)
  : fail(`answer positions are skewed even after shuffling: ${spread.join("/")}`);
const shuffleStable = prepare(TESTS[1].qs[0]).opts.join("|") === prepare(TESTS[1].qs[0]).opts.join("|");
shuffleStable ? ok("option order is stable between renders") : fail("option shuffle is not deterministic");
const shuffled = prepare(TESTS[1].qs[0]);
shuffled.opts.includes(TESTS[1].qs[0][1][TESTS[1].qs[0][2]]) && shuffled.opts[shuffled.correct] === TESTS[1].qs[0][1][TESTS[1].qs[0][2]]
  ? ok("the correct answer survives the shuffle with its index updated")
  : fail("shuffle lost or mis-indexed the correct answer");

/* ---------- research ---------- */
console.log("\nresearch");
const { DESIGN, FREE_COURSES, TECHNICAL_SOURCES, LEARNING_SOURCES, LIMITS } = await import(new URL("research.js", `file://${DIR}`));
DESIGN.length >= 4 ? ok(`${DESIGN.length} design rationale notes with citations`) : fail("too few design rationale notes");
const badCourses = FREE_COURSES.filter((c) => !c.url?.startsWith("https://") || !c.cost || !c.why);
badCourses.length ? fail(`${badCourses.length} free courses missing url, cost or why`) : ok(`${FREE_COURSES.length} free courses, all with a link, a cost and a reason`);
TECHNICAL_SOURCES.length >= 4 && LEARNING_SOURCES.length >= 4 ? ok(`${TECHNICAL_SOURCES.length} technical + ${LEARNING_SOURCES.length} learning sources`) : fail("too few cited sources");
LIMITS.length >= 4 ? ok(`${LIMITS.length} stated limits`) : fail("limits section too short");

console.log(`\n${problems} problem${problems === 1 ? "" : "s"} found\n`);
process.exit(problems ? 1 : 0);
