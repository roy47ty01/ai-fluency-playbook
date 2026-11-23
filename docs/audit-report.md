# Audit report — 22 November 2026

Everything below was run against the real files and the real deployed Worker. Problems found were fixed and the checks rerun.

## 1. Behaviour harness — 96/96 pass

`tools/harness.mjs` drives the actual Worker with a fake D1 database. It covers:

- Public landing and syllabus served; gated course redirects when signed out.
- Course assets (`/app.js`, `/content.js`, `/content-more.js`) also gated.
- Pending → approved → revoked access flow.
- Cross-origin POST returns 403 (`isSameOriginRequest` on every mutation).
- Owner claim on first sign-in, `OWNER_EMAIL` override, approve / deny / revoke, invite list.
- Stripe signature: valid passes; tampered body, wrong signature and stale timestamp all fail.
- Webhook grants access; plan data (`PLANS`) is internally consistent with the price cards.
- `/api/me` reports `signedIn`, `canAccess`, `owner` correctly in each state.

## 1b. Owner access — the owner never pays

Added and verified after the first audit, because free owner access is the whole point of building this before selling it:

- Owner opens `/course` and every course file (`/app.js`, `/content.js`, `/content-more.js`) with **no payment and no entitlement row**.
- `/enroll` redirects the owner straight to `/course`, so they can never be shown a paywall.
- `/access` tells the owner plainly that the course is open to them without paying.
- `OWNER_EMAIL` accepts a comma-separated list, so a work address and a personal one can both be owner.
- Anyone else: a signed-in stranger with no entitlement gets 403 on the course and on the course files; a pending request gets 403 until approved.

### The real risk this exposed, and the fix

On a published site with `OWNER_EMAIL` unset, **the first account to sign in becomes the owner** — so a visitor could have claimed the site, opened the whole course free and locked the real owner out of the dashboard. Production now has `OWNER_EMAIL` set as a secret (`roy47ty@gmail.com,receeyr23@gmail.com` — a comma-separated list of every address that gets free owner access), which always wins over any earlier claim, so ownership cannot be squatted. Set that secret before sharing the link on any future deployment.

## 2. Static audit — 0 problems

`tools/audit.mjs`:

- No duplicate ids on any page; exactly one `h1` per page; `lang` and viewport present.
- Title 15–70 chars and meta description 60–175 chars on every page.
- Every image has `alt`; every `target="_blank"` has `rel="noopener"`.
- Every button has an accessible name; every labelled input resolves.
- Every internal link resolves to a real route or file.
- No inline `<script>` outside the landing page's JSON-LD (the CSP has no `unsafe-inline` for scripts).
- Balanced CSS braces; no `allowedHosts: true`.
- Contrast: `--text` 7:1+ on the page background, `--muted`/`--dim`/`--line` 4.5:1+, `--dim` on panels 4.5:1+.
- `node --check` clean on `app.js`, `content.js`, `content-more.js`; no `debugger`.
- Content integrity: 38 lessons, unique numbers, every lesson has plain + slow text, every lesson on a real track, no empty fields, 8 videos.

### Fixes made during the audit

- `--dim` was `#69738a` (4.6:1 on panels, failing the 4.5 minimum after rounding in some contexts) → `#7b859c`, now 5.38:1.
- The three price cards had different heights and their buttons did not line up → `align-items: stretch` with a column layout.
- The course's copy button looked up lessons in the wrong array (`LESSONS` instead of `CURRICULUM`) and threw on the last five lessons → uses `CURRICULUM` with a guard.
- The level summary named four levels instead of all five.
- `syllabus.html` and `index.html` both had link/meta drift → the syllabus is now generated from the course data.

## 3. Live checks under the real CSP

- Course page: 38 lessons render, 38 plain-language blocks, 38 slow-reading blocks, 8 videos, 48 prompts, lab code present; **no CSP violations** in the console.
- Landing page: fonts load, 9 sections, 3 price cards, 10 FAQs, no horizontal overflow at 1440px or 390px.
- Route sweep on production: `/` 200 · `/syllabus` 200 · `/og.png` 200 · `/robots.txt` 200 · `/sitemap.xml` 200 · `/course` 302 → sign-in · `/enroll` 302 · `/access` 302 · `/api/me` 401 · `/nope` 404.

## 4. Security posture

- CSP on every response; `script-src 'self'` everywhere except the landing page, which allows inline only for its JSON-LD block.
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: same-origin`, `Permissions-Policy` denying camera, microphone and geolocation.
- Every mutating request checks same-origin.
- Stripe webhooks verified with HMAC-SHA256 and a 300-second tolerance.
- No passwords stored anywhere: sign-in is delegated.
- No tracking pixels or third-party analytics; Cloudflare's injected analytics beacon is blocked by the CSP on purpose.
- Course text is gated server-side, not hidden with CSS.

## 5. Not verified

- The signed-in journey (sign in → enroll → course → visit logged in `/access`) — needs a real Google/GitHub account.
- A live Stripe payment — needs `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and the three price IDs.
- Ownership claim by the actual owner.
- YouTube transcripts for third-party videos: not obtainable through available tools, so the course links out instead of quoting other people's videos.

