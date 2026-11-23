/* ============================================================
   CONTENT — the curriculum, prompt library and reference data
   Sourced from primary docs (Anthropic, OpenAI, MCP, OWASP,
   Microsoft) and practitioner threads (r/ClaudeCode, HN), Nov 2026.
   ============================================================ */

export const TRACKS = [
  {
    id: "foundations", level: 1, name: "Foundations",
    tagline: "Get an answer you can trust",
    desc: "What these systems actually are, how to brief one properly, and the verification habit that separates people who use AI from people who get burned by it.",
    outcome: "You stop writing prompts and start writing briefs. First answers become usable."
  },
  {
    id: "operator", level: 2, name: "Operator",
    tagline: "Run AI like a competent colleague",
    desc: "Choose the right surface for the job, break work into tasks with acceptance criteria, and point the thing at your real files, spreadsheets and research questions.",
    outcome: "Mechanical work leaves your week. You review output instead of producing it."
  },
  {
    id: "apply", level: 3, name: "Apply it",
    tagline: "Use it on real coursework and real business work",
    desc: "The same skills pointed at what you actually get graded on and paid for: understanding material without cheating, market research you can cite, numbers that survive a tutorial question, process maps, and presentations that land.",
    outcome: "You have a repeatable workflow for assignments, group projects and internship work — and you can defend every line of it."
  },
  {
    id: "builder", level: 4, name: "Builder",
    tagline: "Make things that exist",
    desc: "Ship a page, review work you didn't write, run a real agent loop, and build interactive 3D web pages from scratch in the lab.",
    outcome: "You can produce a working artefact from a description, and judge it."
  },
  {
    id: "mastermind", level: 5, name: "Mastermind",
    tagline: "Design the system, not the prompt",
    desc: "Context architecture, least-privilege tool access, subagents, evaluation, orchestration with human gates, and the judgement layer that never delegates.",
    outcome: "You improve the machine that does the work — and can teach or sell that skill."
  }
];

