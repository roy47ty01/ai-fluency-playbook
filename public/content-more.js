/* ============================================================
   CONTENT (part 2) — the slower layer, the business/study track,
   the extra lessons, and the video watchlist.

   Two things to know about this file:
   1. PLAIN holds, for every lesson, an "in plain words" summary
      and an "if that felt fast" slow version. Nothing is removed
      from the main lesson — it is repeated more simply.
   2. VIDEOS is a curated watchlist. These are real videos with
      real IDs, but the notes are MY notes on what to listen for,
      not transcripts. YouTube does not let a third party download
      another channel's captions, so a transcript is not something
      I can honestly give you here. Every card tells you how to
      open the transcript yourself in one click.
   ============================================================ */

/* ---------------- extra lessons (25–38) ---------------- */
export const EXTRA_LESSONS = [
  /* ---- foundations, still level 1 ---- */
  {
    n: 25, track: "foundations", title: "Talk to it like a new intern, not a search box",
    mins: 7,
    promise: "Stop getting generic answers by giving the two things a search box never needed: who you are, and what done looks like.",
    why: "Search engines reward two or three keywords. These systems reward the opposite: the more of the situation you explain, the less they have to invent. Picture a smart intern on their first day. They are quick, willing, and know nothing about you. If you say 'write about sustainability', you get a Wikipedia page. If you say 'I'm a second-year business student, my tutor thinks corporate greenwashing is overblown, and I need 200 words that take a position', you get something you can hand in. Nothing about the model changed. The situation arrived.",
    steps: [
      "Before you type, answer three things in your head: who I am, who this is for, what finished looks like.",
      "Write those three lines first, then the request underneath them. It takes thirty extra seconds.",
      "Compare: send 'help with my marketing plan', then send the same request with your course, your audience and a word count. Read both answers side by side.",
      "Keep the three lines in a note. You will paste them hundreds of times."
    ],
    prompt: "Three lines of context before we start:\n- I am: [course, year, job, or 'complete beginner']\n- This is for: [tutor / manager / group chat / just me]\n- Done looks like: [length, format, and the one thing it must achieve]\nAcknowledge in one line, then wait for my request.",
    check: "What are the three context lines you'll paste from now on?",
    note: "Politeness doesn't help or hurt. Specificity does. 'Please' costs nothing; '200 words, for my tutor, taking a position' is what changes the answer.",
    noteLabel: "plain truth"
  },
  {
    n: 26, track: "foundations", title: "Why long chats slowly get worse",
    mins: 8,
    promise: "Understand the single reason a conversation that started brilliant turns useless by message forty.",
    why: "A model has a working memory called the context window. Everything in the conversation sits in it: your messages, its replies, any document you pasted. That memory is finite, and — this is the part nobody tells you — quality drops well before it is full. The model starts answering the conversation rather than your question. It defends earlier choices, repeats itself, and forgets the constraint you set in message three. This is not a bug you can prompt your way out of. It is a limit of the design, and the fix is structural: one task per chat, and a short handoff note when you move on.",
    steps: [
      "Notice the symptom: the answer repeats something you already corrected, or ignores a rule from earlier.",
      "Don't argue with it. Open a new chat.",
      "Paste a five-line handoff: goal, decisions made, what failed and why, current state, next step.",
      "Do one task per chat from now on, and watch how rarely you get that stuck feeling."
    ],
    prompt: "Write me a handoff note I can paste into a fresh chat with no memory of this one: the goal, what we decided, what we tried that failed and why, the current state, and the next single step. Under 120 words, no recap of the discussion.",
    check: "What's the earliest sign that a chat has gone stale for you?",
    note: "Bigger context windows do not remove this. A larger desk still gets messy, and models attend less reliably to the middle of a very long context than to the start and end.",
    noteLabel: "field note"
  },
  {
    n: 27, track: "foundations", title: "The ten-minute daily habit",
    mins: 9,
    promise: "Turn a course you read once into a skill you still have in six weeks.",
    why: "Reading about AI changes nothing. Ten minutes a day does, because the skill is a set of small habits: brief properly, check one claim, keep what worked. The loop is deliberately boring. Pick one real task you were going to do by hand anyway. Use the tool on it. Then write one line in a log: what you asked, whether it worked, and what you'd change. Once a week, read the log. The log is the whole trick — it is how you notice you keep making the same mistake, which no amount of reading will tell you.",
    steps: [
      "Open a note called 'AI log'. Three columns: task, worked?, change next time.",
      "Today, pick one small real task — a reply, a summary, a formula, a reading list. Do it with AI and log it.",
      "Do this five days in a row before deciding whether it's useful.",
      "On day seven, read the log and delete any habit that isn't paying you back."
    ],
    prompt: "Interview me for five minutes about how I actually spend my week, one question at a time. At the end, name the three tasks I should hand to AI first, the three I should never hand over, and what a realistic ten-minute daily practice looks like for someone with my schedule.",
    check: "What did you do yesterday that you'll never do by hand again?",
    note: "Consistency beats intensity here. Five ten-minute sessions in a week will change your habits; one three-hour session on a Sunday mostly produces enthusiasm, which fades.",
    noteLabel: "how to practise"
  },

  /* ---- operator, level 2 ---- */
  {
    n: 28, track: "operator", title: "Email, meetings and notes",
    mins: 9,
    promise: "Clear an hour of admin a day without sending anything embarrassing.",
    why: "This is the highest-return, lowest-risk place to start, because you already know what good looks like. Three jobs cover most of it: turning a messy thread into a decision, turning a meeting into actions with owners, and drafting a reply you'd actually send. The risk is tone and invented detail — a polite 'yes' that commits you to something, or a summary that credits someone with a decision they didn't make. So the rule is: the model drafts, you read the one sentence that could get you in trouble, and you send.",
    steps: [
      "Paste a real thread (remove names first) and ask for the decision, the open question, and who owes what.",
      "For a meeting, paste your notes and ask for actions with an owner and a date — then check every owner.",
      "For a reply, give it the outcome you want and the relationship, not just the topic.",
      "Never let it send. Drafting is reversible; sending isn't."
    ],
    prompt: "Here are my messy notes from a meeting: [paste].\nGive me: (1) the three decisions actually made, (2) actions as a table with owner and deadline, (3) anything raised but not resolved. Do not invent an owner or a date — write 'unassigned' if it isn't there. Flag anything you inferred.",
    check: "Which sentence in your last AI-drafted email would you have regretted sending?",
    note: "Strip names, client details and anything confidential before you paste. A summary you can share is worth less than a leak you can't undo.",
    noteLabel: "safety"
  },
  {
    n: 29, track: "operator", title: "Read a 60-page document in twenty minutes",
    mins: 10,
    promise: "Get through a report, a contract or a reading list without pretending you read every word.",
    why: "Long documents are where AI is genuinely, unambiguously useful — not because it reads for you, but because it builds the map you'd build slowly. The mistake is asking 'summarise this'. You get a pleasant paragraph that could describe any document in that genre. Ask instead for structure: what the argument is, what each section does, what's assumed, what's missing, and where the load-bearing claim is. Then read those two pages yourself. You end up better informed than someone who skimmed all sixty.",
    steps: [
      "Ask for the skeleton first: sections, one line each, plus the single claim everything rests on.",
      "Ask what the document does not cover, and who it's written for. Absences are where the spin lives.",
      "Read the two pages it names as load-bearing. Only those, properly.",
      "Ask for five questions a sharp examiner would ask. Answer them yourself before checking its answers."
    ],
    prompt: "Here is a [type] document: [paste or attach].\nFirst: the skeleton — each section in one line, and the single claim the whole thing rests on.\nSecond: what it assumes, who it's written for, and what it conspicuously doesn't cover.\nThird: the two pages I must read myself, and five questions a sharp examiner would ask. Quote page or section numbers; if you can't, say so rather than paraphrasing from memory.",
    check: "Can you state the document's main claim in one sentence without looking?",
    note: "Long-document summaries quietly blend what the document says with what the model knows about the topic. Insist on quotes and page references, then spot-check one.",
    noteLabel: "failure mode"
  },

  /* ---- apply it, level 3: business and study ---- */
  {
    n: 30, track: "apply", title: "A study workflow that doesn't cheat",
    mins: 11,
    promise: "Use AI to understand material faster without handing in something you can't defend.",
    why: "There is a line, and it's easy to find: AI can help you understand, practise and organise. It cannot do the understanding for you, and the moment you submit words you can't explain, you've bought a problem. Universities are increasingly explicit about disclosure, and a viva or a follow-up question exposes it instantly. The workflow that actually works is: read the source yourself first, use AI to test whether you understood it, then write your own answer and use AI as a critical reader. You learn more, and nothing you submit is a lie.",
    steps: [
      "Read the source once, by hand, with a pen. No tool. It's slower and it's the part that sticks.",
      "Close it. Ask AI to quiz you on the topic with ten questions, easy to hard. Answer out loud.",
      "Where you get one wrong, ask for an explanation of that specific gap — not a summary of everything.",
      "Write your draft yourself. Then ask for the three weakest points in your argument, and fix them in your own words.",
      "Disclose what you used, in whatever form your institution asks for. It costs one line and removes all the risk."
    ],
    prompt: "Quiz me on [topic] at [my level]. Ten questions, easiest first, one at a time — wait for my answer before the next. Don't tell me the answer until I've tried. At the end, list the concepts I got wrong and give me one short explanation and one practice question for each.",
    check: "Could you explain your last submitted piece out loud, with no notes, to a tutor?",
    note: "The test of whether you've used AI well: you can defend every sentence. If there's a paragraph you couldn't rebuild from memory, that's the paragraph to rewrite by hand.",
    noteLabel: "the line"
  },
  {
    n: 31, track: "apply", title: "Market research for a business case",
    mins: 12,
    promise: "Build the evidence section of a business case without inventing a single number.",
    why: "A business case lives or dies on whether the numbers and the market claims hold up. AI is excellent at the structure — what a market analysis should contain, which competitors to look at, what a sceptical finance person will ask. It is unreliable on the specifics: market size, growth rates, competitor revenue. Those come from sources you can open. The professional version of this lesson is: let it design the research plan, then go and get the numbers yourself, then let it attack your conclusion.",
    steps: [
      "Ask for the research plan: the five questions that decide whether this idea is worth anything, and the cheapest credible source for each.",
      "Get the numbers from primary sources — company filings, government statistics, trade bodies. Not from a chat.",
      "Paste your findings back and ask what contradicts them, and which competitor would kill this business.",
      "Write the one-page case: problem, evidence, option, cost, risk, recommendation. Then ask what a sceptical finance director would challenge first."
    ],
    prompt: "I'm writing a business case for [idea] in [market].\nGive me: the five questions that decide whether this is worth doing, and for each the cheapest credible source type (filing, official statistic, trade body, academic).\nThen list the assumptions I'll be tempted to make without evidence, and the three questions a sceptical finance director will ask.\nDo not give me market-size figures from memory — tell me where to look instead.",
    check: "Which number in your case could you not defend if someone asked 'where's that from?'",
    note: "Two vendor blogs agreeing is one source. A trade body, a government dataset and an independent journalist are three. Count source types, not links.",
    noteLabel: "method"
  },
  {
    n: 32, track: "apply", title: "Numbers a lecturer will question",
    mins: 12,
    promise: "Build a simple model whose assumptions you can defend, line by line.",
    why: "Most student models fail in the same three places: a hidden assumption in a cell, a total that double-counts, and a break-even that only works if growth is infinite. AI helps most before you build — by forcing the assumptions into the open — and after, as an attacker. It helps least in the middle, where it will happily produce a beautiful spreadsheet built on numbers you never agreed to. So: agree the assumptions in words first, build the sheet yourself or with a tool you watch, then have something try to break it.",
    steps: [
      "Write the model in sentences before any cell: revenue = price × volume, costs = fixed + per-unit, and what year one assumes.",
      "List every assumption with a range — 'price £12–£18' — not a single number.",
      "Build it, then change one assumption at a time and watch which output moves most. That's your sensitivity, and it's usually your whole grade.",
      "Ask for the three ways this model is wrong, then check them by hand."
    ],
    prompt: "Here's my model in words: [describe].\n1. List every assumption I've made, including the ones I didn't notice.\n2. For each, give a defensible range and where I could find evidence.\n3. Build the smallest spreadsheet formula set that computes [the output], with a sensitivity table on the two assumptions that matter most.\n4. Tell me the three ways this is likely wrong, and the first one a marker would spot.\nNo invented figures — leave a cell blank and label it 'assumption' instead.",
    check: "If your growth assumption halved, does the recommendation survive?",
    note: "Sensitivity beats precision. A model with rough numbers and an honest range scores better than a precise model with one hidden guess — and it survives questions.",
    noteLabel: "what markers reward"
  },
  {
    n: 33, track: "apply", title: "Process maps: where the hours actually go",
    mins: 11,
    promise: "Find the one step in a process worth automating, and prove it with numbers.",
    why: "Every operations module asks you to improve a process. The instinct is to automate the most annoying step. The professional move is to find the step that costs the most time × frequency × error rate, and then check whether a human still needs to decide anything there. AI is a good interviewer for this: it asks the questions you'd forget, and it will draw the map while you talk. It's a bad source of numbers — those come from watching the process or asking the people who run it.",
    steps: [
      "Describe the process out loud to the tool as if to a new colleague. Include the annoying bits and the workarounds.",
      "Ask for a step-by-step map with: who does it, how long it takes, how often, and what goes wrong.",
      "Mark each step: decide, transform, or move. Only transform and move are automation candidates.",
      "Pick the one with the highest time × frequency × error, and write the before/after in hours per month."
    ],
    prompt: "I'm mapping this process: [describe it messily].\nDraw it as numbered steps with, for each: who does it, time per run, runs per month, and the common failure.\nThen classify each step as decide / transform / move, flag which are automation candidates and which must stay human, and tell me which single step probably costs the most per month. Ask me for any number you need rather than assuming one.",
    check: "Which step in your process has a human decision hidden inside it?",
    note: "The step people most want to automate is usually the one that needs the most judgement. Automating the boring move step often saves more hours anyway.",
    noteLabel: "common mistake"
  },
  {
    n: 34, track: "apply", title: "Present it so the room follows",
    mins: 10,
    promise: "Turn a report into eight slides that a tired audience can follow, and survive the questions.",
    why: "A presentation is not a report with fewer words. It's one argument, delivered in an order that a room can hold in their heads. The failure mode is a deck that lists everything you did, because you were afraid of leaving something out. AI is genuinely strong here: it will compress your argument, name the slide that does no work, and rehearse the hostile question you're dreading. What it can't do is know what your audience already believes — that's your job, and it decides the order.",
    steps: [
      "Write the one sentence you want the room to repeat afterwards. Everything else serves it.",
      "Ask for a slide outline where each slide's headline is a claim, not a topic label.",
      "Cut the slide that only shows you did the work. There is always one.",
      "Rehearse the three hardest questions out loud, not in your head."
    ],
    prompt: "My presentation must land this one sentence: \"[sentence]\". Audience: [who, what they already believe, how tired they'll be]. I have [N] minutes.\nGive me: a slide-by-slide outline where every headline is a claim, the one slide I should cut, the opening 15 seconds word for word, and the three questions I'll be asked that I'm least ready for — with a one-line answer to each.",
    check: "What's the sentence you want repeated back to you afterwards?",
    note: "Rehearsing in your head hides the gaps. Say it out loud once; you'll find the sentence that only works when you're reading it.",
    noteLabel: "practise"
  },

  /* ---- builder, level 4 ---- */
  {
    n: 35, track: "builder", title: "Build a small tool for your own coursework",
    mins: 12,
    promise: "Make a calculator, checklist or converter you'll actually use this term — in one sitting.",
    why: "The gap between 'I use AI to write things' and 'I make things' is one small project. A tool is the best first project because it has a pass/fail test: does it give the right answer on an example you can compute by hand? Keep it tiny and browser-only — no accounts, no database, no hosting. One page, a few inputs, one output, and a note at the bottom saying what it doesn't handle. That last note is what separates a toy from something you'd show an employer.",
    steps: [
      "Pick something you compute repeatedly: a break-even, a grade average, a currency split, a unit conversion.",
      "Work out one example by hand first, and write down the expected answer. That's your test.",
      "Ask for the page, then use your test. If it disagrees, your example is right — say so and show it.",
      "Add the 'what this doesn't handle' line, then save it somewhere you'll find it again."
    ],
    prompt: "Build a single-page tool that [calculates X].\nInputs: [list]. Output: [what to show, and the units].\nIt must run entirely in the browser with no backend and no accounts, work at 360px wide, and show a validation message instead of calculating when an input is empty or not a number.\nHere's my worked example: [inputs] should give [answer]. Check yours against it and tell me if it doesn't match.\nAdd a short 'what this doesn't handle' note at the bottom.",
    check: "What's the worked example you'll use to prove the tool is right?",
    note: "Hand-computing one example first is the whole discipline. It converts 'looks plausible' into 'is correct', and it's the habit that makes every later build trustworthy.",
    noteLabel: "the trick"
  },
  {
    n: 36, track: "builder", title: "When it goes wrong: debug patiently",
    mins: 12,
    promise: "Fix a broken page or formula in five calm steps instead of twenty panicked ones.",
    why: "Beginners debug by describing the symptom and hoping. That produces guesses, and guesses produce three new bugs. The professional loop is: read the actual error, find the smallest thing that reproduces it, change one thing, check again. It is slower for the first two minutes and dramatically faster overall. The same loop works for a broken spreadsheet formula, a page that won't scroll, and an automation that emails the wrong person.",
    steps: [
      "Copy the exact error text. Don't paraphrase it — the wording usually names the cause.",
      "Shrink it: which single line, cell or step fails? Comment out or delete everything else.",
      "Change one thing. Then check. Two changes at once and you learn nothing about either.",
      "If you're stuck after two honest attempts, ask for three hypotheses ranked by likelihood, and the cheapest test for each.",
      "Write down what it was. The same bug returns in three months and you won't remember."
    ],
    prompt: "Something is broken. Here is the exact error: [paste]. Here is the smallest thing that reproduces it: [paste].\nGive me three hypotheses ranked by likelihood, and for each the cheapest way to test it — one command, one cell, one click. Don't rewrite anything yet. Tell me which test to run first and what result would confirm or kill each hypothesis.",
    check: "What's the smallest version of your last bug that still breaks?",
    note: "Changing two things at once is the most common self-inflicted debugging wound. It feels faster and it destroys the information you needed.",
    noteLabel: "field note"
  },

  /* ---- mastermind, level 5 ---- */
  {
    n: 37, track: "mastermind", title: "Data, privacy, and being honest about it",
    mins: 12,
    promise: "Know exactly what you can paste, what you must never paste, and how to say what you used.",
    why: "Every organisation now has a version of the same rule: don't put other people's personal data into a tool you haven't been cleared to use. That includes names with contact details, health information, client financials, and anything under an NDA. The habit that keeps you safe is mechanical: strip before you paste, use placeholders, and keep the real file local. The second half is honesty. Disclosing that AI helped you draft something is not a confession — it's the professional norm, and it's increasingly a formal requirement in coursework and in client work.",
    steps: [
      "Write your own three-line rule: what never leaves my machine, what I'll placeholder, what I'll disclose.",
      "Practise it once: take a real document, replace every name and number, and use the placeholder version.",
      "Check what your course or employer requires for disclosure. One line in the appendix usually covers it.",
      "When you're unsure, ask before pasting. That question has never once been the wrong move."
    ],
    prompt: "Here's a document with the personal details removed and placeholders in their place: [paste].\nBefore you answer, tell me if you can infer or re-identify anyone from what's left. If yes, say what gave it away and stop. If no, continue.\nThen answer: [question].",
    check: "What's in your rule's 'never leaves my machine' line?",
    note: "Placeholders are not perfect anonymisation. A job title, a small town and a date can identify one person. If re-identification would matter, don't paste it at all.",
    noteLabel: "limit"
  },
  {
    n: 38, track: "mastermind", title: "Your 30-day plan",
    mins: 14,
    promise: "Leave with a written plan for the next month, built around your actual week.",
    why: "A course that ends with a feeling ends there. A course that ends with a plan changes what you do on Monday. The plan is deliberately small: one habit, one artefact, one person you teach. One habit because habits compound. One artefact because something that exists is proof. One person because teaching is the fastest way to find the gap in your own understanding — and because that's how this skill spreads. Write it down, put it where you'll see it, and give it a date.",
    steps: [
      "Pick one habit from the log you kept in lesson 27. Not three.",
      "Pick one artefact: a page, a dashboard, a tool, a cleaned-up process. Something a stranger could look at.",
      "Pick one person to teach one lesson to, this month. A classmate, a colleague, a flatmate.",
      "Write the three with dates. Then ask for the plan's weakest assumption and fix it now."
    ],
    prompt: "Here's my situation: [course/job, hours per week, what I'm already good at, what I avoid].\nBuild me a 30-day plan with exactly three commitments — one daily habit under 15 minutes, one artefact finished by day 30, one person I'll teach one lesson to. For each: the first step, the day it happens, and the most likely reason I'll quit.\nThen tell me the weakest assumption in this plan.",
    check: "What are you doing on Monday, specifically, in under fifteen minutes?",
    note: "Plans fail on specificity, not ambition. 'Practise more' fails. 'Ten minutes after my 9am lecture, on the same document' survives.",
    noteLabel: "the difference"
  }
];

