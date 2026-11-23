# The AI Fluency Playbook

A complete, sellable course site: a public sales page and syllabus, sign-in, three price tiers, reading-and-copying course pages, and an owner dashboard that shows who signed in and who may enter.

One Cloudflare Worker serves everything — static pages, gated course assets, enrollment, Stripe webhook and the dashboard.

- **Live site:** https://ai-fluency-playbook-ri0jqi.freebuff.site
- **Course:** 5 levels, 38 lessons. Estimated time if you do everything: about 13 hours total (roughly 7 hours core lessons, 2½ hours deeper reading and worked examples, 2½ hours lesson tests, 1 hour level checkpoints), plus the self-paced drills you do on your own work. 164 test questions (3 per lesson, 10 per level checkpoint), 48 prompts, 8 videos: a plain-language AI fluency course written for people who have never been taught this before.
- **Assessment:** you cannot mark a lesson complete until you pass its test (2 of 3). Each level ends with a ten-question checkpoint that only opens once every lesson test in that level is passed. Answers are explained, retries are unlimited, and options are shuffled with a stable seed so position never gives the answer away.
- **Price:** $19 self-paced · $49 study group (5 seats) · $149 classroom (30 seats), one payment, lifetime access, 30-day refund.

## What is in here

| Path | What it is |
| --- | --- |
| `public/` | Everything the browser gets. `index.html` is the sales page, `syllabus.html` the public syllabus, `course.html` the gated course shell, plus `styles.css`, `landing-3d.js` (the public landing page's 3D backdrop), `og.png`, `robots.txt`, `sitemap.xml`. Course-only files, all behind the gate: `app.js`, `content.js`, `content-more.js`, `content-depth-a…f.js` (deeper reading), `tests.js` + `tests-more.js` (question bank and level checkpoints), `quiz-utils.js` (deterministic option shuffling), `research.js` (evidence base, free courses, stated limits). |
| `src/worker.js` | The Worker: routing, access gate, sign-in (Freebuff auth = Google / GitHub / Apple), enrollment, Stripe Checkout + webhook, owner dashboard, CSP and security headers. |
| `tools/build.mjs` | Bundles the Worker with esbuild and stages a deployable `build/` folder (worker + assets + manifest). |
| `tools/harness.mjs` | 96 behavioural checks against the real Worker with a fake D1 database, including every course asset being blocked, free and owner-served. |
| `tools/audit.mjs` | Static audit: duplicate ids, headings, meta, alt text, `noopener`, button names, label associations, internal links, brace balance, WCAG contrast, `node --check`, content integrity, and the new checks on lesson depth, test shape, shuffled answer spread and the research section. |
| `tools/build-syllabus.mjs` | Regenerates `public/syllabus.html` from the actual course data so the marketing page can never drift from the course. |
| `tools/serve-audit.mjs` | Local preview server that reproduces the Worker's routing and CSP. |
| `tools/render-pages.mjs` | Renders the signed-in `/enroll` and `/access` pages to HTML for visual review. |
| `tools/og.html` | The template the social card (`public/og.png`) was rendered from. |
| `docs/` | Audit report and screenshots. |

## Routes

| Route | Who | What |
| --- | --- | --- |
| `/` | anyone | Sales page: hero, problem, what's inside, five levels, a full free lesson, three prices, guarantee, 10 FAQs. |
| `/syllabus` | anyone | Every one of the 38 lessons with what it gives you. |
| `/enroll` | signed in | Pick a plan. Card payment if Stripe is configured, otherwise a request the owner approves. |
| `/thanks` | signed in | Confirmation after paying or requesting. |
| `/course` | paying / approved | The course itself. Redirects to sign-in when signed out. |
| `/access` | owner | Pending requests, active people, visitors, visits, approve / deny / revoke, add by email. |
| `/api/me` | — | JSON: `{ signedIn, email, canAccess, owner }`. |

Every course asset is gated through one predicate in `src/worker.js` (`isCoursePath`): `/app.js`, `/content.js`, `/content-more.js`, `/content-depth-a…f.js`, `/tests.js`, `/tests-more.js`, `/quiz-utils.js` and `/research.js`. Adding a new content file means adding it to that pattern — the harness fails if a course asset is ever served to someone without access.

## How access works

1. Someone signs in at `/enroll` (Freebuff sign-in, so Google / GitHub / Apple — no passwords stored).
2. With Stripe configured, they pay and the webhook grants access. Without Stripe keys, they submit a request and the owner approves it at `/access`.
3. Access is an email row in the `entitlements` table (`active` / `pending` / `revoked`). The owner can add people by email, which is how a study group or classroom gets their five or thirty seats.
4. **The paywall is currently off.** Access is free to any signed-in account, so anyone who signs in can work through the whole course. Set the site variable `PAYWALL=on` to put the paid gate back exactly as it was — no code change. Sign-in is still required either way, which is how the site knows who has been in it.
5. The owner is whatever is in `OWNER_EMAIL` (a comma-separated list works, so a work and a personal address can both be owner). Owners never pay: `/enroll` sends them straight to the course and the dashboard says so. If `OWNER_EMAIL` is unset, **the first account to sign in claims ownership** — which means anyone who beats you to a published site keeps it, so set `OWNER_EMAIL` before sharing the link.
6. Ownership is decided on the server for every request, so it can't be faked from the browser.

## Run it locally

```bash
npm ci                # install esbuild + @freebuff/auth
npm run build         # bundle the Worker, stage build/
npm test              # 96 behaviour checks
npm run audit         # static audit, exits non-zero on any problem
npm run preview       # http://localhost:3100 — public pages with real CSP
npm run syllabus      # regenerate public/syllabus.html after editing lessons
```

The gated pages need sign-in, which only works on a deployed origin, so locally you can review `/enroll` and `/access` with `node tools/render-pages.mjs` after a build.

## Deploy

1. `npm run build` — produces `build/worker.js`, `build/public/`, `build/manifest.json`.
2. Publish `build/manifest.json` to the Freebuff Sites site `b7e4c1a2-9f3d-4c58-8a61-2d5e7f9b0c4a` (production environment). In Freebuff: *"deploy the site"*. The D1 database is attached as the `DB` binding and the platform injects `FREEBUFF_CLIENT_ID`, `FREEBUFF_ISSUER` and `APP_ORIGIN`.
3. Check the deployment receipt, then confirm `published: true` — a successful upload is not the same as a published site.

Keep the staging folder name dot-free: the deployer rejects hidden paths (`build/`, not `.deploy/`).

Never rewrite a request to `*.html`: the asset layer already 307-redirects `.html` to the extensionless URL, and rewriting back causes a redirect loop.

### Secrets

Set these in the Sites secrets panel (never in a file):

| Secret | Needed for |
| --- | --- |
| `PAYWALL` | Set to `on` to require payment again. Unset (now) means the whole course is free to signed-in visitors. |
| `OWNER_EMAIL` | Fixes ownership to one or more addresses (comma-separated) instead of first-come-first-served. **Set on production** to `roy47ty@gmail.com,receeyr23@gmail.com` — both addresses get the whole course free. |
| `STRIPE_SECRET_KEY` | Card checkout. |
| `STRIPE_WEBHOOK_SECRET` | Verifying Stripe webhooks (HMAC-SHA256, 5-minute tolerance). |
| `STRIPE_PRICE_STUDENT` / `_GROUP` / `_CLASS` | The three Stripe Price IDs. Checkout stays off for a plan whose price ID is missing. |

With no Stripe keys the site still sells: enrollment collects a request and the owner approves it.

## Editing content

- **Lessons** live in `public/content.js` (first 26) and `public/content-more.js` (the rest), plus the `PLAIN` plain-language versions and `VIDEOS` watchlist. Run `npm run syllabus` afterwards.
- **Prices** appear in two places: `public/index.html` (the three cards and the FAQ) and `PLANS` at the top of `src/worker.js`. Change both.
- **Social card** `public/og.png` was rendered from `tools/og.html`.
- Progress is stored in the browser under `aifp.done.v2`, `aifp.name.v2`, `aifp.start.v2`, `aifp.level.v2`, `aifp.comfort.v2` — nothing about a learner's progress is sent to the server.

## Status and known gaps

Verified: 96/96 harness checks, static audit with 0 problems, live CSP with no violations, course renders 38 lessons with 38 deeper-reading layers, 38 lesson tests and 5 level checkpoints, mobile at 390px, full route sweep on production, site published.

Not verified (needs a real account or keys): the full signed-in journey end to end, a real Stripe payment, and ownership claim by a real person. YouTube transcripts for the third-party videos were not obtainable — captions on other people's videos aren't accessible, so the watchlist links out and the course teaches the ideas itself.

See `docs/audit-report.md` for the detailed results.