export const LESSONS = [
  /* ---------------- LEVEL 1 ---------------- */
  {
    n: 1, track: "foundations", title: "What these models actually are", mins: 7,
    promise: "Explain to anyone why an AI invents a citation — and why that doesn't make it useless.",
    why: "A model doesn't look things up. It predicts what a good answer would look like, from patterns in training data. That makes it extraordinary at shape — structure, tone, code, phrasing, the form of an argument — and unreliable at specifics: numbers, names, dates, links, quotes. It also has no memory between conversations, and a finite working memory (the context window) that degrades as it fills. Nearly every frustrating experience traces back to one of those three facts.",
    steps: [
      "Ask for something specific you can check: a statistic, a citation, a date. Then verify it. Do this once and you'll never blindly trust again.",
      "Send the same prompt twice in two fresh chats and compare. The variance is the point — it's sampling, not a database.",
      "Ask it to separate what it knows from your input, what it's inferring, and what it would be guessing at."
    ],
    prompt: "Before you answer, split your knowledge into three buckets:\n1. What I told you\n2. What you can infer from it\n3. What you would be guessing at\nThen answer, and mark anything from bucket 3 inline as [guess]. I'd rather have an honest gap than a confident invention.",
    check: "Name two categories of question where you should never accept an unverified answer.",
    note: "Practitioners consistently report quality drops as a conversation fills — not at the limit, well before it. One task, one chat is the cheapest fix that exists.", noteLabel: "field note"
  },
  {
    n: 2, track: "foundations", title: "The six-line brief", mins: 8,
    promise: "Turn a vague wish into a request that comes back right the first time.",
    why: "The gap between a weak and a strong result is almost never the model. It's whether you supplied a role, a goal, the inputs, the constraints, the shape of the output, and a definition of done. Six lines. Most people write one — 'help me with my report' — and then blame the tool.",
    steps: [
      "Take a real task from this week you'd normally do by hand.",
      "Write it in six lines: role, goal, inputs, constraints, output format, done looks like.",
      "Send it. Note how many correction rounds you skip compared to your usual request.",
      "Save the skeleton. You'll reuse it hundreds of times."
    ],
    prompt: "Role: careful editor who has read too many bad updates.\nGoal: turn my notes into a 200-word update for my manager.\nInputs: [paste notes]\nConstraints: no jargon, no bullet points, lead with the decision, no preamble.\nOutput: plain prose, 190–210 words.\nDone means: she can reply 'approved' without asking a follow-up question.",
    check: "Which of the six lines do you habitually leave out, and what does that cost you?",
    note: "The definition-of-done line is the highest-leverage one. It converts 'looks fine' into a testable condition.", noteLabel: "why it works"
  },
  {
    n: 3, track: "foundations", title: "Context beats cleverness", mins: 9,
    promise: "Get the output you actually wanted using examples instead of adjectives.",
    why: "Telling a model to be 'professional but warm' is nearly meaningless. Showing it three sentences you consider professional but warm is unambiguous. This is context engineering: the deliberate choice of what the model can see when it answers — examples, constraints, audience, prior decisions, banned words. Two people with the same model get wildly different results because one of them brought better raw material.",
    steps: [
      "Build a reusable 'brief block': who you are, who it's for, tone, no-gos, one good example.",
      "Paste it before a task and watch how many correction rounds disappear.",
      "Add one anti-example: 'not like this'. Negative examples are underused and very effective.",
      "For file work, keep a short project note in the folder that describes what the project is — agents read it before anything else."
    ],
    prompt: "Context to hold for this whole conversation:\n- Me: [role, skill level]\n- Audience: [who reads this]\n- Tone: [three words + one example sentence I'd actually write]\n- Never: [banned words/claims]\n- Good example: [paste 3 lines]\n- Not this: [paste 2 lines of what I hate]\nAcknowledge in one line, then wait for the task.",
    check: "Could a stranger reproduce your tone from your instructions alone, without seeing your examples?",
    note: "Context windows are getting larger, which tempts people to dump everything in. More context is not better context — relevance is. The best brief is the smallest one that removes ambiguity.", noteLabel: "reality check"
  },
  {
    n: 4, track: "foundations", title: "Plan first, then act", mins: 8,
    promise: "Catch a wrong assumption while it costs one sentence instead of an afternoon.",
    why: "Asking for a plan before any work is the cheapest quality improvement available, on anything with more than two steps. The plan is where misunderstandings become visible, and it's the only moment where correcting the model is free. It also gives you something to hold the agent to afterwards.",
    steps: [
      "For your next non-trivial request, add: 'Plan first. No changes yet.'",
      "Read the plan out loud. Does it show it understood the goal, not just repeated your words?",
      "Correct one line, then say proceed.",
      "Compare to the same request sent without a plan. Keep the difference in your head."
    ],
    prompt: "Plan this before doing anything: [task].\nGive me: the steps, the assumptions you're making, the riskiest step, and the two ways this could go wrong. No edits until I approve the plan.",
    check: "What's the difference between a plan and a summary of your prompt?",
    note: "Careful: a model reviewing its own plan in the same context tends to approve it. Have a fresh session critique the plan if the stakes justify it.", noteLabel: "failure mode"
  },
  {
    n: 5, track: "foundations", title: "The verification habit", mins: 10,
    promise: "Trust artefacts, not summaries — and catch the three failures that actually happen.",
    why: "The failure isn't usually a broken answer. It's a plausible answer with one wrong detail that gets forwarded. Agents routinely report success they didn't verify, skip a requirement because the visible test passed, or edit something adjacent to what you asked. Verification is a repeatable two-minute ritual, not a personality trait.",
    steps: [
      "After any output you'll rely on: check the one claim a reader would test first.",
      "Ask 'what did you change and what could this break?' before you look at it.",
      "For file work, read the actual diff — not the agent's description of the diff.",
      "Write down which parts you verified and which you didn't. Say it out loud in the email if it matters."
    ],
    prompt: "Before I review: list exactly what you changed, what you assumed, and the three things a careful reviewer should test. Do not say 'everything works'. Name what you did not check.",
    check: "What would you have to see with your own eyes before forwarding an AI's summary to your boss?",
    note: "'Tests pass' is not 'done'. The most common practitioner complaint is an agent that satisfies the visible check while quietly skipping half the requirements. Acceptance criteria written by you, checked by something other than the agent that did the work.", noteLabel: "field note"
  },
  {
    n: 6, track: "foundations", title: "Build your memory system", mins: 9,
    promise: "Stop retyping the same instructions forever.",
    why: "Models forget between sessions; you shouldn't have to repeat yourself. A personal library of three things changes your week: a brief block you paste, a set of prompts you've actually tested, and a rule file you drop into each project. This is also how teams get consistent output — the knowledge lives in a file, not in one person's head.",
    steps: [
      "Create one note called 'brief block' and one called 'prompt library'.",
      "Move your five best prompts into the library, with a note on when each works.",
      "Start a project note per project: what it is, what good looks like, what not to touch.",
      "Once a month, delete the prompts you never use. A library that grows forever stops being read."
    ],
    prompt: "Here are five prompts I reuse: [paste].\nTurn them into a compact library: a title, when to use it, the prompt itself, and the failure mode it avoids. Group them by intent. Cut anything that duplicates another.",
    check: "If you lost this chat, what would you have to rewrite from scratch?",
    note: "Rule files rot. Practitioners report a prompt file quietly going stale in about two weeks. Keep a dated changelog line at the top and prune — a 500-line rules file gets ignored like terms of service.", noteLabel: "field note"
  },

  /* ---------------- LEVEL 2 ---------------- */
  {
    n: 7, track: "operator", title: "Pick the right surface", mins: 7,
    promise: "Stop using a chat window for a job that needed a file system.",
    why: "There are three different things and people conflate them constantly. A chat is for thinking, drafting and research. A coding agent (terminal, editor or desktop) acts on real files: it reads a folder, edits, runs things, and shows you a diff. A cloud agent takes a task, works in the background, and hands back a pull request or a document. Using chat for file work is why AI feels useless on some days.",
    steps: [
      "List the next five things you want AI to do. Mark each: thinking, or touching my files.",
      "For the file ones, put the actual files in one folder first. An agent can't help with what it can't see.",
      "Ask for one small change before ten. Watch how it reads before you trust it to write.",
      "Notice what you'd want to keep out of the agent's reach — that becomes your permission list."
    ],
    prompt: "I'm about to give you my project folder. Before touching anything: read the files and tell me what this project is for, how the parts relate, and the three things a newcomer would get wrong. Then wait.",
    check: "Which of your recurring tasks have you been doing in the wrong surface for months?",
    note: "Cloud agents that return a pull request are the best fit for well-specified, reviewable chores. They're a poor fit for 'figure out what I want'.", noteLabel: "how to choose"
  },
  {
    n: 8, track: "operator", title: "Tasks, not jobs", mins: 8,
    promise: "Break a scary project into six things that each finish.",
    why: "'Redo my website' is a job: unbounded, uncheckable, and it will burn a day. 'Rewrite the pricing section for a non-technical buyer, keep the structure, max 80 words, keep the three plan names' is a task. Tasks get finished, because each one has an acceptance criterion you can check without re-reading everything.",
    steps: [
      "Take the thing you've been avoiding because it's fuzzy.",
      "Split it into 4–6 tasks, each producing one checkable artefact.",
      "Write the acceptance criterion before you hand it over, not after.",
      "Run the smallest one first and count how much context it actually needed."
    ],
    prompt: "Here's a project I keep avoiding: [describe].\nSplit it into 4–6 tasks where each produces exactly one checkable output.\nFor each: the output, the inputs it needs, its acceptance criterion, and the cheapest way to verify it.\nThen tell me which one to do first and why. Don't start any of them.",
    check: "Can you tell whether a task is done without re-reading the whole output?",
    note: "Sequencing beats splitting. A task that depends on an unfinished task produces rework, so order them by what unblocks what.", noteLabel: "sequencing"
  },
  {
    n: 9, track: "operator", title: "Point it at your real files", mins: 9,
    promise: "Make a folder legible to an agent — the single highest-value setup step.",
    why: "An agent's understanding of your project comes from what's in the folder and how it's arranged. This is the part almost nobody does: a short README or project note at the top level, sensible file names, and a place for decisions. Five minutes of tidying saves hours of the agent rediscovering your intent in every session.",
    steps: [
      "Add a project note to the folder: what this is, who it's for, what's in each folder, what never to touch.",
      "Rename the three worst file names so their purpose is obvious.",
      "Add a decisions file: one line per decision, with a date. Append, never rewrite.",
      "Ask the agent to read the folder and summarise it back. Fix whatever it got wrong in the note, not the chat."
    ],
    prompt: "Read the project folder and write me a one-page README: purpose, structure, conventions, what not to touch, and the commands that matter. Then list every place the folder is ambiguous, because those are the places you'll guess wrong later.",
    check: "Could a competent stranger read your folder and know what 'good' looks like here?",
    note: "Append-only notes beat clever memory systems. A memory you can diff against last week is one you can trust; one you can't diff, you can't.", noteLabel: "field note"
  },
  {
    n: 10, track: "operator", title: "Spreadsheets without fear", mins: 9,
    promise: "Get a formula you understand, not a formula you paste and pray about.",
    why: "Most spreadsheet anxiety is anxiety about formulas, and a formula is just a described rule. The trick is to describe the rule in business language, including the awkward cases — blanks, duplicates, negative numbers, error values — because those edge cases are where spreadsheets silently lie.",
    steps: [
      "Describe the outcome, not the syntax: 'month-on-month change, blank if last month is empty'.",
      "Ask for the formula plus a one-line explanation of each part.",
      "Test one deliberately broken row. Does it fail loudly or silently?",
      "Only then fill down the whole sheet."
    ],
    prompt: "Column A is [what], B is [what], C should be [describe the rule in plain English, including blanks, negatives and errors].\nGive me: the formula, a one-line explanation per part, one input that would break it, and how to make bad input visible instead of silent.",
    check: "What happens in your sheet today when a cell is empty that shouldn't be?",
    note: "Ask for the test cases before the formula. If it can't name a breaking input, it doesn't understand the rule it just wrote.", noteLabel: "check"
  },
  {
    n: 11, track: "operator", title: "Dashboards that tell the truth", mins: 9,
    promise: "Build one screen that changes a decision — and refuses to decorate.",
    why: "Anyone can generate a chart; generating a true one is the skill. Most bad dashboards are bad because nobody said what decision they support, so everything got included. The second failure is quieter: invented or smoothed numbers, axes that flatter, and a 'total' that double-counts.",
    steps: [
      "Before any chart, write the decision the dashboard supports.",
      "Ask for the three metrics that change that decision, and for what was deliberately left out.",
      "Verify every number against the source file. Spot-check one total by hand.",
      "Add a short 'what this doesn't show' line. It's the most credible thing on the page."
    ],
    prompt: "Build a one-screen dashboard from the attached data.\nDecision it supports: [the decision].\nShow only the three metrics that change that decision.\nEvery number must come from the file — no invented figures, no interpolation, no smoothing.\nAdd a 2-line 'what this does not show' note and list any data that looked wrong.",
    check: "Can you trace the headline number to a cell in the source?",
    note: "If the chart would look identical with the numbers scrambled, it isn't telling you anything. Charts are for change, comparison and distribution — not decoration.", noteLabel: "test"
  },
  {
    n: 12, track: "operator", title: "Research you can cite", mins: 11,
    promise: "Use deep-research modes without forwarding a fabricated claim.",
    why: "Deep research is genuinely useful and genuinely dangerous: it produces confident, well-structured summaries where one load-bearing detail is wrong. The fix is procedural. Demand a source per claim, demand disagreement be shown rather than flattened, and open the two links the argument depends on. You are the editor; the model is a very fast intern.",
    steps: [
      "Ask a question that needs synthesis, not a single fact.",
      "Require a source per factual claim and an 'unverified' label where there isn't one.",
      "Open the two most load-bearing links yourself. Always these two.",
      "Ask what evidence would overturn the conclusion — that's where the risk hides."
    ],
    prompt: "Research: [question].\nRules: every factual claim gets a link I can open. Say 'unverified' rather than guessing. Where sources disagree, show both and say which is better evidenced and why.\nEnd with: the three findings that matter, the strongest counter-argument, and what evidence would overturn this. Flag anything you couldn't confirm.",
    check: "Which single claim, if wrong, would make your conclusion collapse — and did you open its source?",
    note: "Triangulate: a vendor blog, a primary document and an independent critic are three different kinds of evidence. Two vendor blogs agreeing is one source, not two.", noteLabel: "method"
  },

  /* ---------------- LEVEL 3 ---------------- */
  {
    n: 13, track: "builder", title: "From description to shipped page", mins: 12,
    promise: "Turn a paragraph of intent into something running you can show someone.",
    why: "The loop is: describe the sections in order, build, look at it, give feedback in specifics. Most people fail at the feedback step — 'make it nicer' gives the agent nothing, while 'the hero is too tall on a laptop and the second paragraph is doing nothing' gives it a target. Specific feedback in two or three rounds beats one enormous perfect prompt.",
    steps: [
      "Write the section list in order, and the exact headline you want. The headline is the page.",
      "Ask for the build, then actually look at it before responding.",
      "Give feedback as observation + location + desired change.",
      "Stop at good enough. Ask for one interaction, one mobile fix, then ship."
    ],
    prompt: "Build a single-page site for [what it is].\nSections in this order: [list]. Headline, exactly: \"[words]\". Audience: [who].\nStyle: [vibe, one accent colour, what to avoid].\nNo extra pages, no sign-up, no analytics, no placeholder lorem.\nThen run it and tell me how to view it.",
    check: "Could you describe the page to someone on the phone, section by section, before asking for it?",
    note: "Constraints are kindness. 'No extra sections' produces better work than 'be creative', because the agent stops guessing at scope and starts solving the actual problem.", noteLabel: "why"
  },
  {
    n: 14, track: "builder", title: "Review work you didn't write", mins: 10,
    promise: "Judge a change in ninety seconds using blast radius, not line count.",
    why: "Reviewing generated work is a different skill from writing it. You're not checking craft line by line; you're checking intent, blast radius and the assumptions nobody stated. Read the diff, not the summary. Ask what else touches this. Look for the silent failure: an error caught and swallowed, a condition that now never fires, a value guessed rather than read.",
    steps: [
      "Read what changed, and what else in the project depends on it.",
      "Look for the three classics: swallowed errors, invented defaults, and requirements quietly dropped.",
      "Ask the agent to argue against its own change — in a fresh context if it matters.",
      "Approve in small batches. A 40-file review is a rubber stamp wearing a suit."
    ],
    prompt: "Review your own change as an adversary, not an author.\n1. What requirement could this silently fail to meet?\n2. What did you assume that I never told you?\n3. What else in the project does this touch?\n4. Where would this break with real-world input?\nBe specific. Don't defend the work.",
    check: "What's the difference between 'it works' and 'it does what I asked'?",
    note: "A fresh-context critic beats a self-review. Same-session review is self-confirmation bias with extra steps — the model has already argued for its answer.", noteLabel: "field note"
  },
  {
    n: 15, track: "builder", title: "Run a real agent loop", mins: 12,
    promise: "Drive a multi-step task without losing control of it.",
    why: "Agent work is a loop: it plans, acts, checks, repeats. Your job is to bound the loop — one change at a time, approval before anything destructive, a check after every step. The people who get great results aren't writing magic prompts; they're faster at the check step and stricter about scope. Long unattended runs are where messes come from.",
    steps: [
      "Set the boundary first: what it may touch, what it must ask about, what it must never do.",
      "Ask for one change, review, then the next. Small commits if you're in a code project.",
      "After each step, ask what changed and what could break.",
      "When it's wrong, quote the exact line instead of describing it loosely."
    ],
    prompt: "Before you start: confirm the boundary.\nYou may: [read files / edit only index.html].\nYou must ask before: [installing anything / deleting anything / changing config].\nYou must never: [touch secrets / rewrite unrelated files].\nThen do step 1 only, and stop. Tell me what you did and what a reviewer should check.",
    check: "What's your undo button if step three goes wrong?",
    note: "Practitioners running agents unattended for months land on the same three rules: separate the planner from the builder, make every phase a commit you can revert, and assume it will crash mid-task.", noteLabel: "field note"
  },
  {
    n: 16, track: "builder", title: "3D on the web: the scene graph", mins: 14,
    promise: "Understand every 3D page you've ever seen: five objects and one loop.",
    why: "A 3D scene is not magic. There's a scene (a container), a camera (where you look from), meshes (geometry plus material), lights, and a render loop that redraws ~60 times a second. Objects nest in a tree — move the parent, children follow — which is why it's called a scene graph. Learn those five things and every WebGL page on the internet becomes readable.",
    steps: [
      "Open the lab below and switch the geometry a few times. Same camera, same light, different shape.",
      "Turn wireframe on. Same shape, but the GPU now draws lines instead of filled triangles — watch the counter switch from 80 triangles to 120 line segments.",
      "Watch the frame counter while you drag particle count up. That's your performance budget, live.",
      "Change the accent colour. Notice that materials are cheap to change and geometry is not."
    ],
    prompt: "Explain a three.js scene as five objects and one loop, using a single concrete example: a rotating wireframe icosahedron at the centre of the screen with a starfield behind it. Then show the minimum code — under 40 lines — that does exactly that, and label which line is the camera, the mesh, and the loop.",
    check: "Which object decides what you can see, and which decides what gets drawn?",
    note: "Draw calls are the usual bottleneck, not polygon count. A hundred tiny objects cost more than one big detailed one.", noteLabel: "performance"
  },
  {
    n: 17, track: "builder", title: "3D motion that doesn't feel cheap", mins: 13,
    promise: "Make movement feel expensive using easing, parallax and restraint.",
    why: "The difference between a demo and a product is motion quality. Linear rotation looks mechanical; eased, mouse-linked motion looks alive. The rules are simple: move less than you want to, ease everything, tie motion to something the user does, and give people a way to turn it off. Accessibility isn't a checkbox — some people get genuinely ill from parallax.",
    steps: [
      "In the lab, toggle 'ease motion'. Compare the feel with linear.",
      "Enable mouse-follow and move slowly. Fast motion should never be the only option.",
      "Cut the amount of movement by half. It will feel more expensive, not less.",
      "Respect prefers-reduced-motion and provide a static fallback that still looks finished."
    ],
    prompt: "Animate this scene with restraint:\n- Slow continuous rotation, eased, never linear.\n- Subtle mouse parallax, at most 0.3 units of camera movement.\n- Respect prefers-reduced-motion: render a static composed frame instead.\n- Cap pixel ratio at 2 and keep the loop under 4ms of CPU.\nExplain each choice in one line.",
    check: "If you halved every motion value, would the page get worse or better?",
    note: "60fps means ~16ms per frame for everything — your loop, layout and paint. An expensive blur or a 4K texture can eat it before the 3D does.", noteLabel: "budget"
  },
  {
    n: 18, track: "builder", title: "3D capstone: a scroll-driven page", mins: 15,
    promise: "Build one interactive 3D section start to finish, with a fallback.",
    why: "Now combine it. A hero that reacts to scroll, three sections that reveal, a canvas that pauses when off-screen, and a static fallback for anyone whose device can't or won't run it. This is the exercise that turns 'I've seen cool sites' into 'I can make one'. Keep it to one canvas — a page with four WebGL contexts will melt a laptop.",
    steps: [
      "Build one canvas, full width, fixed behind your content.",
      "Drive one property from scroll position: rotation, or camera height. One, not five.",
      "Pause the render loop with IntersectionObserver when the canvas leaves the viewport.",
      "Break it on purpose: disable WebGL and confirm the page still reads well."
    ],
    prompt: "Build a single-page site with one 3D hero.\n- One canvas, fixed behind the hero, rotating slowly.\n- Rotation and camera height driven by scroll position, clamped.\n- Pause rendering when the canvas is off-screen (IntersectionObserver).\n- If WebGL is unavailable or reduced-motion is set, show a static CSS fallback that still looks intentional.\n- Report the frame time and the draw call count at the end.",
    check: "Does the page still make sense with the 3D switched off?",
    note: "One canvas per page. Multiple WebGL contexts means multiple GPU budgets, and browsers cap how many you get before they start dropping the oldest.", noteLabel: "limit"
  },

  /* ---------------- LEVEL 4 ---------------- */
  {
    n: 19, track: "mastermind", title: "Context architecture", mins: 12,
    promise: "Make every future session start smart instead of from zero.",
    why: "At this level you stop optimising prompts and start designing what the model sees before it's asked anything. That means a rule file with stable conventions, a dated decisions log, a place for failed attempts, and a deliberate pruning habit. Rules must be specific enough to follow — 'write clean code' is unenforceable; 'never add a dependency without asking' is a rule.",
    steps: [
      "Write a rule file with five sections: purpose, commands, conventions, never-touch, and how to verify.",
      "Add a decisions log. One line each, dated, append-only.",
      "Add a 'failed attempts' section with the reason each died. Fresh agents otherwise retry them forever.",
      "Set a monthly prune. Any rule nobody has broken in a month gets deleted."
    ],
    prompt: "Write my project rule file.\nSections: purpose, key commands, conventions, never-touch, how to verify a change.\nRules must be checkable — rewrite anything vague into something a strict reviewer could test.\nKeep it under 60 lines. Then list what you deliberately left out and why.",
    check: "Could a new agent be productive in your project without you saying a word?",
    note: "A rules file that grows forever stops working. When it hits a few hundred lines, agents start ignoring the middle — same as people and terms of service.", noteLabel: "field note"
  },
  {
    n: 20, track: "mastermind", title: "Tools and MCP, least privilege", mins: 13,
    promise: "Give an agent real capability without giving it the keys to everything.",
    why: "MCP is an open standard for connecting assistants to your systems — a USB-C port for AI. It's also a new attack surface. Security guidance is unanimous: minimum permissions per server, scoped and short-lived credentials, read-only until proven, sandbox anything that runs locally, and treat the whole tool definition as untrusted input. An agent with write access and no approval step is an incident waiting for a typo.",
    steps: [
      "Connect one read-only tool first: search, notes, or a calendar.",
      "Write down what it can see. If you can't, don't connect it.",
      "Add a write action only after a week of watching it read correctly.",
      "Put a human approval in front of anything that sends, pays, publishes or deletes."
    ],
    prompt: "I want to connect [tool] over MCP.\nGive me: the smallest read scope that makes you useful, whether any write scope is genuinely needed, what an attacker could do with it, and the two actions I should keep manual forever.\nThen write a one-paragraph permission policy I can save.",
    check: "Which connected tool could cause irreversible damage if it misread one instruction?",
    note: "Prompt injection doesn't arrive as a chat message. It arrives in a document, a ticket, a web page or a tool description the agent reads — and anything the agent can read is a potential instruction.", noteLabel: "safety"
  },
  {
    n: 21, track: "mastermind", title: "Subagents and parallel work", mins: 12,
    promise: "Get more done concurrently without your own judgement collapsing.",
    why: "Subagents exist for two reasons: parallelisation and context hygiene. A subagent gets its own context window, chews through a pile of material, and returns a summary — so the main conversation stays clean. The practitioner lesson is blunter: separate the planner from the builder, keep parallel streams to about three, and isolate each one so they can't overwrite each other.",
    steps: [
      "Take a task that needs reading twenty documents. Delegate the reading, demand a summary under 500 words.",
      "Keep the plan and the build in separate contexts when the stakes are real.",
      "Run at most three parallel streams. Beyond that, decision quality drops noticeably.",
      "Give each stream its own workspace, or you'll spend the day resolving conflicts."
    ],
    prompt: "Delegate this and stay out of it: read all [N] files and return only:\n1. A 300-word synthesis\n2. Five facts with file references\n3. Three contradictions between sources\nDo not return raw quotes or full documents. If something is ambiguous, say so in one line.",
    check: "What's the most streams you've run at once, and did your last decision get better or worse?",
    note: "One builder's ceiling, measured over months: about three parallel workstreams, roughly 50k lines a day. Past that, quality slips in ways you notice a week later.", noteLabel: "field note"
  },
  {
    n: 22, track: "mastermind", title: "Evals: prove it got better", mins: 12,
    promise: "Replace 'this feels better' with a number you can defend.",
    why: "If you change your setup — a new model, a new rule file, a new prompt — how do you know it improved? You keep a small test set: ten real tasks with known-good outcomes, and you run them before and after. Ten is enough to catch regressions. It's the difference between a hobby and a system, and it's what makes the skill sellable.",
    steps: [
      "Collect ten real tasks you've already done well. Save the inputs.",
      "Write what 'good' looks like for each, in one or two checkable lines.",
      "Run the set before a change and after. Count pass, fail, and 'plausible but wrong'.",
      "Log every miss. Three repeats of the same miss becomes a rule or a check."
    ],
    prompt: "Help me build a tiny eval set.\nHere are ten tasks I do often: [list].\nFor each, write: the input, what a good result contains, and a pass/fail test a non-expert could apply in 30 seconds.\nThen tell me which three are too subjective to grade reliably, and how to tighten them.",
    check: "What's your score today, so you'd notice if it dropped?",
    note: "Models judge comparisons better than they judge absolutes. 'Which of these two is better, and on what criterion' is far more reliable than 'score this out of ten'.", noteLabel: "method"
  },
  {
    n: 23, track: "mastermind", title: "Orchestration with human gates", mins: 12,
    promise: "Design recurring automation that can't quietly wreck something.",
    why: "Once a task repeats, it becomes a loop: scheduled, triggered by an event, or started by a person. The valuable loops are boring and narrow — triage, tidy, summarise, chase. The dangerous ones have write access and no gate. Design the gate first: where a human approves, what the audit trail looks like, and what happens when the job half-finishes and dies.",
    steps: [
      "Pick a recurring chore that costs you an hour a week.",
      "Write the failure map: what does it do on bad input, on a timeout, on a duplicate?",
      "Put the approval step at the last responsible moment — before the send, not before the draft.",
      "Log every run: input, output, decision, time. If you can't audit it, don't automate it."
    ],
    prompt: "Design an automation for this weekly chore: [describe steps].\nDeliver: trigger, steps, the single human approval gate (last responsible moment), failure handling for bad input and timeouts, an audit log format, and the smallest version I could ship this week.\nMark anything that should stay manual.",
    check: "When this runs at 3am and fails halfway, what state is your data in?",
    note: "Route cheap models at routine steps and save the expensive one for judgement calls. Most automation bills are one over-qualified model doing data entry.", noteLabel: "cost"
  },
  {
    n: 24, track: "mastermind", title: "Judgement, risk, and teaching it", mins: 13,
    promise: "Know what never delegates — and how to package what you now know.",
    why: "The last level is judgement. Deciding what matters, owning a claim, choosing a trade-off, telling someone bad news: none of that delegates. Neither does accountability. The mastermind skill is knowing the boundary precisely, keeping secrets and personal data out of places that train on them, disclosing when work was machine-assisted, and being able to explain your system well enough that someone else can run it. That last part is also the only honest way to sell it.",
    steps: [
      "Write your own 'never delegate' list. Three items is plenty.",
      "Set one data rule you'll actually keep: no client names, no credentials, no personal data in prompts.",
      "Adopt a disclosure habit: say which parts were machine-assisted when it matters.",
      "Teach one module to one person. You'll discover what you don't actually understand."
    ],
    prompt: "Interview me for 10 minutes to find where my AI workflow has an unchecked risk: irreversible actions, sensitive data, unverified claims I repeat, and single points of failure.\nOne question at a time. At the end, give me a ranked list of three fixes with the first step for each.",
    check: "Which decision in your week would you refuse to hand over, and can you say why in one sentence?",
    note: "The teachable part is process, not magic. A system someone else can follow is worth more than a trick only you can perform — and it's the only version that survives you being on holiday.", noteLabel: "the point"
  }
];

