/* ============================================================
   EVIDENCE BASE, FREE COURSES AND HONEST LIMITS

   Why this file exists: the lessons are not invented from vibes. The
   structure follows published work on how people learn, and the content
   follows primary documentation from the organisations that build these
   systems. This file makes that visible, so you can check it.

   Three rules I held to:
   1. Every claim about a product or a model behaviour should trace to
      primary documentation or a published study.
   2. Nothing from a paid or copyrighted course is reproduced here. Links
      only — go and take the course yourself, it is worth it.
   3. Where I could not verify something, it says so below instead of
      being quietly smoothed over.
   ============================================================ */

/* ---------------- how the course is built ---------------- */
export const DESIGN = [
  {
    h: "Why every lesson has a test",
    p: "The testing effect is one of the most replicated findings in learning research: retrieving information strengthens memory far more than rereading it. Roediger and Karpicke (2006) and Karpicke and Blunt (2011) both found that students who were tested on material retained more of it a week later than students who studied it again — even when the re-studiers felt more confident. That is why each lesson ends with questions rather than a summary, and why the answer explanations matter more than the score.",
    src: "Roediger & Karpicke (2006), Psychological Science; Karpicke & Blunt (2011), Science"
  },
  {
    h: "Why the questions are hard to guess",
    p: "A question with one obviously correct option tests nothing. These use misconception-based distractors: each wrong answer is something a learner plausibly believes halfway through a lesson. Recognising why an answer is wrong is the same act as correcting your own mental model, which is the point of the exercise.",
    src: "Dunlosky et al. (2013), practice testing as a high-utility technique"
  },
  {
    h: "Why checkpoints come after a module, not after each lesson",
    p: "Spacing and interleaving: revisiting material after a delay, mixed with other topics, produces more durable learning than massing it together. A module checkpoint pulls questions from every lesson in that level, plus two situations the lessons did not cover word for word, so it tests transfer rather than recall of a page you just read.",
    src: "Cepeda et al. (2006), distributed practice meta-analysis; Bjork, desirable difficulties"
  },
  {
    h: "Why the lessons are written in plain words twice",
    p: "Cognitive load is the limit on what a learner can hold at once. The main lesson carries the full idea; the 'in plain words' block restates it with less vocabulary; the slow version repeats it with smaller steps. Nothing is removed, so a reader who needs the simpler version is not given a thinner course.",
    src: "Sweller, cognitive load theory; universal design for learning"
  },
  {
    h: "Why five levels instead of a flat list",
    p: "AI literacy frameworks converge on a progression from understanding, to use, to critical evaluation, to design and governance. This course's five levels follow that shape, adapted for a student or early-career professional rather than a computer science major.",
    src: "Ng et al. (2021), AI literacy framework; Long & Magerko (2020); UNESCO (2024) student competency framework; AI4K12 five big ideas"
  }
];

/* ---------------- free courses worth your time ---------------- */
/* Nothing here is copied. These are links, with an honest note about what
   each one is good for and what it costs. */
