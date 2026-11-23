/* ============================================================
   DEEPER READING — lessons 1-6

   The main lesson gives you the idea and the drill. This layer adds the
   part a short lesson cannot: how it actually works underneath, a worked
   example you can follow line by line, the words you need to read other
   material on the subject, the mistakes almost everyone makes, and a
   three-line recap you can check yourself against tomorrow.

   Written from primary sources where they exist (model documentation,
   published evaluations, teaching guides) and from published research on
   how people actually learn — retrieval practice and spacing, not
   rereading. See the sources section for what each part rests on.
   ============================================================ */

export const DEPTH_A = {
  1: {
    lead: "Everything else in this course is a consequence of this one lesson. If you understand why the sentences are good and the facts are unreliable, the rest of the material stops being a list of tricks and becomes obvious.",
    sections: [
      {
        h: "What is actually happening when you press send",
        p: [
          "Your message is cut into tokens. A token is a chunk of text, usually a word or part of one; a rough rule for English is four characters or about three-quarters of a word. The whole conversation, including every earlier reply, is converted into a sequence of these tokens and handed to the model.",
          "The model's only job is to produce the next token. It scores every token in its vocabulary for how likely it is to come next, picks one according to those scores, and then repeats the process with the new token added. That is the entire mechanism. A 300-word answer is that loop running a few hundred times.",
          "This explains the two things people find contradictory. The output is grammatically flawless because grammar is a pattern in the training text, and patterns are exactly what the model has learned. The output is sometimes factually wrong for the same reason: what comes next in a well-written paragraph about a study is a citation-shaped thing, and a citation-shaped thing is not the same as a real citation."
        ]
      },
      {
        h: "Training, and why it has a cutoff",
        p: [
          "Before you ever see it, the model is trained on an enormous amount of text. It is not storing that text in a lookup table; it is adjusting billions of numerical settings so that its next-token predictions match real writing better. The result is a compressed statistical sense of how language, code and argument are structured.",
          "Training happened at a point in time, so the model has a knowledge cutoff. Ask about something after that date and it has two options: say it does not know, or produce something that looks like an answer. Which one you get depends on how the question is phrased and how the model was tuned, and that is why you should always ask about current prices, current rules and current versions rather than assuming.",
          "The randomness you see between two identical prompts is also deliberate. The model samples from those scores rather than always taking the single most likely token, because always taking the most likely token produces flat, repetitive text. Sampling is what makes it useful and what makes it inconsistent. Both facts are permanent, not bugs to be fixed by trying harder."
        ]
      },
      {
        h: "The three limits that cause almost every frustration",
        p: [
          "First, it has no memory between conversations. A new chat starts knowing nothing about you, your project, or what you decided last week. Anything you want it to know must be in this conversation, in the files it can see, or in instructions that get loaded automatically.",
          "Second, it has a context window: a maximum amount of text it can consider at once. Everything competes for that space — your instructions, its earlier answers, any document you pasted. There is good evidence that models attend less reliably to material buried in the middle of a very long context than to the beginning and the end, and practitioners consistently report quality dropping well before the limit is reached.",
          "Third, it has no idea what it does not know in the way you do. It has no internal flag that says 'this fact is missing'. It has a fluency signal, not a truth signal. That is why the useful habit is not 'ask better' but 'verify the specific things that matter', and why a model that says 'I'm not sure' is behaving better than one that never does."
        ]
      }
    ],
    worked: {
      h: "A worked example: the invented citation, traced end to end",
      steps: [
        "You ask: 'What does the research say about AI tutoring and student outcomes? Give me three studies.'",
        "You get three plausible-sounding studies with authors, years and journals. The prose is excellent and the summary of each finding is exactly what you would expect to find.",
        "You search the first author and journal combination. Nothing. You search the second. There is a real paper with a similar title by different authors, saying something weaker.",
        "What happened: the request asked for the shape of an answer — 'three studies' — and the model produced the shape. It had no access to a database of papers and no mechanism to check that a title exists.",
        "The fix is not a better prompt. It is a different request: 'Tell me where to look for research on AI tutoring, what terms to search, and what a strong study in this area would need to measure. I will find and read the studies myself.' Now the model is doing what it is good at — orientation — and you are doing what only you can do — verification.",
        "The general rule: ask it for structure, options, explanations, drafts and questions. Go and get the specifics yourself, or make it read a specific document you supplied."
      ]
    },
    terms: [
      ["Token", "The unit of text a model reads and writes. Roughly three-quarters of an English word. Context limits and prices are counted in tokens."],
      ["Sampling", "Choosing the next token from a probability distribution rather than always the top one. The reason the same prompt gives different answers."],
      ["Context window", "The maximum amount of text the model can hold in view at once, including the conversation and anything pasted in."],
      ["Knowledge cutoff", "The point in time after which the model has no training data. Anything newer must come from you or a connected source."],
      ["Hallucination", "A fluent, confident statement that is not true. Not a glitch: a direct consequence of predicting plausible text."]
    ],
    mistakes: [
      ["Asking for facts and trusting the fluent answer", "Ask for structure and explanation; get facts from a source you open yourself."],
      ["Treating inconsistency as brokenness", "Expect variance. If you need a fixed answer, ask for a fixed format and check the content."],
      ["Assuming it knows what happened recently", "State the date and the facts it needs, or connect it to a live source."],
      ["Believing a confident 'I checked that'", "Only your own check counts. Ask what it did not verify, then verify that part."]
    ],
    recap: [
      "It predicts the next token; it does not look anything up unless something gives it a source.",
      "Fluency and error come from the same mechanism, so good writing is not evidence of accuracy.",
      "No memory between chats, a finite working memory, and no reliable sense of its own ignorance."
    ]
  },

  2: {
    lead: "A brief is not a longer prompt. It is a request where every part of the job has been said out loud, so the answer can be judged instead of argued about.",
    sections: [
      {
        h: "Why six lines, and what each one removes",
        p: [
          "Role removes the question of voice and standards. 'Careful editor who has read too many bad updates' tells the model which failure to avoid. You do not need a costume; you need a standard.",
          "Goal, inputs and constraints remove ambiguity about what the job is, what it may use, and what it must not do. Output shape removes ambiguity about form — and form is where most first drafts fail, because a model asked for 'a summary' will choose a shape you did not want.",
          "The last line, definition of done, is the one that changes how the other five are written. It forces you to decide what finished means before you ask, which is the same discipline that makes a good assignment brief or a good ticket at work. If you cannot write it, you do not yet know what you want, and no model can guess on your behalf."
        ]
      },
      {
        h: "The failure this prevents, in one example",
        p: [
          "'Help me with my sustainability report' produces a generic document about sustainability reports. The model did not fail; it answered the question you asked, which had no audience, no length, no position and no source material.",
          "The brief version: 'Role: editor for a second-year business student. Goal: a 250-word section arguing that our packaging change was mostly greenwashing, using only the three figures below. Constraints: no jargon, no bullet points, take a clear position, do not invent figures. Output: three paragraphs. Done means: my tutor could disagree with it and say exactly what she is disagreeing with.'",
          "Notice that the brief contains a position. Vague requests produce neutral mush because neutrality is the safest average of everything on the topic. If you want an argument, ask for one, and then decide whether you agree with it."
        ]
      },
      {
        h: "Iterating without rewriting the brief",
        p: [
          "Once a brief exists, corrections become cheap and specific: 'tighten paragraph two', 'the third figure is wrong, here is the right one', 'drop the last sentence'. You are editing a document instead of re-explaining a wish.",
          "The most common mistake at this stage is adding more and more instructions until the brief contradicts itself. If a request has grown past about ten lines, split it into two tasks. Two clear briefs beat one enormous one, and you can check each result separately."
        ]
      }
    ],
    worked: {
      h: "Turning a real wish into a brief",
      steps: [
        "Wish: 'write my LinkedIn post about my internship'.",
        "Role: someone who writes plainly and dislikes personal-brand language.",
        "Goal: a 120-word post about what I actually did in my first month.",
        "Inputs: the four bullet points below, nothing else.",
        "Constraints: no 'excited to announce', no hashtags, no inspirational ending, first person, past tense.",
        "Output: one paragraph, 110-130 words.",
        "Done means: a classmate could read it and know which team I worked in and one thing I shipped.",
        "Result: something you can post with two small edits, instead of three rewrites of a post that says nothing."
      ]
    },
    terms: [
      ["Brief", "A request that states role, goal, inputs, constraints, output shape and definition of done."],
      ["Acceptance criterion", "A condition a reviewer can test, such as 'every figure matches the source sheet'."],
      ["Constraint", "A limit on what the answer may contain or do. Length, tone bans, source restrictions."],
      ["Output shape", "The exact form: paragraphs, table, 120 words, three bullets, JSON."]
    ],
    mistakes: [
      ["Writing one line and blaming the tool", "Write the six lines. It takes ninety seconds and saves three rounds."],
      ["Using adjectives as constraints", "'Professional' is a mood. 'No jargon, no exclamation marks, 200 words' is a constraint."],
      ["Leaving out the definition of done", "State what a finished answer lets someone do. That is the line you will actually judge against."],
      ["Growing one brief until it conflicts with itself", "Split into two tasks with two clear briefs."]
    ],
    recap: [
      "Six lines: role, goal, inputs, constraints, output shape, done.",
      "Definition of done is the highest-leverage line because it makes the result testable.",
      "Long briefs rot. Split them before they contradict themselves."
    ]
  },

  3: {
    lead: "Two people with the same model get different results because one of them brought better raw material. That is the whole skill, and it is mostly about examples.",
    sections: [
      {
        h: "Why examples beat adjectives",
        p: [
          "An adjective is a compression of a judgement. 'Professional', 'warm', 'academic' each mean something slightly different to every reader, and the model's version is an average of millions of uses — which is why the result feels like everyone and no one.",
          "An example is a specification. Three sentences you would actually write pin down sentence length, vocabulary, punctuation habits and how you handle a caveat. You do not have to name any of those features; the model can infer them from the sample, which is precisely what it is good at.",
          "An anti-example is the other half. Showing two lines you hate removes a whole region of the space, and it is usually faster than explaining the boundary in words. 'Not like this' plus one bad sample is worth a paragraph of description."
        ]
      },
      {
        h: "Context engineering, defined plainly",
        p: [
          "Context engineering is the deliberate choice of what the model can see when it answers: instructions, examples, audience, prior decisions, the files that matter, and the constraints that are not negotiable. It is a design job, not a wording job.",
          "The reason it matters more than prompt cleverness is that most bad output is not a phrasing problem. It is a missing-information problem. The model invented an audience because you did not name one; it chose a formal register because it had no sample of your voice; it invented a number because you did not supply one.",
          "There is a real cost to over-supplying. Everything in the window competes for attention, and long irrelevant context makes the important instruction easier to lose. The target is the smallest context that removes the ambiguity — not the largest context you can afford."
        ]
      },
      {
        h: "The brief block you will reuse for years",
        p: [
          "Keep one block of text that describes you, your audience, your tone with one good example and one bad one, and your hard no-gos. Paste it before a task and add one line: 'acknowledge in one line, then wait'.",
          "That last instruction matters. Without it the model may start working before you have given it the actual task, and you lose the chance to correct its understanding cheaply. With it, you get a one-line confirmation you can check in two seconds.",
          "For file-based work, the same idea lives in a project note at the top of the folder. Anything working in that folder reads it first, which means you write the context once instead of every time."
        ]
      }
    ],
    worked: {
      h: "Fixing a tone problem in one round instead of four",
      steps: [
        "First attempt: 'Rewrite this paragraph to sound more professional.' Result: stiff, full of 'furthermore', unusable.",
        "Second attempt: 'Rewrite this to sound like me.' Result: still generic, because it has never seen you.",
        "Third attempt: paste one paragraph you wrote and like, one you dislike, and the sentence 'match the first, avoid the second'.",
        "Result: the register, sentence length and vocabulary move immediately, because now there is a target rather than a description of a target.",
        "Then add the constraint that matters for your context: 'no semicolons, no three-item lists, no closing summary sentence'."
      ]
    },
    terms: [
      ["Context engineering", "Deciding what the model can see: examples, rules, files, decisions, audience."],
      ["Anti-example", "A sample of what you do not want. Removes a region of the space faster than describing it."],
      ["Brief block", "A reusable block of your context — who you are, audience, tone, examples, no-gos."],
      ["Relevance", "The property that matters in context. More material is not better material."]
    ],
    mistakes: [
      ["Describing tone instead of demonstrating it", "One good sample, one bad sample, one line of instruction."],
      ["Dumping everything into a large context window", "Supply only what the task needs. Irrelevant text dilutes the instruction."],
      ["Never using negative examples", "Add 'not like this'. It is the cheapest quality improvement in the lesson."],
      ["Forgetting the acknowledgement step", "Ask for one line back, then give the task. Fix misunderstandings before work starts."]
    ],
    recap: [
      "Examples are specifications; adjectives are moods.",
      "Most bad output is missing information, not bad phrasing.",
      "Smallest sufficient context beats largest possible context."
    ]
  },

  4: {
    lead: "Planning first is not caution for its own sake. It is the only point in the process where being wrong costs one sentence.",
    sections: [
      {
        h: "The economics of correcting early",
        p: [
          "Work has a shape: understand, decide, produce, check. Mistakes made at the understanding stage get baked into everything after it. A wrong assumption about who the report is for produces the wrong length, the wrong register, the wrong evidence and the wrong recommendation — and all of it looks finished.",
          "A plan exposes the understanding stage. Reading a plan is fast because it is short, and correcting it is cheap because nothing has been produced yet. This is the same reason builders do not start with the roof.",
          "There is a second benefit that matters more over time: a plan becomes the thing you hold the work to. When the output arrives, you compare it to the agreed plan rather than to a vague memory of what you wanted."
        ]
      },
      {
        h: "What a good plan contains",
        p: [
          "It should state the goal in its own words, the order of steps, the assumptions it is making, what it will check, and what it will not touch. If a plan only repeats your words back with headings, it has not shown understanding — it has shown compliance.",
          "The assumptions line is where you will find the errors. 'I've assumed the data is monthly and in pounds' is exactly the kind of statement that is invisible in finished work and fatal in a meeting.",
          "For small tasks, planning is overhead. The rule of thumb: if it would take more than about three steps, or touch more than one file, or produce something someone else will rely on, plan first."
        ]
      },
      {
        h: "Using plans with agents",
        p: [
          "With a tool that can act, planning first also protects your files. You get to see which files it intends to change before anything changes, which is the difference between reviewing a proposal and cleaning up an accident.",
          "The habit is one sentence: 'Plan first, no changes yet.' Then read it properly, correct one thing, and say proceed. If you skip the reading, you have added a step and gained nothing."
        ]
      }
    ],
    worked: {
      h: "Catching a wrong assumption in ninety seconds",
      steps: [
        "Request: 'Plan first, no changes yet. I need the weekly report automated.'",
        "Plan says: 'I'll write a script that reads the sales export from the shared drive every Monday and emails the summary to the team.'",
        "You read it and notice two assumptions: the export is not on the shared drive, and the summary must not go by email — it goes in the team channel.",
        "You correct those two lines and add one constraint: 'never send without showing me the draft first.'",
        "Two lines corrected. Had you let it build, you would have had a script pointed at a folder that does not exist, emailing the wrong place."
      ]
    },
    terms: [
      ["Plan-first", "Asking for the approach before any work is produced, so assumptions are visible while they are cheap."],
      ["Assumption", "Something the work depends on that you did not state. The most valuable line in any plan."],
      ["Scope", "What the work will and will not touch. The boundary that prevents surprise changes."],
      ["Proceed", "The explicit go-ahead after a plan has been reviewed. Not implied by silence."]
    ],
    mistakes: [
      ["Asking for a plan and not reading it", "Read it for assumptions and scope. The value is in the correction, not the artifact."],
      ["Accepting a plan that only restates your request", "Ask: what are you assuming, what will you check, what will you not touch?"],
      ["Planning everything, including trivial tasks", "Plan when it is multi-step, touches files, or someone else relies on it."],
      ["Correcting the plan by starting over", "Fix the one wrong line and proceed."]
    ],
    recap: [
      "Errors are cheapest at the understanding stage; a plan is how you get there early.",
      "Look for assumptions, order, checks and exclusions — not for headings.",
      "Read the plan, correct one line, then say go."
    ]
  },

  5: {
    lead: "The gap between people who get burned and people who do not is not intelligence or caution. It is one repeatable check applied to the part that carries the weight.",
    sections: [
      {
        h: "Why 'it says it's done' is worth nothing",
        p: [
          "A summary is generated text about work, produced by the same mechanism that produced the work. It is not evidence. 'All tests pass' can be true of tests that do not cover the change; 'the figures are correct' can be true of a spreadsheet with a hard-coded total.",
          "This is not dishonesty. The model has no continuous access to the state of the world, and it is optimised to produce a helpful-sounding response. When it says something is finished, it is predicting what someone would say at that point in the conversation.",
          "So the professional habit is narrow and mechanical: trust the artefact, not the summary. Open the file. Read the diff. Click the citation. Look at the cell. It takes a minute and it is the entire difference."
        ]
      },
      {
        h: "Checking the load-bearing claim, not everything",
        p: [
          "You cannot verify everything, and trying turns you into a bottleneck. The skill is identifying the one or two claims that, if wrong, make the whole output worthless. In a report it is the central number or the quote. In a spreadsheet it is the total and the logic of one row. In a plan it is the assumption about demand.",
          "A useful second question, asked out loud: 'what did you not check?' The answer is often more informative than the output, because it names the boundary of the work in the model's own words.",
          "Then write down what you checked. A one-line note — 'checked the total against the sheet, checked the 2024 figure against the ONS page' — is what lets you defend the work later, and it is also what stops you re-checking the same thing in a panic."
        ]
      },
      {
        h: "The three checks that catch most problems",
        p: [
          "Numbers: recompute the one that matters by hand, or ask for the working and follow it. Names and quotes: search them. Dates and versions: check against the current source.",
          "And one structural check that people skip: does the output answer the question that was asked, or a neighbouring question? A beautiful answer to a slightly different question is the most common expensive failure in professional work, and it survives every fact-check."
        ]
      }
    ],
    worked: {
      h: "A one-minute verification that changes the outcome",
      steps: [
        "You asked for a summary of a competitor's pricing from a page you pasted.",
        "Summary: three tiers, £19/£49/£99, annual discount of 20%.",
        "Check one: the £49 figure. Find it on the page. It is £45.",
        "Check two: the discount. The page says 'two months free', which is about 17%, not 20% — the model rounded into a plausible claim.",
        "Outcome: two errors found in sixty seconds, both the kind that would have been challenged in the meeting. The summary was still useful; it was just not evidence."
      ]
    },
    terms: [
      ["Artefact", "The actual output: the file, the diff, the chart, the document. The thing to inspect."],
      ["Load-bearing claim", "The statement the whole output depends on. Check this first."],
      ["Provenance", "Where a number or claim came from. If you cannot state it, you do not have it."],
      ["Verification note", "One line recording what you checked and where. Your defence later."]
    ],
    mistakes: [
      ["Trusting a completion summary", "Read the artefact. Summaries are generated text, not evidence."],
      ["Trying to check everything", "Check the one or two claims that carry the conclusion, and say what remains unverified."],
      ["Fact-checking without checking the question", "First ask: does this answer what I actually asked?"],
      ["Checking silently", "Write the one-line note. It protects you and stops repeat work."]
    ],
    recap: [
      "A summary is a claim; the artefact is the evidence.",
      "Check the load-bearing claim, then ask what was not checked.",
      "One written line about what you verified is professional practice, not paranoia."
    ]
  },

  6: {
    lead: "The people who look fast are not typing faster. They stopped re-explaining themselves and started keeping notes.",
    sections: [
      {
        h: "Why a library beats a memory",
        p: [
          "Every request contains reusable information: who you are, who the audience is, how you want things written, what you never want mentioned. Typing that from scratch each time produces inconsistency and wasted effort, and inconsistency is what makes output feel unreliable.",
          "A library is small by design. Ten to twenty entries: your brief block, a handful of skeletons for the jobs you actually do — summarising a document, turning notes into actions, drafting a reply, writing a formula, briefing a build, reviewing work — and a short list of bans.",
          "The discipline that keeps it useful is pruning. A prompt you have not used in three months is clutter, and clutter is why people stop opening the file. Delete it without guilt; you can write it again in two minutes."
        ]
      },
      {
        h: "Versioning without bureaucracy",
        p: [
          "One note, dated lines, newest at the top. When a prompt changes, keep the old line with a note about why it changed — that history is how you learn what actually matters instead of guessing.",
          "If you work in a team, the library belongs with the project, not in someone's personal notes. Then the improvement compounds for everyone, and new people start from the good version rather than the average one."
        ]
      },
      {
        h: "The log, which is the other half",
        p: [
          "A library is what you reuse. A log is what you learn. Three columns — task, did it work, what I would change — written in ten seconds after the task. Read it weekly.",
          "The log is how you discover that your failures cluster. Most people find they consistently under-specify length, or consistently forget to say who the reader is. That discovery is worth more than any list of prompt tricks, because it is about you."
        ]
      }
    ],
    worked: {
      h: "Building the whole system in fifteen minutes",
      steps: [
        "Create one note: 'AI library'.",
        "Paste your three context lines at the top: who you are, who it is for, what done looks like.",
        "Add two skeletons you already use: a summary request and a notes-to-actions request.",
        "Add a bans line: words and claims you never want to see.",
        "Add a second short section called 'Log' with three column headings.",
        "Use it for a week. At the end of the week, delete anything you did not touch and add anything you retyped twice."
      ]
    },
    terms: [
      ["Prompt library", "A small, pruned set of reusable prompts and context blocks."],
      ["Skeleton", "A prompt with blanks you fill each time. The reusable shape of a recurring job."],
      ["Bans list", "Words, phrases and claims you never want in output. Cheap and very effective."],
      ["Log", "A three-column record of what you tried and what you would change. The learning loop."]
    ],
    mistakes: [
      ["Collecting hundreds of prompts", "Keep the dozen you use. Volume makes the file unreadable."],
      ["Never pruning", "Delete what you have not used in three months."],
      ["Keeping it in your head", "The whole benefit is not reconstructing it under time pressure."],
      ["Logging nothing", "Without the log you cannot see your own repeating mistake."]
    ],
    recap: [
      "Save the context you retype and the prompts you reuse; keep the set small.",
      "Prune on a schedule, or the library becomes a museum.",
      "A three-column log is how the library improves instead of just accumulating."
    ]
  },
};
