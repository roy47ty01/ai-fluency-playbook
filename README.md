# AI Fluency Playbook - source archive

This repository holds the source of the AI Fluency Playbook, a four-page site (landing, syllabus, course, 3D lab) teaching AI fluency. It is live at https://ai-fluency-playbook-ri0jqi.freebuff.site/.

The code is not committed file by file. It is attached to the **v1.0.0 release** as a single archive:

**[ai-fluency-playbook-project.zip](https://github.com/roy47ty01/ai-fluency-playbook/releases/download/v1.0.0/ai-fluency-playbook-project.zip)** (2.5 MB, 46 files)

Download it and unzip it; everything lives inside the `ai-fluency-playbook/` folder.

## What is inside

- `public/` - the four pages, `styles.css`, `app.js`, the content and test modules, `landing-3d.js`, `og.png`, `robots.txt`, `sitemap.xml`
- `src/worker.js` - the server piece: course sign-in and Stripe checkout
- `tools/` - build, syllabus builder, audit and test harnesses
- `docs/` - the audit report and screenshots
- `package.json`, `package-lock.json`, `README.md`

## Getting it running

```bash
unzip ai-fluency-playbook-project.zip
cd ai-fluency-playbook
npm ci
npm run check
```

## What is still unverified

- Signing in to the course with a real Google account and seeing the gated lessons.
- A real Stripe payment; there are no live keys in this repository.
- How the course page looks on a phone.

Last full check before archiving: `npm run check` reported 96 passed, 0 failed, 0 problems.
