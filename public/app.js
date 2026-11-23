/* ============================================================
   The AI Fluency Playbook — app
   ============================================================ */
import { TRACKS, LESSONS, QUIZ, PROMPTS, RULES, GLOSSARY, SOURCES } from "./content.js";
import { EXTRA_LESSONS, PLAIN, VIDEOS, EXTRA_PROMPTS } from "./content-more.js";
import { DEPTH_A } from "./content-depth-a.js";
import { DEPTH_B } from "./content-depth-b.js";
import { DEPTH_C } from "./content-depth-c.js";
import { DEPTH_D } from "./content-depth-d.js";
import { DEPTH_E } from "./content-depth-e.js";
import { DEPTH_F } from "./content-depth-f.js";
import { LESSON_TESTS } from "./tests.js";
import { LESSON_TESTS_2, MODULE_TESTS } from "./tests-more.js";
import { DESIGN, FREE_COURSES, TECHNICAL_SOURCES, LEARNING_SOURCES, LIMITS } from "./research.js";
import { prepare } from "./quiz-utils.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------------- content merges ---------------- */
const DEPTH = { ...DEPTH_A, ...DEPTH_B, ...DEPTH_C, ...DEPTH_D, ...DEPTH_E, ...DEPTH_F };
const TESTS = { ...LESSON_TESTS, ...LESSON_TESTS_2 };
const LESSON_Q = Object.values(TESTS).reduce((a, t) => a + t.qs.length, 0);
const MODULE_Q = Object.values(MODULE_TESTS).reduce((a, t) => a + t.qs.length, 0);
const TOTAL_Q = LESSON_Q + MODULE_Q;