export const FREE_COURSES = [
  {
    name: "Elements of AI",
    by: "University of Helsinki / Reaktor",
    cost: "Free",
    url: "https://www.elementsofai.com/",
    why: "The best free introduction to what AI actually is, written for people who are not programmers. Do the first two chapters if lesson 1 felt abstract.",
    note: "Non-technical, roughly 30 hours for the whole course, certificate available."
  },
  {
    name: "Google AI Essentials",
    by: "Google, on Coursera",
    cost: "7-day trial, then paid subscription; financial aid available",
    url: "https://www.coursera.org/specializations/ai-essentials-google",
    why: "Five short modules: introduction to AI, productivity with AI tools, the art of prompting, responsible use, staying current. The prompting module is a clear, practical treatment of workplace prompting.",
    note: "Not fully free. Coursera currently offers a 7-day trial and financial aid for eligible learners; check the course page for your region's price. I included it because the content is directly useful after this playbook."
  },
  {
    name: "Introduction to Generative AI",
    by: "Google Cloud Skills Boost",
    cost: "Free",
    url: "https://skills.google/paths/118",
    why: "Short, plain-language modules on large language models and responsible AI, from the company that builds Gemini. Good for the vocabulary in lesson 1.",
    note: "Requires a Google account. No cost for the introductory path."
  },
  {
    name: "Anthropic's Interactive Prompt Engineering Tutorial",
    by: "Anthropic",
    cost: "Free (open source)",
    url: "https://github.com/anthropics/prompt-eng-interactive-tutorial",
    why: "Nine chapters of exercises, from basic prompt structure to avoiding hallucinations and chaining prompts. The clearest free treatment of separating instructions from data, which is the idea behind half of level 5.",
    note: "Runs in a notebook or the browser. Exercises are the point; reading alone will not do much."
  },
  {
    name: "AI for Beginners",
    by: "Microsoft",
    cost: "Free (open source)",
    url: "https://github.com/microsoft/AI-For-Beginners",
    why: "A full 12-week curriculum with notebooks. If you want to understand the machinery behind the behaviour in lesson 1 — what training actually does — this is the free route.",
    note: "Technical. Optional for this course, useful if you are considering a technical career."
  },
  {
    name: "Machine Learning Crash Course",
    by: "Google",
    cost: "Free",
    url: "https://developers.google.com/machine-learning/crash-course",
    why: "The standard free introduction to how models learn, with interactive exercises. Read the modules on training, generalisation and overfitting if you want to understand why models fail on unusual input.",
    note: "Technical but approachable. About 15 hours."
  },
  {
    name: "Prompt Engineering Guide",
    by: "DAIR.AI",
    cost: "Free (open source)",
    url: "https://www.promptingguide.ai/",
    why: "A broad, well-referenced catalogue of techniques with papers attached. Use it as a reference after this course, not before — technique collecting without judgement is the trap this course tries to avoid.",
    note: "Very large. Read the techniques section, skip the model-specific parts until you need them."
  },
  {
    name: "Artificial Intelligence Teaching Guide",
    by: "Stanford Teaching Commons",
    cost: "Free",
    url: "https://teachingcommons.stanford.edu/teaching-guides/artificial-intelligence-teaching-guide",
    why: "Six self-contained modules on AI literacy, course policy and assessment, written for university teachers. The module on assessment is unusually good if you are the person setting the assignment.",
    note: "Aimed at instructors, which makes it useful for understanding what your tutors are being told."
  },
  {
    name: "CS50's Introduction to AI with Python",
    by: "Harvard, on edX",
    cost: "Free to audit",
    url: "https://cs50.harvard.edu/ai/",
    why: "The serious technical route: search, optimisation, learning, language. Take it after this course if you want to build rather than direct.",
    note: "Audit is free; the certificate is paid. Requires Python."
  },
  {
    name: "Practical Deep Learning for Coders",
    by: "fast.ai",
    cost: "Free",
    url: "https://course.fast.ai/",
    why: "The best free course for actually training models rather than using them. Top-down: you get something working, then learn why.",
    note: "Needs some programming. Not required for anything in this playbook."
  },
  {
    name: "Short Courses",
    by: "DeepLearning.AI",
    cost: "Free (most)",
    url: "https://www.deeplearning.ai/short-courses/",
    why: "One-to-two-hour courses on specific practical topics: building agents, evaluation, retrieval, prompting for specific tools. Useful when you hit a task this course does not cover.",
    note: "Most are free; a few require a paid plan. Quality varies by instructor."
  }
];