## 1c. Access is free while the owner works through the course

The paywall is switched off. Any signed-in account opens the whole course, with no entitlement row and no payment step; sign-in is still required, which is how the site records who has been in it. The gate is controlled by one site variable: set `PAYWALL=on` to restore the paid gate exactly as it was, with Stripe checkout, access requests and owner approvals untouched. The public sales page and syllabus now say plainly that the course is free right now and that the three prices are what it will cost afterwards, so nothing on the site promises a charge that cannot happen.

Verified locally: 75 harness checks (including a free-mode section and a check that `PAYWALL=on` puts the gate back) and 0 audit problems.

## 4. Course deepened, tested, and checked against published research — 96/96, audit 0 problems

Requested: longer and more detailed lessons, a test after every lesson, a catch-up test after every module, real research rather than invented material, and an audit that fixes what it finds.

### What was added

- **A deeper-reading layer on all 38 lessons** (`content-depth-a…f.js`): 10,267 new words, 95 sections, 38 worked examples, 153 glossary terms, 4 common mistakes per lesson and a three-point recap. Lesson 1 now runs to three sections, a traced worked example and five terms, because the original was too short to hold the idea.
- **38 lesson tests** (`tests.js`, `tests-more.js`): three questions each, four options, an explanation for every answer, pass mark 2/3, unlimited retries.
- **5 level checkpoints**: ten questions per level, pass mark 8/10. Eight come from the level's lessons; two are transfer questions about situations the lessons never mention word for word. A checkpoint stays locked until every lesson test in that level is passed.
- **A research and evidence section** (`research.js`): five design-rationale notes with citations, eleven free external courses (Elements of AI, Google AI Essentials, Google Cloud intro to generative AI, Anthropic's prompt-engineering tutorial, Microsoft AI for Beginners, Google's ML Crash Course, DAIR.AI's guide, Stanford's AI Teaching Guide, Harvard CS50 AI, fast.ai, DeepLearning.AI short courses), six technical primary sources, eight learning-research sources, and a seven-point "what I could not do" list shown on the page rather than buried here.
- **Progress now means passed, not clicked.** A lesson cannot be marked complete until its test is passed; the button scrolls you to the test and says why. Module results persist in `aifp.mod.v3`, lesson results in `aifp.quiz.v3`.

### Two real problems the audit caught, and the fixes

1. **The answer key was pattern-matchable.** Writing 164 questions by hand put 158 of the correct answers in the second position, so a learner could pass every test by always picking B. Fixed by shuffling options with a seeded deterministic shuffle (`quiz-utils.js`), so the order is stable for a given question but position carries no information. The audit now measures the *effective* distribution after shuffling: 58/28/30/48 across the four positions, minimum 17%. It also asserts the shuffle is stable between renders and that the correct answer survives it with its index updated.
2. **The new course files were not behind the paywall.** The Worker had a hard-coded list of three gated assets, so `tests.js`, `content-depth-*.js`, `quiz-utils.js` and `research.js` would have been served to anyone who guessed the path — the entire course text and answer key, publicly. Fixed by replacing the list with one `isCoursePath()` predicate used by both the signed-in and signed-out branches. The harness now loops over nine course assets and checks them in three states: blocked with no entitlement (403), served in free mode, served to the owner. 96 checks, up from 75.

### How it was verified

- `npm test` → 96 passed, 0 failed. `node tools/audit.mjs` → 0 problems.
- The audit gained checks for: every lesson having depth of 250+ words across at least two sections; a worked example, terms, mistakes and a three-point recap in every layer; three questions with four distinct options and an explanation in every lesson test; ten questions and a pass mark of 8 in every checkpoint; 164 distinct questions; answer-position spread after shuffling; and the research section's counts.
- The app's render path was executed against a lightweight DOM (headless, outside the repo) because the cloud browser could not reach the sandbox's loopback: 38 lessons, 38 deep layers, 95 sections, 38 lesson tests with 456 options, 5 locked checkpoints, 11 free-course cards, 5 design notes, 7 limits, and no runtime errors. Answering a lesson test produced the expected 1/3 with three explanations and disabled options. Seeding all Foundations lessons as passed unlocked that checkpoint, and submitting ten correct answers produced 10/10 plus persisted `{"foundations":10}`.
- The signed-in *visual* experience on production is still verified by the owner, not by me: I cannot sign in as them.

### What could not be done

- **Video transcripts.** YouTube does not give a third party another channel's captions. The watchlist keeps honest listening notes and a one-click route to YouTube's own transcript, rather than invented text.
- **Copying course content.** Nothing from Google, Microsoft, Anthropic, Harvard or Coursera is reproduced. They are linked, with a note on what each is good for; the material here is written independently and cited where it rests on a source.
- **Paywalled papers.** Where only the abstract was available, claims were limited to what the abstract supports and the DOI is given so the reader can check it through a library.
- **Live Stripe and the signed-in course view** remain untested for the same reasons as before: they need credentials and the owner's own account.