/* ---------------- state ---------------- */
const KEYS = { done: "aifp.done.v2", name: "aifp.name.v2", start: "aifp.start.v2", level: "aifp.level.v2", comfort: "aifp.comfort.v2", quiz: "aifp.quiz.v3", mod: "aifp.mod.v3" };
const store = {
  get(k, f) { try { const v = localStorage.getItem(k); return v === null ? f : JSON.parse(v); } catch (e) { return f; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};

let done = new Set(store.get(KEYS.done, []));
let passed = new Set(store.get(KEYS.quiz, []));
let modPassed = store.get(KEYS.mod, {});
const testState = new Map();
const modState = new Map();
let activeTrack = "all";
const startedAt = store.get(KEYS.start, null) || new Date().toISOString().slice(0, 10);
store.set(KEYS.start, startedAt);

/* the whole curriculum: main lessons plus the slower extras, in level order */
const TRACK_ORDER = TRACKS.map((t) => t.id);
const CURRICULUM = [...LESSONS, ...EXTRA_LESSONS]
  .sort((a, b) => TRACK_ORDER.indexOf(a.track) - TRACK_ORDER.indexOf(b.track) || a.n - b.n)
  .map((l, i) => ({ ...l, idx: i + 1 }));
const totalLessons = CURRICULUM.length;
const ALL_PROMPTS = [...PROMPTS, ...EXTRA_PROMPTS];

function rankOf(count) {
  let acc = 0;
  for (const t of TRACKS) {
    acc += CURRICULUM.filter((l) => l.track === t.id).length;
    if (count <= acc && count > 0) return t.name;
  }
  return count > 0 ? "Playbook complete" : "Complete lessons to rank up";
}

/* ---------------- toast + copy ---------------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2100);
}
async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (err) {}
    ta.remove();
  }
  if (btn) {
    btn.classList.add("copied");
    btn.textContent = "copied";
    setTimeout(() => { btn.classList.remove("copied"); btn.textContent = btn.dataset.label || "copy"; }, 1500);
  }
  toast("Copied — paste it and replace the brackets.");
}

/* ---------------- curriculum ---------------- */
function renderTabs() {
  const el = $("#trackTabs");
  el.innerHTML =
    `<button class="track-tab ${activeTrack === "all" ? "active" : ""}" type="button" data-track="all"><b>★</b> Everything <span class="tt-prog">${done.size}/${totalLessons}</span></button>` +
    TRACKS.map((t) => {
      const total = CURRICULUM.filter((l) => l.track === t.id).length;
      const n = CURRICULUM.filter((l) => l.track === t.id && done.has(l.n)).length;
      return `<button class="track-tab ${activeTrack === t.id ? "active" : ""}" type="button" data-track="${t.id}">
        <b>${t.level}</b> ${t.name} <span class="tt-prog">${n}/${total}</span>
      </button>`;
    }).join("");
  $$(".track-tab", el).forEach((b) =>
    b.addEventListener("click", () => {
      activeTrack = b.dataset.track;
      renderTabs();
      renderTrackPanel();
      renderLessons();
    })
  );
}

function renderTrackPanel() {
  const el = $("#trackPanel");
  if (activeTrack === "all") {
    el.innerHTML = `<h3>Begin at the level you actually are</h3>
      <p class="tp-tag">Level 1 makes your answers reliable. Level 2 removes the mechanical work. Level 3 points it at your coursework and business work. Level 4 makes things that exist. Level 5 turns you into the person who designs the system.</p>
      <div class="tp-out"><span>how the levels fit together</span>Each level assumes the one before it. Skipping Foundations is the most common reason people bounce off advanced material — the gap is always verification and context, never clever prompts.</div>`;
    return;
  }
  const t = TRACKS.find((x) => x.id === activeTrack);
  const total = CURRICULUM.filter((l) => l.track === t.id).length;
  const n = CURRICULUM.filter((l) => l.track === t.id && done.has(l.n)).length;
  el.innerHTML = `<h3>Level ${t.level} — ${esc(t.name)}: <em style="font-family:var(--serif);font-style:italic;color:var(--lime)">${esc(t.tagline)}</em></h3>
    <p class="tp-tag">${esc(t.desc)}</p>
    <div class="tp-out"><span>what you walk away with</span>${esc(t.outcome)} <span style="color:var(--dim);margin-top:8px">${n} of ${total} lessons passed${modPassed[t.id] ? ` · checkpoint ${modPassed[t.id]}/${MODULE_TESTS[t.id].qs.length}` : ` · checkpoint not passed yet`}</span></div>`;
}

/* ---------------- deeper reading ---------------- */
function depthWordCount(d) {
  const wc = (s) => String(s || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  let n = wc(d.lead);
  for (const s of (d.sections || [])) { n += wc(s.h); for (const p of (s.p || [])) n += wc(p); }
  if (d.worked) { n += wc(d.worked.h); for (const st of (d.worked.steps || [])) n += wc(st); }
  for (const t of (d.terms || [])) n += wc(t[0]) + wc(t[1]);
  for (const m of (d.mistakes || [])) n += wc(m[0]) + wc(m[1]);
  for (const r of (d.recap || [])) n += wc(r);
  return n;
}
function depthMins(d) {
  // ~120 words/min for study material with worked examples and terms (careful reading pace).
  return Math.max(4, Math.round(depthWordCount(d) / 120));
}
function depthHTML(d) {
  const mins = depthMins(d);
  return `<div class="deep">
    <p class="deep-head"><span class="l-label">Deeper reading</span><span class="deep-mins">about ${mins} min</span></p>
    <p class="deep-lead">${esc(d.lead)}</p>
    ${d.sections.map((s, i) => `<section class="deep-sec">
      <h4><span aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>${esc(s.h)}</h4>
      ${s.p.map((p) => `<p>${esc(p)}</p>`).join("")}
    </section>`).join("")}
    <div class="worked">
      <p class="l-label">Worked example</p>
      <h5>${esc(d.worked.h)}</h5>
      <ol>${d.worked.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
    </div>
    <div class="deep-grid">
      <div class="dbox">
        <p class="l-label">Words worth knowing</p>
        <dl class="terms">${d.terms.map(([t, v]) => `<dt>${esc(t)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
      </div>
      <div class="dbox">
        <p class="l-label">Where people go wrong</p>
        <ul class="mistakes">${d.mistakes.map(([a, b]) => `<li><s>${esc(a)}</s><b>${esc(b)}</b></li>`).join("")}</ul>
      </div>
    </div>
    <div class="recap">
      <p class="l-label">Three things to remember</p>
      <ul>${d.recap.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
    </div>
  </div>`;
}

/* ---------------- lesson tests ---------------- */
function lessonScore(n) {
  const test = TESTS[n];
  const st = testState.get(n);
  if (!test || !st) return 0;
  let s = 0;
  st.answers.forEach((oi, qi) => { if (prepare(test.qs[qi]).correct === oi) s++; });
  return s;
}

function lessonTestFoot(n, score, passing) {
  const test = TESTS[n];
  const st = testState.get(n);
  if (passing) return `<span class="lt-ok">Passed ${score} of ${test.qs.length}. Mark the lesson complete, then retry it cold tomorrow — spaced retrieval is what makes it stick.</span><button class="link-btn" type="button" data-lretry="${n}">Reset and retry</button>`;
  if (st.done) return `<span class="lt-miss">${score} of ${test.qs.length}. Read the explanations above, then try again. The correction is the point, not the score.</span><button class="btn btn-ghost btn-sm" type="button" data-lretry="${n}">Try again</button>`;
  return `<span class="lt-hint">Answer all ${test.qs.length}. Pass mark is ${test.pass}.</span>`;
}

function lessonTestHTML(n) {
  const test = TESTS[n];
  if (!test) return "";
  if (!testState.has(n)) testState.set(n, { answers: new Map(), done: false });
  const st = testState.get(n);
  const score = lessonScore(n);
  const passing = passed.has(n);
  return `<div class="ltest ${passing ? "passed" : ""}" data-ltest="${n}">
    <div class="ltest-head">
      <p class="l-label">Lesson test <span class="lt-hint">${test.qs.length} questions · ${test.pass} to pass</span></p>
      <span class="ltest-score">${passing ? "passed" : st.done ? `${score}/${test.qs.length}` : "not started"}</span>
    </div>
    ${test.qs.map((q, qi) => {
      const p = prepare(q);
      const chosen = st.answers.get(qi);
      const answered = chosen !== undefined;
      return `<div class="ltest-q ${answered ? (chosen === p.correct ? "right" : "wrong") : ""}">
        <p><span class="qn">Q${qi + 1}</span>${esc(p.text)}</p>
        <div class="ltest-opts">${p.opts.map((o, oi) => {
          const cls = !answered ? "" : p.correct === oi ? "right" : chosen === oi ? "wrong" : "muted";
          return `<button class="ltest-opt ${cls}" type="button" data-lq="${qi}" data-lo="${oi}"${answered ? " disabled" : ""}>${esc(o)}</button>`;
        }).join("")}</div>
        ${answered ? `<p class="ltest-why"><b>${chosen === p.correct ? "Correct." : "Not quite."}</b> ${esc(p.why)}</p>` : ""}
      </div>`;
    }).join("")}
    <div class="ltest-foot">${lessonTestFoot(n, score, passing)}</div>
  </div>`;
}

function refreshLessonTest(n) {
  const box = $(`.ltest[data-ltest="${n}"]`);
  if (!box) return;
  box.outerHTML = lessonTestHTML(n);
  bindLessonTest(n);
}

function bindLessonTest(n) {
  const box = $(`.ltest[data-ltest="${n}"]`);
  if (!box || !TESTS[n]) return;
  if (!testState.has(n)) testState.set(n, { answers: new Map(), done: false });
  const st = testState.get(n);
  $$(".ltest-opt", box).forEach((btn) =>
    btn.addEventListener("click", () => {
      const qi = Number(btn.dataset.lq);
      const oi = Number(btn.dataset.lo);
      if (st.answers.has(qi)) return;
      st.answers.set(qi, oi);
      const test = TESTS[n];
      if (st.answers.size === test.qs.length) {
        st.done = true;
        const score = lessonScore(n);
        if (score >= test.pass) {
          passed.add(n);
          store.set(KEYS.quiz, [...passed]);
          toast(`Passed ${score}/${test.qs.length}. Now mark the lesson complete.`);
        } else {
          toast(`${score}/${test.qs.length} — read the explanations, then retry.`);
        }
      }
      refreshLessonTest(n);
      renderTabs();
      renderTrackPanel();
      syncProgress();
    })
  );
  const retry = $("[data-lretry]", box);
  if (retry) retry.addEventListener("click", () => {
    testState.set(n, { answers: new Map(), done: false });
    passed.delete(n);
    store.set(KEYS.quiz, [...passed]);
    done.delete(n);
    store.set(KEYS.done, [...done]);
    refreshLessonTest(n);
    syncDone();
    renderTabs();
    renderTrackPanel();
    syncProgress();
    toast("Test reset. Try it without looking back.");
  });
}

/* ---------------- module checkpoints ---------------- */
function moduleScore(track) {
  const test = MODULE_TESTS[track];
  const st = modState.get(track);
  if (!test || !st) return 0;
  let s = 0;
  st.answers.forEach((oi, qi) => { if (prepare(test.qs[qi]).correct === oi) s++; });
  return s;
}

function moduleTestHTML(track) {
  const test = MODULE_TESTS[track];
  if (!test) return "";
  const t = TRACKS.find((x) => x.id === track);
  const lessons = CURRICULUM.filter((l) => l.track === track);
  const doneCount = lessons.filter((l) => passed.has(l.n)).length;
  const unlocked = doneCount === lessons.length;
  if (!modState.has(track)) modState.set(track, { answers: new Map(), submitted: false });
  const st = modState.get(track);
  const recorded = modPassed[track];
  const score = moduleScore(track);

  if (!unlocked) {
    return `<article class="mtest locked" data-mtest="${track}">
      <div class="mtest-head"><p class="l-label">Module checkpoint · level ${t.level}</p><span class="mtest-score">locked</span></div>
      <h3>${esc(test.title)}</h3>
      <p class="mtest-intro">Ten questions across the whole of ${esc(t.name)}, including two situations the lessons do not cover word for word. It opens once you have passed every lesson test in this level — ${doneCount} of ${lessons.length} so far.</p>
      <div class="mtest-bar" aria-hidden="true"><i style="width:${Math.round((doneCount / lessons.length) * 100)}%"></i></div>
    </article>`;
  }

  const allAnswered = st.answers.size === test.qs.length;
  return `<article class="mtest" data-mtest="${track}">
    <div class="mtest-head"><p class="l-label">Module checkpoint · level ${t.level}</p><span class="mtest-score">${st.submitted ? `${score}/${test.qs.length}` : recorded ? `best ${recorded}/${test.qs.length}` : `${test.qs.length} questions · ${test.pass} to pass`}</span></div>
    <h3>${esc(test.title)}</h3>
    <p class="mtest-intro">Answer all ten, then submit. No promises about the two situations at the end — they test whether the ideas transfer.</p>
    ${test.qs.map((q, qi) => {
      const p = prepare(q);
      const chosen = st.answers.get(qi);
      return `<div class="mtest-q ${st.submitted ? (chosen === p.correct ? "right" : "wrong") : ""}">
        <p><span class="qn">Q${qi + 1}</span>${esc(p.text)}</p>
        <div class="ltest-opts">${p.opts.map((o, oi) => {
          const cls = !st.submitted ? (chosen === oi ? "sel" : "") : p.correct === oi ? "right" : chosen === oi ? "wrong" : "muted";
          return `<button class="ltest-opt ${cls}" type="button" data-mq="${qi}" data-mo="${oi}"${st.submitted ? " disabled" : ""}>${esc(o)}</button>`;
        }).join("")}</div>
        ${st.submitted ? `<p class="ltest-why"><b>${chosen === p.correct ? "Correct." : chosen === undefined ? "Not answered." : "Not quite."}</b> ${esc(p.why)}</p>` : ""}
      </div>`;
    }).join("")}
    <div class="mtest-foot">
      ${st.submitted
        ? (score >= test.pass
          ? `<span class="lt-ok">Passed ${score} of ${test.qs.length}. Level complete — take the next one, and come back to this checkpoint in a week.</span><button class="link-btn" type="button" data-mretry="${track}">Reset and retry</button>`
          : `<span class="lt-miss">${score} of ${test.qs.length}, and the pass mark is ${test.pass}. Read the explanations, revisit the two lessons you were least sure of, then retry.</span><button class="btn btn-ghost btn-sm" type="button" data-mretry="${track}">Try again</button>`)
        : `<button class="btn btn-primary btn-sm" type="button" data-msubmit="${track}"${allAnswered ? "" : " disabled"}>Submit checkpoint${allAnswered ? "" : ` (${st.answers.size}/${test.qs.length} answered)`}</button>`}
    </div>
  </article>`;
}

function refreshModuleTest(track) {
  const box = $(`.mtest[data-mtest="${track}"]`);
  if (!box) return;
  box.outerHTML = moduleTestHTML(track);
  bindModuleTest(track);
}

function bindModuleTest(track) {
  const box = $(`.mtest[data-mtest="${track}"]`);
  if (!box || !MODULE_TESTS[track]) return;
  if (!modState.has(track)) modState.set(track, { answers: new Map(), submitted: false });
  const st = modState.get(track);
  const test = MODULE_TESTS[track];
  $$("[data-mq]", box).forEach((btn) =>
    btn.addEventListener("click", () => {
      if (st.submitted) return;
      st.answers.set(Number(btn.dataset.mq), Number(btn.dataset.mo));
      refreshModuleTest(track);
    })
  );
  const submit = $("[data-msubmit]", box);
  if (submit) submit.addEventListener("click", () => {
    if (st.answers.size < test.qs.length) return;
    st.submitted = true;
    const score = moduleScore(track);
    if (score >= test.pass && (!modPassed[track] || score > modPassed[track])) {
      modPassed[track] = score;
      store.set(KEYS.mod, modPassed);
    } else if (score >= test.pass) {
      modPassed[track] = score;
      store.set(KEYS.mod, modPassed);
    }
    toast(score >= test.pass ? `Checkpoint passed ${score}/${test.qs.length}.` : `${score}/${test.qs.length} — revisit the lessons you were least sure of.`);
    refreshModuleTest(track);
    renderTrackPanel();
  });
  const retry = $("[data-mretry]", box);
  if (retry) retry.addEventListener("click", () => {
    modState.set(track, { answers: new Map(), submitted: false });
    refreshModuleTest(track);
  });
}

/* ---------------- evidence + free courses ---------------- */
function renderResearch() {
  const design = $("#designList");
  if (design) design.innerHTML = DESIGN.map((d) => `<li><h3>${esc(d.h)}</h3><p>${esc(d.p)}</p><span class="src">${esc(d.src)}</span></li>`).join("");
  const courses = $("#courseList");
  if (courses) courses.innerHTML = FREE_COURSES.map((c) => `<article class="fc">
    <div class="fc-top"><span class="fc-cost">${esc(c.cost)}</span><span class="fc-by">${esc(c.by)}</span></div>
    <h3>${esc(c.name)}</h3>
    <p>${esc(c.why)}</p>
    <p class="fc-note">${esc(c.note)}</p>
    <a class="link-btn" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">Open ${esc(c.name)} ↗</a>
  </article>`).join("");
  const tech = $("#techSources");
  if (tech) tech.innerHTML = TECHNICAL_SOURCES.map(([title, desc, url]) => `<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)}</a><p>${esc(desc)}</p></li>`).join("");
  const learn = $("#learnSources");
  if (learn) learn.innerHTML = LEARNING_SOURCES.map(([title, desc, url]) => `<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)}</a><p>${esc(desc)}</p></li>`).join("");
  const limits = $("#limitsList");
  if (limits) limits.innerHTML = LIMITS.map((l) => `<li>${esc(l)}</li>`).join("");
}

function renderLessons() {
  const list = activeTrack === "all" ? CURRICULUM : CURRICULUM.filter((l) => l.track === activeTrack);
  const comfort = document.documentElement.classList.contains("comfort");
  $("#lessonList").innerHTML = list
    .map((l, li) => {
      const isDone = done.has(l.n);
      const track = TRACKS.find((t) => t.id === l.track);
      const plain = PLAIN[l.n];
      const dm = DEPTH[l.n] ? depthMins(DEPTH[l.n]) : 0;
      const lTotal = (l.mins || 0) + dm + 4; // core + deeper reading + lesson test
      return `<article class="lesson ${isDone ? "done" : ""}" data-n="${l.n}">
        <button class="lesson-head" type="button" aria-expanded="false" aria-controls="lb-${l.n}">
          <span class="l-num">${String(l.idx).padStart(2, "0")}</span>
          <span>
            <span class="l-title">${esc(l.title)}</span>
            <span class="l-promise">${esc(l.promise)}</span>
          </span>
          <span class="l-right">
            <span class="l-mins">L${track.level} · ~${lTotal} min</span>
            <span class="l-chev" aria-hidden="true">›</span>
          </span>
        </button>
        <div class="lesson-body" id="lb-${l.n}">
          <div class="lesson-body-inner">
            <div class="lesson-content">
              <p class="l-why">${esc(l.why)}</p>
              ${plain ? `<div class="plain"><p class="l-label">In plain words</p><p>${esc(plain.plain)}</p></div>` : ""}
              ${plain ? `<details class="slow"${comfort ? " open" : ""}><summary>If that felt fast — read it slower</summary><p>${esc(plain.slow)}</p></details>` : ""}
              ${DEPTH[l.n] ? depthHTML(DEPTH[l.n]) : ""}
              <div class="l-block">
                <p class="l-label">Do this</p>
                <ul class="drill">${l.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
              </div>
              <div class="snip">
                <div class="snip-head"><span>copy-paste prompt</span><button class="copy-btn" type="button" data-copy="${l.n}" data-label="copy">copy</button></div>
                <div class="snip-body">${esc(l.prompt)}</div>
              </div>
              <div class="note"><b>${esc(l.noteLabel)}</b>${esc(l.note)}</div>
              <div class="check-question"><span>check yourself</span>${esc(l.check)}</div>
              ${lessonTestHTML(l.n)}
              <div class="lesson-foot">
                <button class="check ${isDone ? "on" : ""}" type="button" data-check="${l.n}" aria-pressed="${isDone}">
                  <span class="check-box" aria-hidden="true">✓</span><span>${isDone ? "Completed" : "Mark complete"}</span>
                </button>
                <span class="l-mins">~${lTotal} min total · ${l.mins} core · ${dm} deep · 4 test</span>
              </div>
            </div>
          </div>
        </div>
      </article>${li === list.length - 1 || list[li + 1].track !== l.track ? moduleTestHTML(l.track) : ""}`;
    })
    .join("");

  $$(".lesson-head").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".lesson");
      const open = card.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  $$(".copy-btn[data-copy]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const l = CURRICULUM.find((x) => x.n === Number(btn.dataset.copy));
      if (l) copyText(l.prompt, btn);
    });
  });
  $$(".lesson").forEach((card) => bindLessonTest(Number(card.dataset.n)));
  Object.keys(MODULE_TESTS).forEach(bindModuleTest);

  $$(".check[data-check]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const n = Number(btn.dataset.check);
      if (!done.has(n) && !passed.has(n) && TESTS[n]) {
        const box = $(`.ltest[data-ltest="${n}"]`);
        if (box) box.scrollIntoView({ behavior: "smooth", block: "center" });
        toast(`Pass the lesson test first — ${TESTS[n].pass} of ${TESTS[n].qs.length} correct. Retry as often as you like.`);
        return;
      }
      if (done.has(n)) done.delete(n); else done.add(n);
      store.set(KEYS.done, [...done]);
      syncDone();
      renderTabs();
      renderTrackPanel();
      syncProgress();
    });
  });
}

/* update ticks without re-rendering the list */
function syncDone() {
  $$(".lesson").forEach((card) => {
    const n = Number(card.dataset.n);
    const isDone = done.has(n);
    card.classList.toggle("done", isDone);
    const btn = $(".check", card);
    if (!btn) return;
    btn.classList.toggle("on", isDone);
    btn.setAttribute("aria-pressed", String(isDone));
    $("span:last-child", btn).textContent = isDone ? "Completed" : "Mark complete";
  });
}

/* ---------------- progress + badge ---------------- */
function syncProgress() {
  const total = totalLessons;
  const pct = Math.round((done.size / total) * 100);
  $("#railFill").style.width = pct + "%";
  $("#doneCount").textContent = done.size;
  $("#statProgress").textContent = done.size;
  $("#ringLabel").textContent = pct + "%";
  const ring = $("#ringFg");
  if (ring) ring.style.strokeDashoffset = String(100.5 - (100.5 * pct) / 100);
  const rail = $(".progress-rail");
  if (rail) rail.setAttribute("aria-valuenow", String(pct));

  const badge = $("#badgeFg");
  if (badge) badge.style.strokeDashoffset = String(439.8 - (439.8 * pct) / 100);
  $("#badgePct").textContent = pct + "%";
  $("#badgeLvl").textContent = done.size === total ? "Playbook complete" : rankOf(done.size);
  $("#cardMeta").textContent = `${done.size} of ${total} lessons · started ${fmtDate(startedAt)}`;

  if (pct === 100 && !sessionStorage.getItem("aifp.celebrated.v2")) {
    sessionStorage.setItem("aifp.celebrated.v2", "1");
    confetti();
    toast("Complete. Now go do it on real work.");
  }
}
function fmtDate(iso) {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  } catch (e) { return iso; }
}

/* ---------------- assessment ---------------- */
const answers = new Map();
function renderQuiz() {
  $("#quizBars").innerHTML = QUIZ.map(() => "<i></i>").join("");
  $("#quizBody").innerHTML = QUIZ.map(
    (item, qi) => `<div class="quiz-q">
      <p><span class="qn">Q${qi + 1}</span>${esc(item.q)}</p>
      <div class="quiz-options">
        ${item.a.map((o, oi) => `<button class="quiz-opt" type="button" data-q="${qi}" data-o="${oi}">${esc(o.t)}</button>`).join("")}
      </div>
    </div>`
  ).join("");
  $$(".quiz-opt").forEach((b) =>
    b.addEventListener("click", () => {
      const qi = Number(b.dataset.q);
      answers.set(qi, Number(b.dataset.o));
      $$(`.quiz-opt[data-q="${qi}"]`).forEach((x) => x.classList.remove("sel"));
      b.classList.add("sel");
      const bars = $$("#quizBars i");
      bars.forEach((bar, i) => bar.classList.toggle("on", answers.has(i)));
      $("#quizCount").textContent = `${answers.size} / ${QUIZ.length}`;
      if (answers.size === QUIZ.length) showResult();
    })
  );
}

function showResult() {
  let score = 0;
  answers.forEach((oi, qi) => { score += QUIZ[qi].a[oi].s; });
  const max = QUIZ.length * 3;
  const pct = Math.round((score / max) * 100);
  let level, why;
  if (pct <= 28) {
    level = 1;
    why = "Start at Foundations. Not because you're behind — because reliable answers come from briefs and verification, and those are the two things almost nobody was taught. You'll move fast.";
  } else if (pct <= 52) {
    level = 2;
    why = "Start at Operator. You can get decent output; the next jump is choosing the right surface, writing acceptance criteria, and pointing the agent at real files instead of pasting text.";
  } else if (pct <= 76) {
    level = 3;
    why = "Start at Builder. You already verify. What's missing is doing multi-step work under control: bounding the loop, reviewing a diff, and building something interactive rather than textual.";
  } else {
    level = 4;
    why = "Start at Mastermind — but skim one lesson of Foundations first, specifically the verification ritual. Most people at your score have one blind spot there, and it's the expensive one.";
  }
  const trackId = pct <= 28 ? "foundations" : pct <= 52 ? "operator" : pct <= 76 ? "builder" : "mastermind";
  const t = TRACKS.find((x) => x.id === trackId);
  level = t.level;
  store.set(KEYS.level, level);
  const out = $("#quizOut");
  out.hidden = false;
  out.innerHTML = `<span class="lvl">Result · score ${score}/${max}</span>
    <h4>Start at Level ${level}: ${esc(t.name)}</h4>
    <p>${esc(why)}</p>
    <button class="btn btn-primary" type="button" id="goLevel">Jump to Level ${level} lessons</button>`;
  $("#goLevel").addEventListener("click", () => {
    activeTrack = t.id;
    renderTabs();
    renderTrackPanel();
    renderLessons();
    $("#path").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/* ---------------- prompts ---------------- */
let activeCat = "All";
function renderChips() {
  const cats = ["All", ...new Set(ALL_PROMPTS.map((p) => p.cat))];
  $("#promptChips").innerHTML = cats
    .map((c) => `<button class="chip ${c === activeCat ? "active" : ""}" type="button" data-cat="${c}">${c}</button>`)
    .join("");
  $$("#promptChips .chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      activeCat = chip.dataset.cat;
      renderChips();
      renderPrompts();
    })
  );
}

function renderPrompts() {
  const q = ($("#promptSearch").value || "").trim().toLowerCase();
  const list = ALL_PROMPTS.filter(
    (p) => (activeCat === "All" || p.cat === activeCat) && (!q || (p.title + " " + p.body + " " + p.cat).toLowerCase().includes(q))
  );
  $("#promptEmpty").hidden = list.length > 0;
  $("#promptGrid").innerHTML = list
    .map((p, i) => {
      const idx = ALL_PROMPTS.indexOf(p);
      return `<article class="p-card" style="animation-delay:${Math.min(i * 18, 240)}ms">
        <div class="p-top"><span class="p-cat">${p.cat}</span><span class="p-title">${esc(p.title)}</span></div>
        <div class="p-body">${esc(p.body)}</div>
        <div class="p-foot"><button class="copy-btn" type="button" data-pcopy="${idx}" data-label="copy prompt">copy prompt</button></div>
      </article>`;
    })
    .join("");
  $$("[data-pcopy]").forEach((btn) =>
    btn.addEventListener("click", () => copyText(ALL_PROMPTS[Number(btn.dataset.pcopy)].body, btn))
  );
}

/* ---------------- reference lists ---------------- */
$("#rulesList").innerHTML = RULES.map(([t, d]) => `<li><b>${esc(t)}</b> ${esc(d)}</li>`).join("");
$("#glossaryList").innerHTML = GLOSSARY.map(
  ([term, def]) => `<details><summary>${esc(term)}</summary><p>${esc(def)}</p></details>`
).join("");
$("#sourcesList").innerHTML = SOURCES.map(
  ([title, desc, url]) => `<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)}</a><p>${esc(desc)}</p></li>`
).join("");

/* ---------------- MCP board ---------------- */
function initMcp() {
  const plugs = $$("#mcpPlugs button");
  const out = $("#mcpReadout");
  plugs.forEach((b) =>
    b.addEventListener("click", () => {
      b.classList.toggle("on");
      const on = plugs.filter((x) => x.classList.contains("on"));
      if (!on.length) {
        out.innerHTML = "Nothing connected. The agent can only reason about what you paste in.";
        return;
      }
      out.innerHTML = `Connected to <b>${on.map((x) => x.textContent).join(", ")}</b> — with your permission it can ${on
        .map((x) => `<b>${esc(x.dataset.cap)}</b>`)
        .join(", ")}. That's the whole design: read what you allow, write only behind an approval you control.`;
    })
  );
}