/* ---------------- primary sources for the technical claims ---------------- */
export const TECHNICAL_SOURCES = [
  ["Anthropic — Building effective agents", "The clearest published treatment of when to use a single model call, a workflow, or an agent loop — and why most systems should not be agents.", "https://www.anthropic.com/engineering/building-effective-agents"],
  ["OpenAI — A practical guide to building agents", "When to use one agent versus several, tool design, and guardrails. The guardrails section underpins lesson 20.", "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents"],
  ["Google — Prompting strategies", "Primary documentation on how Gemini models respond to structure, examples and formatting. Useful as a cross-check against any prompt advice you read.", "https://ai.google.dev/gemini-api/docs/prompting-strategies"],
  ["OWASP — Top 10 for LLM Applications", "The standard list of failure modes: prompt injection, insecure output handling, excessive agency, data leakage. Lesson 20 is a plain-language version of two of these.", "https://genai.owasp.org/llm-top-10/"],
  ["NIST — AI Risk Management Framework", "The governance vocabulary used in industry: govern, map, measure, manage. Read the first 20 pages if you need to talk about AI risk to a manager.", "https://www.nist.gov/itl/ai-risk-management-framework"],
  ["Liu et al. — Lost in the Middle", "The study behind lesson 26's claim that material in the middle of a long context is used less reliably than material at the start or end.", "https://arxiv.org/abs/2307.03172"]
];

/* ---------------- teaching and literacy research ---------------- */
export const LEARNING_SOURCES = [
  ["Roediger & Karpicke — Test-enhanced learning", "Retrieval practice improves long-term retention compared with restudying, even when restudying feels more effective.", "https://doi.org/10.1111/j.1467-9280.2006.01693.x"],
  ["Karpicke & Blunt — Retrieval practice produces more learning than elaborative studying", "The strongest single demonstration that testing beats concept-mapping for durable learning.", "https://doi.org/10.1126/science.1199327"],
  ["Dunlosky et al. — Improving students' learning with effective learning techniques", "A large review ranking study techniques. Practice testing and distributed practice come out on top; highlighting and rereading near the bottom.", "https://doi.org/10.1177/1529100612453266"],
  ["Cepeda et al. — Distributed practice in verbal recall tasks", "The meta-analysis behind 'little and often beats one long session'.", "https://doi.org/10.1037/0033-2909.132.3.354"],
  ["Ng et al. — AI literacy: definition, teaching, evaluation", "A widely used four-part framing: know and understand, use, evaluate, and ethics. This course's levels map onto it.", "https://doi.org/10.1016/j.caeai.2021.100041"],
  ["Long & Magerko — What is AI literacy?", "Competencies and design considerations from the human-computer interaction literature. Useful vocabulary for the higher levels.", "https://doi.org/10.1145/3313831.3376727"],
  ["UNESCO — AI competency framework for students", "The international policy view of what students should be able to do with AI, including the citizenship and safety dimensions.", "https://unesdoc.unesco.org/ark:/48223/pf0000391104"],
  ["AI4K12 — Five Big Ideas in AI", "Perception, representation and reasoning, learning, natural interaction, and societal impact. A useful map if you want the technical big picture.", "https://ai4k12.org/"]
];

/* ---------------- what I could not do ---------------- */
export const LIMITS = [
  "I could not include transcripts of the recommended videos. YouTube does not provide captions for another channel's videos to a third party, so the watchlist gives you notes on what to listen for and a one-click route to YouTube's own transcript instead of text I do not have.",
  "I did not reproduce material from the paid or copyrighted courses listed above. They are links with an honest note about what each is good for. Copying their content would be both illegal and worse teaching than sending you to the source.",
  "Several of the research papers are paywalled. Where I could only read the abstract or an author's summary, the claim in this course is limited to what that summary supports, and the citation is there so you can check it yourself through your university library.",
  "I could not verify what you personally see after signing in, because that needs your account. The gated course, the tests and the progress saving are checked by an automated test suite, but the signed-in experience itself is verified by you, not by me.",
  "Model behaviour changes. Anything here about how a specific product behaves was accurate when written and may move. The durable parts are the principles: verification, context, boundaries, and the judgement layer.",
  "I could not check every external link's current content at the moment you read this. Links were checked when the course was built; universities and vendors move pages. If one is dead, the title and author are enough to find it.",
  "The prices shown are what the course will cost once the owner finishes it themselves. It is free while they are learning, and no payment is taken now."
];