/* ---------------- level assessment ---------------- */
export const QUIZ = [
  { q: "How do you use AI today?", a: [
    { t: "Barely — occasional questions", s: 0 },
    { t: "A few times a week for writing", s: 1 },
    { t: "Daily, for real work", s: 2 },
    { t: "Daily, and I've built things with it", s: 3 }
  ]},
  { q: "Have you ever had AI edit an actual file for you?", a: [
    { t: "No, only chat", s: 0 },
    { t: "Once or twice", s: 1 },
    { t: "Regularly", s: 2 },
    { t: "Constantly, across projects", s: 3 }
  ]},
  { q: "Do you reuse a written brief or prompt template?", a: [
    { t: "No, I type it fresh each time", s: 0 },
    { t: "I have a few notes somewhere", s: 1 },
    { t: "Yes, a small library", s: 2 },
    { t: "Yes, and I prune and version it", s: 3 }
  ]},
  { q: "What happens when an answer is wrong?", a: [
    { t: "I rephrase and hope", s: 0 },
    { t: "I point out the error and retry", s: 1 },
    { t: "I quote the exact line and correct the plan", s: 2 },
    { t: "I fix the rule or the context so it stops happening", s: 3 }
  ]},
  { q: "Any tool connected to your AI (calendar, notes, database)?", a: [
    { t: "Nothing connected", s: 0 },
    { t: "I've pasted things in", s: 1 },
    { t: "One or two integrations", s: 2 },
    { t: "Several, with permissions I chose deliberately", s: 3 }
  ]},
  { q: "How do you check work before you rely on it?", a: [
    { t: "I trust the summary", s: 0 },
    { t: "I skim it", s: 1 },
    { t: "I check the claim a reader would test", s: 2 },
    { t: "I have a repeatable check, and I log misses", s: 3 }
  ]},
  { q: "Do you know what a context window is?", a: [
    { t: "No", s: 0 },
    { t: "Roughly — more text, more memory", s: 1 },
    { t: "Yes, and I keep tasks small because of it", s: 2 },
    { t: "Yes, and I design what goes in it", s: 3 }
  ]},
  { q: "Could you teach this to a colleague tomorrow?", a: [
    { t: "Not really", s: 0 },
    { t: "The basics", s: 1 },
    { t: "Most of it", s: 2 },
    { t: "Yes, including where it breaks", s: 3 }
  ]}
];