/* ---------------- reveal ---------------- */
function initReveal() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((e, i) => { e.style.transitionDelay = `${Math.min(i % 5, 4) * 40}ms`; io.observe(e); });
}

/* ---------------- chrome ---------------- */
function initChrome() {
  const nav = $(".nav");
  const onScroll = () => { nav.classList.toggle("scrolled", window.scrollY > 18); scrollY3D = window.scrollY; };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const glow = $(".cursor-glow");
  if (window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("mousemove", (e) => {
      glow.style.opacity = "1";
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
      e.preventDefault();
      $("#promptSearch").focus();
      $("#prompts").scrollIntoView({ block: "center" });
    }
    if (e.key === "Escape" && document.activeElement.tagName === "INPUT") document.activeElement.blur();
  });

  $("#promptSearch").addEventListener("input", renderPrompts);

  $("#resetProgress").addEventListener("click", () => {
    done.clear();
    store.set(KEYS.done, []);
    sessionStorage.removeItem("aifp.celebrated.v2");
    syncDone(); renderTabs(); renderTrackPanel(); syncProgress();
    toast("Progress reset.");
  });

  const nameInput = $("#learnerName");
  nameInput.value = store.get(KEYS.name, "");
  nameInput.addEventListener("input", () => store.set(KEYS.name, nameInput.value.trim().slice(0, 60)));

  $("#printCard").addEventListener("click", () => {
    if (!store.get(KEYS.name, "")) store.set(KEYS.name, nameInput.value.trim().slice(0, 60) || "Learner");
    toast("Opening print — choose 'Save as PDF' to keep it.");
    setTimeout(() => window.print(), 400);
  });
}