/* ---------------- in plain words + slower version ---------------- */
export const PLAIN = {
  1: {
    plain: "The model isn't looking anything up. It's writing the most likely-sounding answer, which is why the shape is always good and the details are sometimes invented.",
    slow: "Read the first sentence again and stop there. It writes well because it learned what good writing looks like. It gets facts wrong for the same reason — it's guessing what usually comes next, not checking. So: use it for structure, tone and drafts. Verify numbers, names, dates and quotes yourself. That's the entire lesson."
  },
  2: {
    plain: "A good request has six parts: who it should act as, what you want, what it needs to know, what to avoid, what shape the answer should take, and how you'll know it's good.",
    slow: "You don't need all six every time. Start with three: what you want, who it's for, and how long. Add the rest when the answer is still wrong. Most people write one line and blame the tool for the four missing lines."
  },
  3: {
    plain: "Saying 'make it professional' means nothing. Showing one example of what you mean works immediately.",
    slow: "Next time you're about to describe a tone with adjectives, paste a real example instead. One paragraph you wrote yourself, and one you hate. It takes twenty seconds and replaces three rounds of 'no, warmer than that'."
  },
  4: {
    plain: "Ask for the plan before the work. Fixing a plan costs one sentence; fixing finished work costs an afternoon.",
    slow: "The magic words are 'plan first, no changes yet'. Read the plan properly — does it show it understood the goal, or just repeated your words back? Correct one line, then say go."
  },
  5: {
    plain: "AI will say 'done' when it means 'I tried'. Your job is to check the one thing a reader would test first.",
    slow: "You don't need to check everything. Check the single claim that, if wrong, makes the whole thing worthless — a number, a name, a date, a quote. Then ask 'what did you not check?' and believe the answer."
  },
  6: {
    plain: "Stop retyping the same instructions. Keep a note of your best prompts and your standard context, and paste them.",
    slow: "Make one note today. Put your three context lines in it and your two best prompts. That's a memory system. You can improve it later; having one at all is the win."
  },
  7: {
    plain: "Chat is for thinking. An agent that can see your files is for doing. Using the wrong one is why AI sometimes feels useless.",
    slow: "Ask yourself one question before you start: does this need my actual files, or just my thinking? Files → use Code mode or a desktop agent with the folder open. Thinking → chat is fine and faster."
  },
  8: {
    plain: "'Redo my project' is a wish. 'Rewrite the intro in 80 words for a non-expert' is a task. Tasks get finished.",
    slow: "When something feels too big, write down the finished thing and then cut it into pieces that each take under an hour. If you can't tell whether a piece is done, it's still too big."
  },
  9: {
    plain: "An agent only understands your project from what's in the folder. A two-line note at the top saves hours.",
    slow: "Open your project folder and add one file called README with three lines: what this is, who it's for, what not to touch. That's it. Do that before asking for anything else."
  },
  10: {
    plain: "A formula is just a rule written down. Describe the rule in normal words, including what should happen when a cell is empty.",
    slow: "Say it out loud first: 'take this month minus last month, and leave it blank if last month is empty'. If you can say it, the formula is easy. The blank and error cases are where spreadsheets quietly lie, so mention them."
  },
  11: {
    plain: "A dashboard should change a decision. If it wouldn't, it's decoration.",
    slow: "Before any chart, finish this sentence: 'because of this screen, we will decide whether to ___'. If you can't, you don't need a dashboard yet. Then check one number by hand — always one."
  },
  12: {
    plain: "Deep research is a very fast intern with a habit of inventing citations. Ask for a link per claim and open the two that matter.",
    slow: "Two habits cover most of the risk: every fact gets a link you can open, and anything unconfirmed is labelled 'unverified' rather than smoothed over. Then actually click the two links the argument depends on. Not all of them — those two."
  },
  13: {
    plain: "Describe the sections in order, look at what you get, then give feedback about a specific place, not a general feeling.",
    slow: "Write your headline first — the page is the headline. Then list the sections in the order a reader needs them. When you look at the result, say what's wrong and where: 'the second paragraph repeats the first' beats 'make it better' every time."
  },
  14: {
    plain: "Reviewing AI work means checking intent and side effects, not reading every line admiringly.",
    slow: "Three questions do most of the work: does it do what I asked, what else did it touch, and what did it quietly assume? Ask the tool to argue against its own work. It's better at criticising than at confessing."
  },
  15: {
    plain: "An agent works in a loop: plan, act, check. You control it by keeping steps small and approving anything destructive.",
    slow: "Before you start, say three things: what it may touch, what it must ask about, and what it must never do. Then ask for one step, look, and continue. Long unattended runs are where messes happen."
  },
  16: {
    plain: "A 3D scene is a container, a camera, shapes, light and a loop that redraws it many times a second. That's all of it.",
    slow: "Open the lab and change one thing at a time: the shape, then the wireframe, then the particles. Watch the frame counter. You're learning the whole model by poking it, which is faster than reading about it."
  },
  17: {
    plain: "Motion looks expensive when it's slow, eased, and reacts to you. Fast linear spinning looks like a demo from 2009.",
    slow: "Two changes make almost any animation look better: halve the amount of movement, and never move in a straight line — ease in and out. Then respect people who turn animation off, because for some it's genuinely nauseating."
  },
  18: {
    plain: "Build one 3D element that reacts to scrolling, pause it when it's off screen, and make sure the page still works when 3D is off.",
    slow: "One canvas. One property driven by scroll. A pause when it leaves the screen. A static fallback. Do those four and you've built something most portfolios don't have."
  },
  19: {
    plain: "Write down your project's rules once, so every future session starts knowing them instead of guessing.",
    slow: "Five headings: what this is, the commands that matter, the conventions, what never to touch, and how to check a change. Keep it under a page. A rule nobody can test isn't a rule — 'never add a dependency without asking' works; 'write clean code' doesn't."
  },
  20: {
    plain: "Connecting tools gives an agent real power. Give it the least power that still helps, and keep a human in front of anything irreversible.",
    slow: "Start read-only. Ask what it can see, and if you can't answer, don't connect it. Anything that sends, pays, publishes or deletes gets an approval step. Forever."
  },
  21: {
    plain: "Subagents are helpers with their own memory. Use them to read a lot and report back briefly, and don't run too many at once.",
    slow: "The useful pattern: 'read all twenty files, return 300 words and five facts with references'. Your main conversation stays clean. Three parallel streams is about the limit before you stop being able to hold the picture."
  },
  22: {
    plain: "Keep ten real tasks with known-good answers, and run them before and after you change anything. That's how you know it improved.",
    slow: "Ten is enough. Write down what 'good' looks like for each in one checkable line. Run the set, count passes, and keep the misses. If you change a prompt or a rule file and the score drops, you've learned something no amount of vibes would tell you."
  },
  23: {
    plain: "Automate the boring, narrow, repeating jobs. Put a human approval right before the irreversible step, and log every run.",
    slow: "Write the failure map first: what happens on bad input, on a timeout, on a duplicate? Then place the approval at the last responsible moment — before the send, not before the draft. If you can't audit a run afterwards, don't automate it yet."
  },
  24: {
    plain: "Some things never get handed over: judgement, accountability, and telling someone bad news. Know where your line is.",
    slow: "Write three things you'll never delegate. Mine would be: what matters, who I'm accountable to, and how I tell someone something they don't want to hear. Then teach one lesson to one person — the gaps in your understanding show up immediately."
  },
  25: {
    plain: "It's not a search box. It's a fast new colleague who knows nothing about you, so tell it who you are and what done looks like.",
    slow: "Three lines before every request: who I am, who this is for, what finished looks like. That's the whole upgrade. Try it once with a request you've already had a bad answer to and compare."
  },
  26: {
    plain: "Long chats get worse because the model's working memory fills up and it starts answering the conversation instead of your question.",
    slow: "When an answer starts repeating a correction you already made, stop arguing. New chat, five-line handoff. One task per chat is the single cheapest quality fix there is."
  },
  27: {
    plain: "Ten minutes a day on real tasks, with one line written down about what happened, will teach you more than any course you only read.",
    slow: "Pick one task you were going to do by hand today. Use AI on it. Write one line: what I asked, did it work, what I'd change. Do that five days. The log is where the learning happens — without it, you repeat the same mistake happily."
  },
  28: {
    plain: "Email, meeting notes and summaries are the safest, highest-return place to start. Let it draft; you send.",
    slow: "Two jobs to try this week: turn a messy thread into 'what we decided, what's open, who owes what', and turn meeting notes into actions with owners. Check every owner before you send anything. Remove names before you paste."
  },
  29: {
    plain: "Don't ask for a summary of a long document. Ask for its skeleton, its assumptions, and which two pages you must read yourself.",
    slow: "Three asks: what each section does in one line, what the whole thing rests on, and what it doesn't cover. Then read those two pages properly. You'll know the document better than someone who skimmed all of it — and you'll have actually read the part that matters."
  },
  30: {
    plain: "AI can help you understand and practise. It can't do the understanding for you, and anything you can't defend out loud is a risk.",
    slow: "One rule that keeps you safe and actually teaches you: read the source first, by hand. Use AI to quiz you afterwards. Write your own answer. Then ask it to attack your argument. Disclose what you used — one line, no drama."
  },
  31: {
    plain: "Let AI design the research and challenge your conclusion. Get the numbers from sources you can open.",
    slow: "Never accept a market size from a chat. Ask where to look instead. Then bring the numbers back and ask what contradicts them. The strongest section of a business case is the one where you name the competitor who could kill the idea."
  },
  32: {
    plain: "Write the assumptions in words before you build anything. Change one at a time. A rough model with honest ranges beats a precise one with a hidden guess.",
    slow: "Start with sentences, not cells: 'revenue is price times volume; costs are fixed plus per unit'. Give every assumption a range. Then move one assumption and see what breaks — that's the sensitivity analysis markers look for."
  },
  33: {
    plain: "Find the step that costs the most time × frequency × errors. That's the one worth automating — not the most annoying one.",
    slow: "Draw the process as steps, then label each one decide, transform or move. Only the last two are automation candidates. Write the saving in hours per month, because 'it'll be much faster' doesn't survive a tutorial question."
  },
  34: {
    plain: "A presentation is one argument in a sensible order, not a report with fewer words. Every slide headline should be a claim.",
    slow: "Write the sentence you want repeated back to you. Then make each slide prove one part of it. Cut the slide that only exists to show you did the work. Rehearse the three questions you're dreading, out loud."
  },
  35: {
    plain: "Build something tiny you'll use: a calculator, a checklist, a converter. Work out one answer by hand first so you can prove it's right.",
    slow: "The hand-worked example is the whole discipline. Without it you can only judge whether it looks nice. With it you can say 'this is wrong, here's the right answer'. That sentence is what makes you the person in charge."
  },
  36: {
    plain: "Debug calmly: read the actual error, shrink the problem, change one thing, check again.",
    slow: "Paraphrasing the error is how people lose ten minutes. Copy the exact text. Then delete everything except the bit that fails. Then change one thing. If you're still stuck, ask for three ranked hypotheses and the cheapest test for each."
  },
  37: {
    plain: "Never paste other people's personal data. Use placeholders. And say when AI helped — it's normal, not a confession.",
    slow: "Three lines to write down: what never leaves my machine, what I'll replace with a placeholder, what I'll disclose. Then do it once for real on an actual document, so it's a habit rather than an intention."
  },
  38: {
    plain: "End with a plan: one daily habit, one thing you build, one person you teach. With dates.",
    slow: "Three commitments, no more. Under fifteen minutes a day, one artefact by day thirty, one lesson taught to one person. Write the first step and the exact time it happens. 'Monday, 9:15, ten minutes' beats 'regularly'."
  }
};