/* ---------------- 40 prompts ---------------- */
export const PROMPTS = [
  { cat: "Foundations", title: "The honest knowledge split", body: "Before answering, split your knowledge into: what I told you, what you can infer, and what you'd be guessing. Then answer and mark guesses inline as [guess]. I'd rather have a gap than an invention." },
  { cat: "Foundations", title: "The six-line brief skeleton", body: "Role: [who you are].\nGoal: [one sentence].\nInputs: [paste].\nConstraints: [what to avoid, length, tone].\nOutput: [exact shape].\nDone means: [a testable condition]." },
  { cat: "Foundations", title: "Show me the disagreement", body: "Give me the two strongest opposing answers to: [question]. For each: its best evidence, its weakest assumption, and who benefits from it being true. Then say which one you'd act on and what would change your mind." },
  { cat: "Foundations", title: "Explain it until it clicks", body: "Explain [concept] three ways: to a smart 12-year-old, to someone in my job, and to a specialist. Then name the three misconceptions that make it feel harder than it is." },
  { cat: "Foundations", title: "The five-minute sanity check", body: "Here's what I'm about to send/do: [paste]. In 5 minutes, what's the worst realistic outcome? List three cheap checks I should run first, ordered by how likely they are to catch something." },

  { cat: "Context", title: "The reusable brief block", body: "Context to hold for this conversation:\n- Me: [role]\n- Audience: [who]\n- Tone: [3 words + 1 example sentence]\n- Never: [banned words/claims]\n- Good example: [paste]\nAcknowledge in one line, then wait." },
  { cat: "Context", title: "Project note generator", body: "Read this folder and write a one-page project note: purpose, structure, conventions, what not to touch, and the commands that matter. Then list every ambiguity, because that's where you'll guess wrong later." },
  { cat: "Context", title: "Rules that can be checked", body: "Turn these vague preferences into checkable rules: [list]. Each rule must be something a strict reviewer could test, with the failure stated. Cut anything that's just a mood." },
  { cat: "Context", title: "Decisions log entry", body: "Turn this conversation into three dated decision-log lines: what we decided, why, and what we rejected. Append-only style, one line each, no recap of the discussion." },
  { cat: "Context", title: "Hand off to a fresh session", body: "Write a handoff note for a new session with zero memory of this one: goal, current state, what's done, what's next, what failed and why, and the one rule not to break. Under 200 words." },

  { cat: "Build", title: "One page, one job", body: "Build a single page for [purpose]. Sections in this order: [list]. Headline exactly: \"[words]\". Audience: [who]. Style: [vibe + accent colour]. No extra pages, no sign-up, no analytics. Then tell me how to view it." },
  { cat: "Build", title: "Fix layout, don't rewrite", body: "The layout is wrong here: [specific observation + where]. Fix only layout, spacing and hierarchy. Don't rewrite the copy, don't restyle beyond what's needed, don't add sections. Tell me what you moved and why." },
  { cat: "Build", title: "Specific feedback, not vibes", body: "Turn my vague feedback into instructions you can act on: my note was \"[vague thing]\". Ask me up to three questions, then produce a numbered change list with locations and expected result." },
  { cat: "Build", title: "Build the smallest version", body: "I want [thing]. What's the smallest version that proves the idea works? Build that only — no settings, no options, no future-proofing. List what you deliberately left out." },
  { cat: "Build", title: "Small tool, no backend", body: "Build a single-page tool that [does X]. Runs entirely in the browser, saves nothing to a server, handles bad input without crashing. Under 200 lines if possible." },

  { cat: "Review", title: "Adversarial self-review", body: "Review your own change as an adversary, not an author. What requirement could this silently fail? What did you assume I never said? What else does it touch? Where does real-world input break it? Be specific; don't defend it." },
  { cat: "Review", title: "Block or nice-to-have", body: "Review this like the person whose name goes on it: [paste]. Separate 'would block shipping' from 'nice to have'. Cite the exact location for each. Don't rewrite it." },
  { cat: "Review", title: "Find the weakest link", body: "What am I most likely wrong about here? [paste]. Name the weakest link in the argument and the single assumption that, if false, breaks everything. Then say how I'd test that assumption cheaply." },
  { cat: "Review", title: "Check the arithmetic", body: "Recompute every number in this independently: [paste]. Show your working, flag anything you can't verify from what I gave you, and say whether the conclusion survives the correction." },
  { cat: "Review", title: "Read it as my harshest reader", body: "Read this as [specific person]. Where do you stop reading? Where do you stop believing me? What's the one question you'd ask that I haven't answered?" },

  { cat: "Research", title: "Cited, or labelled unverified", body: "Research: [question]. Every factual claim gets a link I can open. Say 'unverified' rather than guessing. Where sources disagree, show both and say which is better evidenced. End with what would overturn the conclusion." },
  { cat: "Research", title: "Three kinds of source", body: "Answer using at least one primary document, one independent critic, and one practitioner account. Label which is which, and tell me where they agree and where only the vendor agrees with itself." },
  { cat: "Research", title: "Compare before I commit", body: "Compare [A] and [B] for [my situation]. Criteria: 12-month cost, setup time, lock-in, and what breaks if I change my mind. Give a recommendation with the trade-off stated plainly, not a list of features." },
  { cat: "Research", title: "The state of play, dated", body: "Summarise the state of [topic] as of [month/year]. Separate what's established from what's moving monthly. Flag anything where your information might be stale, and tell me what to check myself." },

  { cat: "Data", title: "Plain-language formula", body: "Column A is [what], B is [what], C should be [rule in plain English, including blanks, negatives and errors]. Give the formula, a one-line explanation per part, one input that breaks it, and how to make bad input visible." },
  { cat: "Data", title: "Clean this mess", body: "Here's a messy export: [paste or attach]. Tell me what's wrong with it — types, duplicates, inconsistent units, empty rows — before fixing anything. Then fix it and list every change you made." },
  { cat: "Data", title: "Honest dashboard", body: "Build a one-screen dashboard from this data. Decision it supports: [decision]. Show only the three metrics that change it. Every number must come from the file. Add a two-line 'what this doesn't show' note." },
  { cat: "Data", title: "Explain the anomaly", body: "This number moved: [what changed, by how much]. Give me four plausible explanations ranked by likelihood, the one query or check that would distinguish between them, and what I should NOT conclude yet." },

  { cat: "Automate", title: "Design the loop", body: "I do this by hand weekly: [steps]. Design the automation: trigger, steps, the single human approval gate at the last responsible moment, failure handling for bad input and timeouts, and an audit log format." },
  { cat: "Automate", title: "Permission policy", body: "I'm connecting [tool]. Give me the smallest read scope that makes you useful, whether write scope is genuinely needed, what an attacker could do with it, and the two actions to keep manual forever. Then a one-paragraph policy I can save." },
  { cat: "Automate", title: "Fail loudly", body: "Rewrite this automation so it fails loudly: [describe]. Every silent fallback becomes a visible error. Tell me what the 3am failure looks like now and what state my data is in." },
  { cat: "Automate", title: "Kill the recurring meeting", body: "Here's what we cover weekly: [notes]. Turn it into an async written update template, plus the short list of what genuinely needs a live conversation. Be ruthless." },

  { cat: "3D", title: "The minimum scene", body: "Show the minimum three.js scene that renders a slowly rotating wireframe icosahedron with a starfield behind it and mouse parallax on the camera. Under 60 lines. Label: scene, camera, mesh, light, loop. Explain each label in one line." },
  { cat: "3D", title: "Motion with restraint", body: "Animate this scene with restraint: eased rotation (never linear), mouse parallax under 0.3 units, prefers-reduced-motion fallback, pixel ratio capped at 2. Explain each choice in one line." },
  { cat: "3D", title: "Performance audit", body: "Audit this 3D page for performance: draw calls, geometry reuse, texture sizes, pixel ratio, and whether the loop pauses when off-screen. Give me the three cheapest fixes ranked by frame-time saved." },
  { cat: "3D", title: "Looks good, ships badly", body: "This 3D page looks great on my laptop. Tell me every way it fails: low-end phones, no WebGL, reduced motion, screen readers, slow networks. For each, give the fallback and how to test it in 30 seconds." },

  { cat: "Mastermind", title: "Design my context system", body: "Design a context system for my work: a rule file, a dated decisions log, a failed-attempts section, and a pruning routine. Keep every rule checkable. Then say what you deliberately left out." },
  { cat: "Mastermind", title: "Tiny eval set", body: "Here are ten tasks I do often: [list]. For each, write the input, what a good result contains, and a 30-second pass/fail test a non-expert could apply. Flag the three too subjective to grade reliably." },
  { cat: "Mastermind", title: "Risk interview", body: "Interview me for 10 minutes to find where my AI workflow has an unchecked risk: irreversible actions, sensitive data, unverified claims I repeat, single points of failure. One question at a time. End with three ranked fixes." },
  { cat: "Mastermind", title: "Teach it back", body: "I'm about to teach [topic] to [audience] in 10 minutes. Review my outline for things I've assumed they know, one place I'll lose them, and the single example that would make it land. Then give me a better order." }
];