/* ---------------- confetti ---------------- */
function confetti() {
  const c = $("#confetti");
  const ctx = c.getContext("2d");
  c.width = window.innerWidth; c.height = window.innerHeight;
  const colors = ["#c8ff4d", "#5ce1ff", "#a78bfa", "#ffb64d"];
  const parts = Array.from({ length: 110 }, () => ({
    x: c.width * (0.3 + Math.random() * 0.4), y: c.height * 0.34,
    vx: (Math.random() - 0.5) * 11, vy: -Math.random() * 12 - 3,
    s: 3 + Math.random() * 5, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.35,
    col: colors[(Math.random() * colors.length) | 0]
  }));
  const t0 = performance.now();
  (function frame(now) {
    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, c.width, c.height);
    parts.forEach((p) => {
      p.vy += 0.42; p.x += p.vx; p.y += p.vy; p.vx *= 0.995; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1 - t / 2.6);
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      ctx.restore();
    });
    if (t < 2.6) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, c.width, c.height);
  })(t0);
}

/* ---------------- three.js loader ---------------- */
const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
const threeReady = import(THREE_URL).catch(() => null);
const ACCENTS = { lime: 0xc8ff4d, cyan: 0x5ce1ff, violet: 0xa78bfa };
let mouseX = 0, mouseY = 0, scrollY3D = 0;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* One soft round sprite, drawn once and reused. Square points are the
   giveaway of a scene nobody looked at closely. */