/* ---------------- watchlist ---------------- */
/* Notes are mine. IDs are real; open the card to watch, and use the
   transcript button on YouTube itself if you want the exact words. */
export const VIDEOS = [
  {
    id: "Vr1NzH8bT44", title: "LLMs for Agent Builders: Context Engineering",
    channel: "Stanford CS329Z · Stanford Online", who: "research-level", mins: 78,
    why: "Lecture 2 of Stanford's Engineering AI Agents course, taught by Michael Ryan. The clearest explanation of why what you put in the window matters more than the wording of your prompt. Watch it if lesson 3 felt abstract.",
    notes: [
      "It covers decoding, context length and the pretraining-to-post-training pipeline before it reaches context engineering. That order is the point: context only makes sense once you know what the model does with it.",
      "Listen for the distinction between prompting and context engineering — one is how you word the ask, the other is everything the model can see when it answers. That's the shift this course is built on.",
      "The takeaway for a student: more context is not better. The smallest context that removes ambiguity is better — which is also why long chats degrade."
    ],
    level: 3
  },
  {
    id: "vlfCjWuv4es", title: "Rethinking Claude Code Best Practices",
    channel: "AI Engineer · Lydia Hallie (Anthropic)", who: "practitioner", mins: 18,
    why: "A 17-minute audit of advice Anthropic itself published earlier in the year, and why a setup built around an older model can now get in the way. Best after lessons 14–15.",
    notes: [
      "Her framing: every job you used to do by hand in a session — steering, approving, checking — has to move somewhere, into the model, the harness, or the environment. Nothing simply disappears.",
      "The test worth stealing: write a hard rule for anything you can't take back (a deploy, a delete, a payment), and leave the rest to the model.",
      "Verification moves from reading every change to checks that return pass or fail — tests, hooks, CI. That's lesson 5 at a professional scale."
    ],
    level: 4
  },
  {
    id: "djDt8J2_YVs", title: "CHM Live | Anthropic's Boris Cherny, Creator of Claude Code",
    channel: "Computer History Museum", who: "builder story", mins: 72,
    why: "A 72-minute conversation with the person who built Claude Code, recorded at the Computer History Museum in September 2026. Good for understanding why the interface looks the way it does, and what its creators assumed about users.",
    notes: [
      "The question running through it: what happens when coding stops being the hard part? His answer leans on curiosity and judgement rather than syntax.",
      "He describes the tool as a loop of small, reviewable changes, not one giant instruction — the same loop lesson 15 asks you to run.",
      "Listen for how much of the design is about permission and trust rather than raw capability. The boundary you set is the product feature."
    ],
    level: 4
  },
  {
    id: "BwXremQ-i6I", title: "Context Engineering for AI Agents: 4 Failure Modes to Avoid",
    channel: "IBM Technology · Martin Keen", who: "plain explainer", mins: 10,
    why: "Ten minutes on why more context often makes an agent worse — context rot, and four specific ways context goes wrong. Watch after lesson 26.",
    notes: [
      "The counter-intuitive claim up front: a bigger context window does not fix a badly assembled one.",
      "Learn the four failure modes by name. They give you vocabulary for symptoms you'll recognise in your own long chats.",
      "This is the practical version of lesson 1's point that the window degrades as it fills — not at the limit, well before it."
    ],
    level: 2
  },
  {
    id: "Qx0fCqpkBus", title: "What Is Context Engineering? Why It Matters for AI Agents",
    channel: "IBM Technology · Anna Gutowska", who: "plain explainer", mins: 10,
    why: "The shortest good answer to 'what does context actually mean'. Watch this one first if the vocabulary is new.",
    notes: [
      "A definition you can repeat in an interview: deciding what the model should see, and what it shouldn't, at each step.",
      "She separates the one-off prompt from the standing material — instructions, tools, retrieved facts, history, recent messages.",
      "Lesson 3 is basically this, applied to your own coursework."
    ],
    level: 2
  },
  {
    id: "BBPQYtR7oUk", title: "Context engineering explained: What every AI developer should know",
    channel: "Google Cloud Tech · Smitha Kolan", who: "engineering talk", mins: 10,
    why: "Starts from the mistake almost everyone makes — writing a longer prompt to fix a bad answer — then builds the alternative on a small agent. Best after lesson 19.",
    notes: [
      "Her definition: context engineering is deciding exactly what the model should see and what it shouldn't, at each step.",
      "The middle section road-tests a tiny agent and shows where its context falls apart. Watch for the checklist at the end.",
      "Pairs with lesson 19's architecture question: what belongs in the window, what belongs in a tool, and what belongs nowhere."
    ],
    level: 3
  },
  {
    id: "Yq0QkCxoTHM", title: "Google's AI Course for Beginners (in 10 minutes)!",
    channel: "Jeff Su", who: "plain explainer", mins: 9,
    why: "A nine-minute compression of Google's four-hour beginner course. Useful if the words model, machine learning and generative AI are still blurring together.",
    notes: [
      "It walks the ladder: AI as the broad field, machine learning inside it, deep learning inside that, generative AI and large language models at the end.",
      "The supermarket examples for supervised and unsupervised learning are the clearest thirty seconds in the video.",
      "This is background vocabulary, not practice. Do lesson 1's verification exercise afterwards, not instead."
    ],
    level: 1
  },
  {
    id: "YD8uRumP8cM", title: "How to Build a 1-Person Business with AI Agents",
    channel: "Dan Martell", who: "business operator", mins: 31,
    why: "Business framing rather than engineering framing: which agents are worth building, and what to hand over first. Useful if you're studying management and want to see this applied to operations.",
    notes: [
      "His test for an agent is whether it actually does the job or needs babysitting — a plain-language version of lesson 23's human-gate question.",
      "The inbox example is the most transferable: have the agent learn rules from your past replies, then draft rather than send, with placeholders for anything it doesn't know.",
      "Skip the growth-hacking framing if it isn't your world; keep the workflow structure — a defined input, a defined output, a person at the review step."
    ],
    level: 3
  }
];