/* ---------------- rules ---------------- */
export const RULES = [
  ["Give a job description, not a wish.", "Role, goal, inputs, constraints, output shape, definition of done. Six lines, and the first answer is usually usable."],
  ["Context beats cleverness.", "Examples, constraints and audience move quality further than any prompt trick. Bring the good example and the anti-example."],
  ["Plan before it builds.", "The plan is the cheapest place to catch a wrong assumption. Correct it, then let the work happen."],
  ["One task per turn, one task per chat.", "Five changes in one message is how you get five half-done changes you can't review. Long chats quietly rot."],
  ["Trust the artefact, not the summary.", "Read the diff, open the chart's source cell, click the citation. 'Tests pass' is not 'it does what I asked'."],
  ["Never accept a number you can't trace.", "Ask where it came from. If the answer is 'estimated', treat it as invented until you check."],
  ["Bound every agent loop.", "State what it may touch, what it must ask about, and what is never allowed — before it starts, not after."],
  ["Least privilege, always.", "Read-only first, scoped credentials, human approval before anything sends, pays, publishes or deletes."],
  ["Automate on the third repetition.", "By then you know the shape of the job and where it fails. Before that you're automating a guess."],
  ["Keep the judgement.", "What matters, what you'd stake your name on, and how you treat people never delegates. Say which parts were machine-assisted."]
];

