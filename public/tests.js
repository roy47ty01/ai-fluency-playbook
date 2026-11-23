/* ============================================================
   LESSON TESTS — part 1 (lessons 1-19)

   Format, kept deliberately compact so the file stays readable:
     [ question, [option A, option B, option C, option D], correctIndex, why ]

   How these are written:
   - one question checks the core idea (can you say it back)
   - one checks application (what would you actually do)
   - one checks a common misconception (the mistake almost everyone makes)

   The distractors are the answers a real learner gives when they have
   half-learned the lesson, not obviously silly options. If you can pick
   the wrong one and see exactly why it is wrong, the test is working.

   Pass mark is 2 of 3. Retry as often as you like — the point is the
   correction, not the score.
   ============================================================ */

export const LESSON_TESTS = {
  1: {
    pass: 2,
    qs: [
      ["Why can a model produce a detailed, convincing sentence that is completely false?",
        ["It looks answers up in a database that contains errors", "It predicts what a good answer would look like rather than checking facts", "It deliberately withholds the truth", "Its internet connection failed"],
        1, "It is predicting plausible text. Plausible and true are different things, and the gap is where invented citations live."],
      ["You need a market size for a report due tomorrow. What is the correct order of operations?",
        ["Ask the model, then soften the number in the text", "Ask the model, then find a source that roughly agrees", "Find the number in a source you can open, then use the model to help interpret it", "Ask two different models and average the answers"],
        2, "Numbers come from traceable sources. Models are for shaping and interpreting, not for supplying the figure."],
      ["Where is a model most reliable?",
        ["Names, dates and statistics", "Structure, tone, phrasing and the shape of an argument", "Quotes from real people", "Links to live web pages"],
        1, "Shape is what prediction is good at. Specifics are what it is bad at. That single distinction explains most disappointment."],
    ],
  },

  2: {
    pass: 2,
    qs: [
      ["Which line in a six-line brief does the most work, and is most often missing?",
        ["Role", "Inputs", "Definition of done", "Tone"],
        2, "'Done means' turns a vague hope into a testable condition, so you can tell whether the answer actually finished the job."],
      ["Your brief keeps coming back too long. What is the best fix?",
        ["Ask again and say 'shorter please'", "Add an exact word count and the shape you want to the constraints and output lines", "Start a new chat", "Use a bigger model"],
        1, "Length is a constraint, not a mood. Numbers and shape remove ambiguity; 'shorter' does not."],
      ["Which of these is a brief, not a wish?",
        ["Help me with my marketing assignment", "Write 250 words for my tutor arguing that the pricing change was a mistake, using only these three figures", "Make it good", "Can you do my coursework"],
        1, "It names audience, length, position and inputs. Everything needed to judge the result is present."],
    ],
  },

  3: {
    pass: 2,
    qs: [
      ["Why does showing one example beat describing a tone with adjectives?",
        ["Examples use fewer tokens", "An example fixes the target precisely, while adjectives are interpreted differently by every reader", "Models ignore adjectives", "Examples are always shorter"],
        1, "'Professional but warm' is a judgement call. Three sentences you would actually write are a specification."],
      ["You want output that sounds like you. What is the strongest context to supply?",
        ["'Sound like a business student'", "Three sentences you wrote and like, plus two you hate", "Your job title", "The name of your university"],
        1, "A good example and an anti-example bracket the target from both sides. That is fast and unambiguous."],
      ["What is the most common mistake in context engineering?",
        ["Using examples", "Dumping in everything you have because the window is large", "Giving an audience", "Stating a word count"],
        1, "More context is not better context. Irrelevant material competes for attention and dilutes the instructions that matter."],
    ],
  },

  4: {
    pass: 2,
    qs: [
      ["Why ask for a plan before the work on anything with several steps?",
        ["It makes the answer longer", "A wrong assumption is cheap to fix in a plan and expensive to fix in finished work", "Models refuse to work without one", "It uses less of the context window"],
        1, "The plan is the last moment when correcting a misunderstanding costs one sentence instead of an afternoon."],
      ["The plan comes back and one line is wrong. What do you do?",
        ["Start the whole request again", "Correct that line, restate the goal, then say proceed", "Accept it and fix the output later", "Ask it to try harder"],
        1, "You correct the smallest thing that is wrong and keep the rest. Restarting throws away the work that was already right."],
      ["Which plan shows real understanding?",
        ["One that repeats your words back with headings", "One that states assumptions, order, and what it will check", "One that is very long", "One that lists every possible approach"],
        1, "Assumptions plus order plus verification is what comprehension looks like. Repetition is what imitation looks like."],
    ],
  },

  5: {
    pass: 2,
    qs: [
      ["An assistant says 'done, everything works'. What is that worth on its own?",
        ["Proof it works", "Nothing yet — a summary is a claim, not evidence", "Enough if the model is new", "Proof if it uses the word 'verified'"],
        1, "Trust the artefact, not the summary. Open the file, read the diff, click the link."],
      ["Which check should you run first on a piece of AI-written work?",
        ["Spelling", "The one claim that, if wrong, makes the whole thing worthless", "The formatting", "Whether it sounds confident"],
        1, "You cannot check everything, so check what carries the weight: the number, the quote, the date, the calculation."],
      ["The output contains a statistic with no source. The honest move is:",
        ["Use it and add 'approximately'", "Treat it as invented until you can trace it", "Ask it to add a citation and trust that", "Average it with another number"],
        1, "'Approximately' does not make a number real. Asked for a citation, a model may invent one, so you trace it yourself."],
    ],
  },

  6: {
    pass: 2,
    qs: [
      ["What makes a prompt library useful rather than decorative?",
        ["Having two hundred prompts", "Keeping a small set you actually reuse and prune", "Storing it in the cloud", "Writing it in a fancy tool"],
        1, "A handful of tested prompts you reach for daily beats a huge collection you never open."],
      ["What belongs in your saved brief block?",
        ["Only your name", "Who you are, your audience, your tone with an example, and your no-gos", "A copy of your CV", "Every prompt you have ever written"],
        1, "That block removes the ambiguity you would otherwise re-explain every single time."],
      ["You keep retyping the same instructions. The cheapest fix is:",
        ["Buying a subscription", "Saving those instructions in one note and pasting them", "Learning more prompt tricks", "Using a different model"],
        1, "The bottleneck is memory, not model quality. A note solves it in two minutes."],
    ],
  },

  7: {
    pass: 2,
    qs: [
      ["When is chat the wrong surface for the job?",
        ["When you are thinking out loud", "When the work needs to read and change your actual files", "When you want a summary", "When you are drafting an email"],
        1, "If the task lives in files, use a tool that can see the files. Pasting a document into chat is a workaround, not a workflow."],
      ["What is the practical difference between chat and an agent with file access?",
        ["Agents are more accurate at everything", "An agent can act on the project; chat can only reason about what you paste", "Chat cannot write code", "Agents never need checking"],
        1, "Action is the difference. It is also why an agent needs boundaries, because acting can be destructive."],
      ["You need a spreadsheet formula checked against a real file. Best approach?",
        ["Paste a screenshot into chat", "Describe the file from memory", "Give the tool the file and ask it to show the formula and a hand-checked example", "Guess and test manually"],
        2, "Real input plus a worked example is verifiable. A screenshot loses the cells you need."],
    ],
  },

  8: {
    pass: 2,
    qs: [
      ["What turns a wish into a task?",
        ["Saying please", "A finished state you could recognise, and a boundary on what may change", "A longer message", "Asking politely twice"],
        1, "'Redo my project' cannot be checked. 'Rewrite the intro in 80 words for a non-expert' can."],
      ["A task keeps coming back half-done. Most likely cause?",
        ["The model is weak", "The task was too big to finish or verify in one go", "You did not say 'important'", "You need a better prompt trick"],
        1, "Split it until each piece has a visible finish line. Big requests produce impressive-looking partial work."],
      ["Which is a real acceptance criterion?",
        ["Make it professional", "Looks good", "Every number in the table matches the source sheet, and the total is correct", "Do your best"],
        2, "It names something a reviewer can test. That is the whole difference between a standard and a wish."],
    ],
  },

  9: {
    pass: 2,
    qs: [
      ["Why does a two-line note at the top of a project folder change the quality of help you get?",
        ["It makes the files smaller", "It supplies the context the tool would otherwise have to guess", "It speeds up the internet", "It is required by law"],
        1, "Anything working in that folder reads the note first. Guessing is what produces wrong assumptions."],
      ["What should that note contain?",
        ["A full history of the project", "What this is, who it is for, and what not to touch", "Your life story", "Every error you have ever seen"],
        1, "Short, current and specific. A note nobody reads is the same as no note."],
      ["The tool keeps editing a file you did not want changed. The fix is:",
        ["Ask it not to, in the same conversation", "Write the boundary into the project note, and say it again in the request", "Give up on the tool", "Delete the file"],
        1, "Boundaries that live in the project's own instructions survive the conversation ending."],
    ],
  },

  10: {
    pass: 2,
    qs: [
      ["Before asking for a formula, what should you be able to state?",
        ["The exact syntax", "The rule in ordinary words, including blank and error cases", "The cell colour", "Which version of the spreadsheet software you use"],
        1, "If you can say the rule out loud, the formula is easy. The blank case is where spreadsheets quietly lie."],
      ["A formula works for most rows but shows an error on empty cells. What is missing from your request?",
        ["A bigger model", "The rule for empty or missing input", "More rows of data", "A macro"],
        1, "Edge cases are part of the specification, not an afterthought. Say what should happen when the cell is blank."],
      ["How do you know the generated formula is right?",
        ["It looks plausible", "You test it on one row you calculated by hand", "It has no errors showing", "The model says it is correct"],
        1, "One hand-worked row proves the logic. Without it you can only judge appearance."],
    ],
  },

  11: {
    pass: 2,
    qs: [
      ["A dashboard is worth building when:",
        ["You have a lot of data", "It changes a specific decision someone makes", "It looks impressive in a presentation", "The data is colourful"],
        1, "Finish this sentence: 'because of this screen we will decide whether to ___.' If you cannot, it is decoration."],
      ["Which is the best set of metrics for a one-screen dashboard?",
        ["Every number available", "The three numbers that would change the decision", "Whatever the data source returns first", "One number, in as much detail as possible"],
        1, "A dashboard is an argument, not an archive. Extra numbers dilute the one that matters."],
      ["What should accompany every dashboard you hand over?",
        ["A logo", "A short note on what it does not show and where the numbers come from", "A second dashboard", "An animation"],
        1, "Honest limits and provenance are what make a number usable in a meeting."],
    ],
  },

  12: {
    pass: 2,
    qs: [
      ["What is the single most useful instruction for research help?",
        ["Be thorough", "Give me a link I can open for every factual claim, and say 'unverified' rather than guessing", "Use your best judgement", "Think step by step"],
        1, "The link requirement converts unverifiable prose into something you can check in two clicks."],
      ["Two sources disagree on a figure. What do you want from the tool?",
        ["The average", "Both figures, who says each, and which is better evidenced", "The more recent one, silently", "A confident single number"],
        1, "Disagreement is information. Hiding it is how a report becomes wrong in a way nobody can trace."],
      ["How many citations should you actually open yourself?",
        ["None, that defeats the purpose", "The two or three the argument depends on", "Every single one", "Only the ones that look suspicious"],
        1, "You cannot read everything. You can absolutely check the load-bearing claims."],
    ],
  },

  13: {
    pass: 2,
    qs: [
      ["What should you write before asking for a page to be built?",
        ["The colour palette", "The headline, the audience, and the sections in the order a reader needs them", "The framework", "A list of animations"],
        1, "The page is the headline and the order. Visual style is easier to adjust than a wrong argument."],
      ["The result looks fine but feels wrong. What feedback actually helps?",
        ["'Make it better'", "'The second paragraph repeats the first, and the button is below the fold on a phone'", "'I don't like it'", "'Try again'"],
        1, "Name the place and the symptom. Vague feedback produces random changes."],
      ["You asked for one page and got five sections plus a sign-up form. What went wrong?",
        ["The tool is broken", "The scope was not bounded in the brief", "You needed a bigger model", "Five sections is always better"],
        1, "State what to leave out. Unbounded scope invites every feature the tool can imagine."],
    ],
  },

  14: {
    pass: 2,
    qs: [
      ["What is the first question when reviewing AI-written work?",
        ["Is the code elegant?", "Does it do what I asked, and what else did it touch?", "Is it long enough?", "Did it use a modern style?"],
        1, "Intent and blast radius first. Style is a distant third."],
      ["Why ask the tool to review its own work as an adversary?",
        ["It becomes truthful automatically", "It is better at finding weaknesses when asked to attack the work than when asked to confirm it", "It lowers the cost", "It proves the work is correct"],
        1, "Self-critique surfaces plausible failures; it never replaces your own check of the load-bearing parts."],
      ["The summary says 'small change, no side effects'. What do you do?",
        ["Trust it, it was specific", "Read the actual diff and check what else is in it", "Ask it again", "Run the whole project from scratch"],
        1, "Summaries omit. The diff is the truth, including the files you did not expect to see."],
    ],
  },

  15: {
    pass: 2,
    qs: [
      ["Before starting an agent loop, what are the three things to state?",
        ["Model, temperature, tokens", "What it may touch, what it must ask about, what it must never do", "Deadline, budget, name", "Language, framework, version"],
        1, "Boundaries stated up front are the difference between a useful loop and an incident."],
      ["Where does the human approval belong in an automated workflow?",
        ["Before anything happens", "At the last responsible moment, before the irreversible step", "After everything, as a review", "Nowhere, speed matters"],
        1, "Approve the send, the payment, the publish, the delete — not the draft that costs nothing to redo."],
      ["The loop fails halfway. What do you want to know first?",
        ["How long it ran", "What state the data is in now", "Which model it used", "Whether it can try again"],
        1, "Recovery depends on knowing what actually happened. 'It failed' is not a state."],
    ],
  },

  16: {
    pass: 2,
    qs: [
      ["In a three.js scene, what does the render loop do?",
        ["Downloads the model", "Redraws the scene many times a second so motion looks continuous", "Compiles the JavaScript", "Loads the textures once"],
        1, "The loop is the animation. Without it you get one still frame."],
      ["What does the camera control?",
        ["The colour of the objects", "What part of the scene the viewer sees and from where", "The frame rate", "The size of the file"],
        1, "Camera position and field of view are composition. Most 'it looks wrong' 3D problems are camera problems."],
      ["Why cap the pixel ratio at 2?",
        ["It makes colours brighter", "Higher ratios multiply the pixels drawn for very little visible gain on high-density screens", "It is required by three.js", "It prevents animation"],
        1, "Performance is usually about how many pixels and draw calls you ask the GPU for, not polygon count alone."],
    ],
  },

  17: {
    pass: 2,
    qs: [
      ["Which motion feels expensive rather than mechanical?",
        ["Constant-speed linear rotation", "Eased motion that starts and stops gently", "Faster rotation", "More objects moving"],
        1, "Easing is most of the difference. Linear motion reads as a demo from 2009."],
      ["A visitor's system is set to reduce motion. What should the page do?",
        ["Ignore it, the animation is the point", "Honour it: slow or stop the motion and provide a static frame", "Show a warning", "Load a video instead"],
        1, "For some people animation causes real nausea. Respecting the setting is accessibility, not politeness."],
      ["What makes 3D motion feel responsive rather than decorative?",
        ["Lots of movement", "A small amount of movement that follows the pointer or scroll, with restraint", "Constant spin at high speed", "Random movement"],
        1, "Understated and connected to the user's input reads as designed. Constant motion reads as a screensaver."],
    ],
  },

  18: {
    pass: 2,
    qs: [
      ["What usually costs the most performance in a 3D page?",
        ["The number of colours", "Draw calls and pixels rendered, not polygon count alone", "The length of the variable names", "The number of files"],
        1, "Fewer draw calls, reused geometry, capped pixel ratio, and pausing off-screen are the cheap wins."],
      ["Why pause the loop when the canvas is off screen?",
        ["To save battery and keep the rest of the page smooth", "Because browsers refuse to render hidden canvases", "To reset the animation", "To reload the scene"],
        1, "Work nobody can see is pure waste, and it competes with scrolling."],
      ["The page looks great on your laptop. Which list is the right thing to check?",
        ["Only Chrome on desktop", "Low-end phones, no WebGL, reduced motion, screen readers, slow networks", "Just the frame rate", "Only Safari"],
        1, "A 3D page is a page first. Every failure mode needs a fallback that still communicates."],
    ],
  },

  19: {
    pass: 2,
    qs: [
      ["What makes a project rule usable?",
        ["It sounds professional", "A strict reviewer could test it, and the failure is stated", "It is long", "It is written by a senior person"],
        1, "'Never add a dependency without asking' is testable. 'Write clean code' is a mood."],
      ["Which belongs in a project rules file?",
        ["Your whole life philosophy", "What this is, the commands that matter, conventions, what never to touch, how to check a change", "Every prompt you have used", "A list of competitors"],
        1, "Short, current, checkable. A rules file nobody follows is worse than none, because it creates false confidence."],
      ["New information contradicts a rule that is months old. What now?",
        ["Leave it, rules are permanent", "Update or delete the rule, because stale rules get ignored and then all rules get ignored", "Add a second conflicting rule", "Delete the whole file"],
        1, "Rules earn obedience by being true. Pruning is part of maintaining them."],
    ],
  },
};