/* ---------------- extra prompts ---------------- */
export const EXTRA_PROMPTS = [
  { cat: "Study", title: "Quiz me, don't tell me", body: "Quiz me on [topic] at [my level]. Ten questions, easiest first, one at a time — wait for my answer before the next. Don't reveal the answer until I've tried. At the end, list the concepts I got wrong with one short explanation and one practice question each." },
  { cat: "Study", title: "Explain the gap, not the topic", body: "I got this wrong: [my answer] when the right answer was [right answer]. Don't re-teach the whole topic. Tell me the specific misconception that caused my error, one example that would have caught it, and one question to check I've fixed it." },
  { cat: "Study", title: "Disclosure line", body: "Write one honest sentence for my assignment appendix describing how I used AI: [what I used it for]. Keep it factual, unapologetic, and specific enough that a marker can see I understand the boundary. No over-explaining, no defensiveness." },
  { cat: "Business", title: "The finance director's questions", body: "Here's my business case: [paste]. You're a sceptical finance director with ten minutes. Ask me the five questions that decide whether you fund this — hardest first. After I answer, tell me which answer was weakest and what evidence would fix it." },
  { cat: "Business", title: "Assumption audit", body: "Here's my model or plan in words: [describe]. List every assumption, including the ones I didn't notice. For each: a defensible range, where I could find evidence, and what happens to the conclusion if it's at the pessimistic end. Then name the one assumption that decides everything." },
  { cat: "Business", title: "Process map from a messy description", body: "I'm going to describe a process badly: [describe]. Turn it into numbered steps with who does each, how long it takes, how often, and the common failure. Classify each step as decide / transform / move. Then tell me the single step most worth automating and the one that must stay human." },
  { cat: "Business", title: "Presentation, one argument", body: "My presentation must land this sentence: \"[sentence]\". Audience: [who, what they believe, how tired they'll be]. I have [N] minutes. Give me a slide-by-slide outline where every headline is a claim, the one slide to cut, the opening 15 seconds word for word, and the three questions I'm least ready for." },
  { cat: "Study", title: "Reading list, honestly", body: "I have [N] hours this week and need to understand [topic]. Give me a reading order of three sources: one beginner-friendly, one primary, one critical. For each: why it's worth the time, what it won't tell me, and the one question I should be able to answer afterwards. No more than three." }
];