/* ---------------- glossary ---------------- */
export const GLOSSARY = [
  ["Agent", "A model given tools and a loop, so it can read, act and check until a task is done — rather than answering once."],
  ["Agentic loop", "Plan → act → observe → correct, repeated. Your job is to bound it and check each turn."],
  ["Blast radius", "Everything a change could affect beyond the line you meant to edit. The first thing to ask in a review."],
  ["Context window", "The model's working memory for one conversation. Everything it can see, measured in tokens. Quality degrades as it fills."],
  ["Context engineering", "Deliberately choosing what the model can see: examples, rules, files, prior decisions. The real skill behind good output."],
  ["Diff", "The exact set of changes made to files. Read it instead of trusting a description of it."],
  ["Draw call", "One instruction from the page to the GPU to draw something. Usually the real bottleneck in 3D, not polygon count."],
  ["Easing", "Non-linear motion — starting and stopping gently. The difference between mechanical and expensive-feeling animation."],
  ["Eval", "A small fixed set of tasks with known-good outcomes, used to prove a change actually improved things."],
  ["Hallucination", "A confident, well-formed statement that isn't true. A property of prediction, not a bug you can patch away."],
  ["Least privilege", "Giving a tool or agent the minimum access needed for its job, and nothing extra."],
  ["MCP", "Model Context Protocol. An open standard for connecting assistants to tools and data — a USB-C port for AI."],
  ["Prompt injection", "Instructions hidden in content the agent reads (a document, ticket, web page, tool description) that hijack its behaviour."],
  ["Provenance", "Where a number or claim came from. If you can't state it, you don't have it."],
  ["Scene graph", "The tree of objects in a 3D scene. Move a parent, its children follow."],
  ["Subagent", "A separate agent with its own context that does a chunk of work and returns a summary. Used for parallelism and context hygiene."],
  ["Skill", "A reusable instruction file an agent loads for a specific kind of job — including how to verify its own work."],
  ["System prompt", "Instructions loaded before your message. The closest thing to 'how this agent behaves by default'."],
  ["Token", "The unit models read in — roughly three-quarters of a word. Context limits and costs are counted in them."],
  ["WebGL", "The browser API for 3D graphics. Usually driven by three.js rather than written by hand."],
  ["Worktree", "A separate working copy of a project. The standard way to let parallel agents work without overwriting each other."],
  ["Reduced motion", "An OS setting some people enable because animation makes them ill. Honor it; provide a static fallback."]
];

