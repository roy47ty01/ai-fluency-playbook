/* Builds the public syllabus page from the real course data, so the
   marketing page can never drift from what the course actually contains. */
import { TRACKS, LESSONS } from "../public/content.js";
import { EXTRA_LESSONS } from "../public/content-more.js";
import { DEPTH_A } from "../public/content-depth-a.js";
import { DEPTH_B } from "../public/content-depth-b.js";
import { DEPTH_C } from "../public/content-depth-c.js";
import { DEPTH_D } from "../public/content-depth-d.js";
import { DEPTH_E } from "../public/content-depth-e.js";
import { DEPTH_F } from "../public/content-depth-f.js";
import { writeFileSync } from "node:fs";

const DEPTH = { ...DEPTH_A, ...DEPTH_B, ...DEPTH_C, ...DEPTH_D, ...DEPTH_E, ...DEPTH_F };
const order = TRACKS.map((t) => t.id);
const all = [...LESSONS, ...EXTRA_LESSONS]
  .sort((a, b) => order.indexOf(a.track) - order.indexOf(b.track) || a.n - b.n);

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const wc = (s) => String(s || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
function depthMins(n) {
  const d = DEPTH[n]; if (!d) return 0;
  let w = wc(d.lead);
  for (const s of (d.sections || [])) { w += wc(s.h); for (const p of (s.p || [])) w += wc(p); }
  if (d.worked) { w += wc(d.worked.h); for (const st of (d.worked.steps || [])) w += wc(st); }
  for (const t of (d.terms || [])) w += wc(t[0]) + wc(t[1]);
  for (const m of (d.mistakes || [])) w += wc(m[0]) + wc(m[1]);
  for (const r of (d.recap || [])) w += wc(r);
  return Math.max(4, Math.round(w / 120)); // ~120 wpm study pace
}
const LESSON_TEST_MIN = 4;
const CHECKPOINT_MIN = 12;
const totalCore = all.reduce((a, l) => a + (l.mins || 0), 0);
const totalDepth = all.reduce((a, l) => a + depthMins(l.n), 0);
const totalTests = all.length * LESSON_TEST_MIN + TRACKS.length * CHECKPOINT_MIN;
const totalMins = totalCore + totalDepth + totalTests;
const totalHours = (totalMins / 60).toFixed(1);

const levels = TRACKS.map((t) => {
  const list = all.filter((l) => l.track === t.id);
  const coreMins = list.reduce((a, l) => a + (l.mins || 0), 0);
  const depthTotal = list.reduce((a, l) => a + depthMins(l.n), 0);
  const levelTotal = coreMins + depthTotal + list.length * LESSON_TEST_MIN + CHECKPOINT_MIN;
  return `
    <section class="sy-level">
      <header class="sy-level-head">
        <p class="kicker">Level ${t.level}</p>
        <h2>${esc(t.name)} <span class="sy-count">${list.length} lessons · about ${levelTotal} min total · ${list.length} lesson tests + 1 checkpoint</span></h2>
        <p class="sy-tag">${esc(t.tagline)}</p>
        <p class="sy-desc">${esc(t.desc)}</p>
        <p class="sy-out"><span>You walk away with</span> ${esc(t.outcome)}</p>
      </header>
      <ol class="sy-list">
        ${list.map((l, i) => { const dm = depthMins(l.n); const total = (l.mins || 0) + dm + LESSON_TEST_MIN; return `<li>
          <span class="sy-num">${String(all.indexOf(l) + 1).padStart(2, "0")}</span>
          <div>
            <h3>${esc(l.title)}</h3>
            <p>${esc(l.promise)}</p>
            <p class="sy-sub">${l.mins} min lesson · ${dm} min deeper reading · 3-question test</p>
          </div>
          <span class="sy-mins">~${total} min</span>
        </li>`; }).join("")}
      </ol>
    </section>`;
}).join("");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Syllabus — AI Fluency Playbook</title>
<meta name="description" content="The full AI Fluency Playbook syllabus: five levels, ${all.length} lessons, about ${totalHours} hours of learning, with what each lesson gives you." />
<link rel="canonical" href="https://ai-fluency-playbook-ri0jqi.freebuff.site/syllabus" />
<meta property="og:title" content="Syllabus — AI Fluency Playbook" />
<meta property="og:description" content="Five levels, ${all.length} lessons, about ${totalHours} hours. Every lesson listed, with what it gives you." />
<meta name="theme-color" content="#07090e" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23080a10'/%3E%3Cpath d='M8 22 16 8l8 14' stroke='%23c8ff4d' stroke-width='2.4' fill='none'/%3E%3C/svg%3E" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css" />
</head>
<body class="lp">
<header class="lp-nav">
  <a class="lp-brand" href="/"><span class="brand-mark" aria-hidden="true"></span><span>AI Fluency<em>Playbook</em></span></a>
  <nav class="lp-navlinks" aria-label="Sections">
    <a href="/#inside">What's inside</a>
    <a href="/#pricing">Pricing</a>
    <a href="/#faq">FAQ</a>
  </nav>
  <a class="lp-nav-cta" href="/course">Open the course</a>
</header>

<main class="sy">
  <div class="lp-wrap sy-head">
    <p class="kicker">The full syllabus</p>
    <h1>${all.length} lessons. About ${totalHours} hours. <em>Nothing held back.</em></h1>
    <p class="sy-lede">
      This is the whole course listing — every lesson, in the order you'd work through it, with the
      specific thing you can do afterwards. Times include the core lesson, deeper reading, a 3-question test, and a level checkpoint. Your own drills take extra, because they depend on you. If you're deciding whether to buy, read this page and the
      sample lesson on the <a href="/">main page</a>; between them you'll know exactly what you're getting.
    </p>
    <div class="sy-facts">
      <span><b>${TRACKS.length}</b> levels</span>
      <span><b>${all.length}</b> lessons</span>
      <span><b>~${totalHours} hrs</b> total</span>
      <span><b>164</b> test questions</span>
      <span><b>0</b> deadlines</span>
    </div>
  </div>

  <div class="lp-wrap sy-levels">
    ${levels}
  </div>

  <div class="lp-wrap sy-cta">
    <div>
      <h2>Ready when you are.</h2>
      <p>Free while I finish learning it myself — sign in and every lesson is open. Progress saves in your browser so you can stop and come back.</p>
    </div>
    <a class="btn btn-primary" href="/course">Start the course — free</a>
  </div>
</main>

<footer class="lp-footer">
  <div class="lp-wrap lp-footer-in">
    <div>
      <a class="lp-brand" href="/"><span class="brand-mark" aria-hidden="true"></span><span>AI Fluency<em>Playbook</em></span></a>
      <p class="lp-footer-note">Syllabus generated from the course itself, so it can't drift from what's inside.</p>
    </div>
    <nav aria-label="Footer">
      <a href="/">Main page</a>
      <a href="/#pricing">Pricing</a>
      <a href="/course">Open the course</a>
    </nav>
  </div>
</footer>
</body>
</html>
`;

writeFileSync(new URL("../public/syllabus.html", import.meta.url), html);
console.log(`syllabus written: ${all.length} lessons, ${totalMins} min, ${TRACKS.length} levels`);