let dotTexture = null;
function softDot(THREE) {
  if (dotTexture) return dotTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.4, "rgba(255,255,255,.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  dotTexture = new THREE.CanvasTexture(c);
  dotTexture.colorSpace = THREE.SRGBColorSpace;
  return dotTexture;
}

function starfield(THREE, count, rMin, rMax, color, opacity, size) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = rMin + Math.random() * (rMax - rMin);
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.cos(ph) * 0.74;
    pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color, size, map: softDot(THREE), transparent: true, opacity,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  });
  return new THREE.Points(geo, mat);
}

/* ---------------- hero scene ---------------- */
async function initHero() {
  const canvas = $("#scene3d");
  if (!canvas) return;
  const THREE = await threeReady;
  if (!THREE) { document.body.classList.add("no3d"); return; }
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) { document.body.classList.add("no3d"); return; }

  const small = window.matchMedia("(max-width: 760px)").matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.6 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
  camera.position.set(0, 0, 5.4);
  const group = new THREE.Group();
  scene.add(group);

  /* the outer wireframe shell — the same shape the 3D lesson builds */
  group.add(new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.62, 1)),
    new THREE.LineBasicMaterial({ color: 0xc8ff4d, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false })
  ));

  /* faceted core, lit at the edges instead of filled flat */
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 3), new THREE.ShaderMaterial({
    uniforms: { uCore: { value: new THREE.Color(0x04090d) }, uRim: { value: new THREE.Color(0x5ce1ff) } },
    vertexShader: "varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",
    fragmentShader: "uniform vec3 uCore; uniform vec3 uRim; varying vec3 vN; varying vec3 vV; void main(){ float rim = pow(1.0 - clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0), 2.6); gl_FragColor = vec4(mix(uCore, uRim, rim), 0.04 + rim * 0.5); }",
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
  }));
  group.add(core);

  /* the cyan inner wireframe */
  const inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.8, 0),
    new THREE.MeshBasicMaterial({ color: 0x5ce1ff, wireframe: true, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  group.add(inner);

  /* three thin orbits on different axes, so the silhouette reads as depth */
  const rings = [];
  [[2.12, 0x5ce1ff, 0.26, Math.PI / 2.35, 0.4], [2.58, 0xc8ff4d, 0.17, Math.PI / 1.72, -0.7], [1.86, 0xa78bfa, 0.14, Math.PI / 3.1, 1.1]]
    .forEach(([r, color, opacity, tilt, turn]) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.005, 6, 200),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      ring.rotation.x = tilt;
      ring.rotation.z = turn;
      group.add(ring);
      rings.push(ring);
    });

  /* two satellites travelling those orbits */
  const satMat = new THREE.MeshBasicMaterial({ color: 0x9ff0ff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
  const sats = [0.34, -0.24].map((speed, i) => {
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(i ? 0.028 : 0.04, 0), satMat);
    group.add(mesh);
    return { mesh, speed, phase: i ? 2.1 : 0.2, radius: i ? 2.58 : 2.12 };
  });

  /* a soft halo, so the sculpture sits in light instead of on top of nothing */
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: softDot(THREE), color: 0x3fdcff, transparent: true, opacity: 0.16,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  halo.scale.setScalar(4.0);
  halo.position.z = -2.2;
  group.add(halo);

  const near = starfield(THREE, small ? 480 : 1100, 3.0, 8.5, 0xdfe9ff, 0.5, 0.048);
  const far = starfield(THREE, small ? 200 : 460, 8, 15, 0xc8ff4d, 0.32, 0.032);
  scene.add(near, far);

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const wide = w > 900;
    group.position.set(wide ? 1.62 : 0, wide ? 0.15 : 0.62, 0);
    group.scale.setScalar(wide ? 0.88 : 0.7);
  }
  window.addEventListener("resize", resize);
  resize();

  if (reducedMotion()) {
    group.rotation.set(0.18, 0.5, 0);
    inner.rotation.set(0.1, 0.3, 0);
    renderer.render(scene, camera);
    window.addEventListener("resize", () => renderer.render(scene, camera));
    return;
  }

  let onScreen = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }, { threshold: 0 }).observe(canvas);
  }

  const clock = new THREE.Clock();
  let t = 0;
  (function frame() {
    requestAnimationFrame(frame);
    /* the rule the performance lesson teaches: stop rendering when nobody is looking */
    if (!onScreen || document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    t += dt;
    const drift = scrollY3D * 0.0016;
    group.rotation.y += (mouseX * 0.48 + drift * 0.8 + Math.sin(t * 0.21) * 0.14 - group.rotation.y) * 0.045;
    group.rotation.x += (mouseY * 0.32 + drift * 0.4 + Math.cos(t * 0.17) * 0.05 - group.rotation.x) * 0.045;
    inner.rotation.y -= dt * 0.16;
    inner.rotation.x += dt * 0.06;
    rings.forEach((ring, i) => { ring.rotation.z += dt * (i === 1 ? -0.05 : 0.065); });
    sats.forEach((s) => {
      const a = t * s.speed + s.phase;
      s.mesh.position.set(Math.cos(a) * s.radius, Math.sin(a * 0.9) * 0.42, Math.sin(a) * s.radius);
      s.mesh.rotation.y += dt * 0.7;
    });
    near.rotation.y -= dt * 0.011;
    far.rotation.y += dt * 0.005;
    camera.position.x += (mouseX * 0.28 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 0.2 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  })();
}

/* ---------------- 3D lab ---------------- */
const lab = {
  geo: "ico", color: "lime", spin: 0.6, parts: 1200, wire: true, ease: true, mouse: true
};
async function initLab() {
  const canvas = $("#labCanvas");
  const stage = canvas?.closest(".lab-stage");
  if (!canvas || !stage) return;
  const THREE = await threeReady;
  if (!THREE) {
    stage.innerHTML = `<div style="display:grid;place-items:center;height:100%;padding:20px;text-align:center;color:#97a1b4;font-size:14px">This browser couldn't start WebGL — which is exactly the failure case lesson 18 asks you to design a fallback for.</div>`;
    updateLabCode();
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
  camera.position.set(0, 0, 5.4);

  /* three lights: key, rim and fill. The cheapest way to make a shape look solid. */
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 2.6);
  key.position.set(3.5, 4.5, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x5ce1ff, 2.2);
  rim.position.set(-5, -1.5, -4);
  scene.add(rim);
  const fill = new THREE.PointLight(0xa78bfa, 26, 26);
  fill.position.set(-3.5, 2.5, 3.5);
  scene.add(fill);

  const group = new THREE.Group();
  scene.add(group);

  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: softDot(THREE), color: ACCENTS[lab.color], transparent: true, opacity: 0.07,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  halo.scale.setScalar(4.0);
  halo.position.z = -2.4;
  scene.add(halo);

  let mesh = null;
  let particles = null;
  let particleCount = -1;

  function geometryFor() {
    if (lab.geo === "knot") return new THREE.TorusKnotGeometry(1.02, 0.31, 96, 12);
    if (lab.geo === "box") return new THREE.BoxGeometry(1.85, 1.85, 1.85, 2, 2, 2);
    return new THREE.IcosahedronGeometry(1.5, 1);
  }

  function buildMesh() {
    if (mesh) {
      group.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
    const base = geometryFor();
    const accent = ACCENTS[lab.color];
    if (lab.wire) {
      const wireGeo = new THREE.WireframeGeometry(base);
      base.dispose();
      mesh = new THREE.LineSegments(wireGeo, new THREE.LineBasicMaterial({
        color: accent, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
      }));
    } else {
      mesh = new THREE.Mesh(base, new THREE.MeshStandardMaterial({
        color: accent, metalness: 0.55, roughness: 0.28, emissive: accent, emissiveIntensity: 0.08, flatShading: true
      }));
    }
    group.add(mesh);
    halo.material.color.setHex(accent);
  }

  function buildParticles() {
    if (lab.parts === particleCount) return;
    particleCount = lab.parts;
    if (particles) {
      scene.remove(particles);
      particles.geometry.dispose();
      particles.material.dispose();
      particles = null;
    }
    if (!lab.parts) return;
    const pos = new Float32Array(lab.parts * 3);
    const col = new Float32Array(lab.parts * 3);
    const palette = [new THREE.Color(0xcdd8ea), new THREE.Color(0xc8ff4d), new THREE.Color(0x5ce1ff)];
    for (let i = 0; i < lab.parts; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
      const c = palette[i % 11 === 0 ? 1 : i % 17 === 0 ? 2 : 0];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    particles = new THREE.Points(g, new THREE.PointsMaterial({
      size: 0.045, map: softDot(THREE), vertexColors: true, transparent: true, opacity: 0.62,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    }));
    scene.add(particles);
  }

  function resize() {
    const w = stage.clientWidth || 640;
    const h = stage.clientHeight || 360;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w < 520 ? 6.6 : 5.4;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  buildMesh();
  buildParticles();

  let px = 0, py = 0;
  stage.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect();
    px = ((e.clientX - r.left) / r.width) * 2 - 1;
    py = ((e.clientY - r.top) / r.height) * 2 - 1;
  });
  stage.addEventListener("pointerleave", () => { px = 0; py = 0; });

  let visible = true;
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(stage);

  let fpsFrames = 0, fpsLast = performance.now(), last = performance.now();
  let spinAcc = 0;

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    spinAcc += lab.spin * dt;

    const tx = lab.mouse ? py * 0.4 : 0;
    const ty = lab.mouse ? px * 0.55 : 0;

    if (lab.ease) {
      group.rotation.x += (tx - group.rotation.x) * 0.06;
      group.rotation.y += (spinAcc + ty - group.rotation.y) * 0.1;
    } else {
      group.rotation.x = tx;
      group.rotation.y = spinAcc + ty;
    }
    group.position.y = Math.sin(now * 0.0006) * 0.045;
    if (particles) particles.rotation.y += 0.0006;

    renderer.render(scene, camera);

    fpsFrames++;
    if (now - fpsLast >= 500) {
      const fps = Math.round((fpsFrames * 1000) / (now - fpsLast));
      const fpsEl = $("#fps");
      if (fpsEl) fpsEl.textContent = fps || "–";
      fpsFrames = 0;
      fpsLast = now;
    }
    const info = renderer.info.render;
    const callsEl = $("#calls");
    const trisEl = $("#tris");
    const trisLabel = $("#trisLabel");
    if (callsEl) callsEl.textContent = info.calls;
    if (trisEl) {
      // wireframes draw lines, not triangles — report whichever this mode actually draws
      const value = lab.wire ? (info.lines || 0) : (info.triangles || 0);
      trisEl.textContent = value > 999 ? (value / 1000).toFixed(1) + "k" : value;
      if (trisLabel) trisLabel.textContent = lab.wire ? "line segments" : "triangles";
    }
  }
  requestAnimationFrame(frame);

  /* controls */
  $$("#segGeo button").forEach((b) =>
    b.addEventListener("click", () => {
      lab.geo = b.dataset.geo;
      $$("#segGeo button").forEach((x) => x.classList.toggle("on", x === b));
      $("#outGeo").textContent = b.textContent.toLowerCase();
      buildMesh();
      updateLabCode();
    })
  );
  $$("#segColor button").forEach((b) =>
    b.addEventListener("click", () => {
      lab.color = b.dataset.color;
      $$("#segColor button").forEach((x) => x.classList.toggle("on", x === b));
      $("#outColor").textContent = b.textContent.toLowerCase();
      buildMesh();
      updateLabCode();
    })
  );
  $("#spin").addEventListener("input", (e) => {
    lab.spin = Number(e.target.value) / 10;
    $("#outSpin").textContent = lab.spin.toFixed(1);
    updateLabCode();
  });
  $("#parts").addEventListener("input", (e) => {
    lab.parts = Number(e.target.value);
    $("#outParts").textContent = lab.parts.toLocaleString();
    buildParticles();
    updateLabCode();
  });
  $("#swWire").addEventListener("change", (e) => { lab.wire = e.target.checked; buildMesh(); updateLabCode(); });
  $("#swEase").addEventListener("change", (e) => { lab.ease = e.target.checked; updateLabCode(); });
  $("#swMouse").addEventListener("change", (e) => { lab.mouse = e.target.checked; updateLabCode(); });

  updateLabCode();
}

function highlight(code) {
  return esc(code)
    .replace(/(\/\/[^\n]*)/g, '<span class="c">$1</span>')
    .replace(/(&quot;[^&\n]*?&quot;)/g, '<span class="s">$1</span>')
    .replace(/\b(const|let|new|function|return|import|from|if|true|false)\b/g, '<span class="k">$1</span>')
    .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="n">$1</span>');
}

function updateLabCode() {
  const geoLine =
    lab.geo === "knot" ? "new THREE.TorusKnotGeometry(1.02, 0.31, 96, 12)" :
    lab.geo === "box" ? "new THREE.BoxGeometry(1.85, 1.85, 1.85)" :
    "new THREE.IcosahedronGeometry(1.5, 1)";
  const matLine = lab.wire
    ? `new THREE.LineSegments(\n  new THREE.WireframeGeometry(geo),\n  new THREE.LineBasicMaterial({ color: 0x${ACCENTS[lab.color].toString(16)}, transparent: true, opacity: 0.72 })\n)`
    : `new THREE.Mesh(\n  geo,\n  new THREE.MeshStandardMaterial({\n    color: 0x${ACCENTS[lab.color].toString(16)},\n    metalness: 0.55, roughness: 0.28, flatShading: true\n  })\n)`;
  const loop = lab.ease
    ? `  // eased: never linear\n  group.rotation.y += (target + spin - group.rotation.y) * 0.1;`
    : `  // linear: mechanical, and it shows\n  group.rotation.y = spin + target;`;
  const code = `import * as THREE from "three";

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));   // cap at 2
renderer.toneMapping = THREE.ACESFilmicToneMapping;       // nicer highlights

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 100);
camera.position.z = 5.4;

const geo = ${geoLine};
const mesh = ${matLine};
group.add(mesh);

// ${lab.parts ? lab.parts.toLocaleString() + " particles, built as ONE object = 1 draw call" : "particles off: nothing extra to draw"}
${lab.parts ? "scene.add(new THREE.Points(positions, particleMaterial));" : "// (particles disabled)"}

function frame(now) {
${loop}
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);`;
  $("#labCode").innerHTML = highlight(code);
  $("#copyLab").dataset.code = code;
}

/* ---------------- video watchlist ---------------- */
function renderVideos() {
  const grid = $("#videoGrid");
  if (!grid) return;
  grid.innerHTML = VIDEOS.map((v) => `<article class="video">
    <a class="video-thumb" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener noreferrer">
      <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360" />
      <span class="video-play" aria-hidden="true">▶</span>
      <span class="video-mins">${v.mins} min</span>
    </a>
    <div class="video-body">
      <p class="video-meta">${esc(v.channel)} · ${esc(v.who)} · pairs with level ${v.level}</p>
      <h3>${esc(v.title)}</h3>
      <p class="video-why">${esc(v.why)}</p>
      <details class="video-notes"><summary>What to listen for</summary><ul>${v.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></details>
      <div class="video-actions">
        <a class="btn btn-ghost btn-sm" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener noreferrer">Watch</a>
        <a class="link-btn" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener noreferrer">Open the transcript ↗</a>
      </div>
    </div>
  </article>`).join("");
}

/* ---------------- comfort reading ---------------- */
function initComfort() {
  const btn = $("#comfortToggle");
  const root = document.documentElement;
  let on = !!store.get(KEYS.comfort, false);
  const apply = () => {
    root.classList.toggle("comfort", on);
    if (btn) {
      btn.setAttribute("aria-pressed", String(on));
      btn.textContent = on ? "Comfort reading: on" : "Comfort reading";
    }
    $$(".slow").forEach((d) => (on ? d.setAttribute("open", "") : d.removeAttribute("open")));
    store.set(KEYS.comfort, on);
  };
  apply();
  if (btn) btn.addEventListener("click", () => {
    on = !on;
    apply();
    toast(on ? "Comfort reading on — bigger text, slower steps." : "Comfort reading off.");
  });
}

/* ---------------- who is signed in ---------------- */
async function initSession() {
  const el = $("#navWho");
  if (!el) return;
  try {
    const res = await fetch("/auth/freebuff/session", { headers: { accept: "application/json" } });
    if (!res.ok) return;
    const data = await res.json();
    const user = data && (data.user || data);
    if (!user || !user.sub) return;
    const name = user.name || user.email || "Signed in";
    el.hidden = false;
    el.innerHTML = `<span class="who-name" title="${esc(user.email || name)}">${esc(name)}</span>
      <form method="post" action="/auth/freebuff/signout"><button class="link-btn" type="submit">Sign out</button></form>`;
  } catch (e) { /* not deployed behind the gate — fine */ }
}

/* ---------------- counts ---------------- */
function fillCounts() {
  const set = (sel, v) => { const el = $(sel); if (el) el.textContent = v; };
  set("#eyebrowCount", `${totalLessons} lessons · ${TRACKS.length} levels`);
  set("#statLessons", totalLessons);
  set("#statPrompts", ALL_PROMPTS.length);
  set("#statTests", TOTAL_Q);
  set("#statModules", TRACKS.length);
  set("#statLevels", TRACKS.length);
  set("#curLevels", TRACKS.length);
  set("#curLessons", totalLessons);
  set("#railTotal", totalLessons);
  set("#promptCount", ALL_PROMPTS.length);
  set("#finishCount", totalLessons);
}

/* ---------------- boot ---------------- */
fillCounts();
renderVideos();
initComfort();
renderTabs();
renderTrackPanel();
renderLessons();
renderQuiz();
renderChips();
renderPrompts();
renderResearch();
initMcp();
initChrome();
initReveal();
syncProgress();
initHero();
initLab();
initSession();

$("#copyLab").addEventListener("click", (e) => copyText(e.currentTarget.dataset.code || "", e.currentTarget));