/* ---------------- sources ---------------- */
export const SOURCES = [
  ["Anthropic — Writing effective tools for agents", "How to design tools an agent can actually use: names that match real task boundaries, high-signal returns, fewer overlapping tools.", "https://www.anthropic.com/engineering/writing-tools-for-agents"],
  ["Anthropic — Building agents with the Claude Agent SDK", "Context engineering via the file system, why folders are context, and how subagents protect the main context window.", "https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk"],
  ["Claude — Loop engineering: getting started", "The taxonomy behind module 15 and 23: manual loops, planned loops, and scheduled proactive loops with stop criteria.", "https://claude.com/resources/articles/getting-started-with-loops"],
  ["Model Context Protocol — Introduction", "The standard itself, in its own words. Read this before connecting anything.", "https://modelcontextprotocol.io/docs/getting-started/intro"],
  ["OWASP — MCP Security Cheat Sheet", "Least privilege, scoped tokens, sandboxing, and treating entire tool schemas as an injection surface.", "https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html"],
  ["Microsoft — Least privilege for AI agents", "Agent identity, just-in-time elevation, task-scoped roles and end-to-end auditability. The enterprise version of module 20.", "https://www.microsoft.com/en-us/security/blog/2026/07/16/least-privilege-for-ai-agents-identity-access-and-tool-binding"],
  ["OpenAI — A practical guide to building agents", "When to use one agent, when to use several, and why overlapping tools hurt more than too many tools.", "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents"],
  ["OpenAI — Evaluation best practices", "Why pairwise comparison beats absolute scoring, and how to build a small test set that catches regressions.", "https://developers.openai.com/api/docs/guides/evaluation-best-practices"],
  ["r/ClaudeCode — 4,500 hours of AI coding, the setup that survived", "Plan / critique / readiness prompts, global rules, and the failure list that never changes.", "https://www.reddit.com/r/ClaudeCode/comments/1xw7ylh/"],
  ["r/ChatGPTCoding — Lessons from running agents unattended", "Separate the planner from the builder, commit every phase, assume the crash.", "https://www.reddit.com/r/ChatGPTCoding/comments/1xrsu8g/"],
  ["Hacker News — Is anybody producing good code with agents?", "The consensus workflow: small chunks, fast review, tight iteration — not long unattended runs.", "https://news.ycombinator.com/item?id=49934037"],
  ["three.js — Manual and examples", "The canonical reference for everything in modules 16–18. The examples index is the fastest way to learn.", "https://threejs.org/manual/"]
];

/* ---------------- lab presets ---------------- */
export const LAB_CODE = `import * as THREE from "three";

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 100);
camera.position.set(0, 0, 5.4);

// geometry + material = mesh
const mesh = new THREE.LineSegments(
  new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.6, 1)),
  new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.35 })
);
scene.add(mesh);

function frame() {
  mesh.rotation.y += SPEED;   // the loop
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
frame();`;
