/* ============================================================
   DEEPER READING — lessons 33-38
   ============================================================ */

export const DEPTH_F = {
  33: {
    lead: "The best automation candidate is not the most annoying job. It is the one with the most hours times frequency times errors, and no judgement inside it.",
    sections: [
      {
        h: "Finding the candidate properly",
        p: [
          "Draw the process as steps. Label each one decide, transform or move. Only transform and move can be automated; a decide step can be prepared for, never delegated.",
          "Then estimate: minutes per run, runs per month, and how often it goes wrong. Multiply, and you get a number you can put in front of someone. 'Six hours a month' survives a question; 'much faster' does not.",
          "Add the error cost. A step that takes two minutes but produces one wrong invoice a month is a better candidate than a step that takes ten minutes and is harmless.",
          "Finally, check the input quality. If the data arrives inconsistently, the automation will spend its life on exceptions, and a checklist may be the better intervention."
        ]
      },
      {
        h: "The proposal that gets approved",
        p: [
          "Four short parts: the process as it is, the cost of it as it is, the proposed change, and the failure handling. Then the saving, with the arithmetic visible.",
          "Failure handling is what separates a proposal written by someone who has run a process from one written by someone who has read about automation. Bad input, timeouts, duplicates, partial runs: name the behaviour for each.",
          "And name what you deliberately did not automate. That single sentence shows judgement, and it pre-empts the objection that you are trying to remove people from a process that needs them."
        ]
      }
    ],
    worked: {
      h: "A one-page automation proposal",
      steps: [
        "Process as-is: every Monday, export the bookings, reformat four columns, paste into the template, write three sentences, post to the channel. Twenty-five minutes, and about one error every three weeks.",
        "Cost: 25 minutes × 4.3 weeks = 1.8 hours a month, plus roughly 40 minutes of correction.",
        "Proposed: read the export, validate the row count, compute the three numbers, draft the sentences, show me the draft, post after approval.",
        "Failures: export missing → alert and stop. Row count outside 10% of the trailing average → alert and stop. Duplicate run → refuse and log.",
        "Not automated: the three sentences stay draft-only, because tone matters and the number of exceptions is high.",
        "Saving: about two hours a month, and the error rate goes to near zero because the validation step is automatic."
      ]
    },
    terms: [
      ["Process map", "Steps drawn in order, each labelled decide, transform or move."],
      ["Throughput", "How often the process runs. Multiplies the time saving."],
      ["Exception", "An input the process cannot handle normally. The real cost of most automation."],
      ["Validation step", "An automatic check that stops a bad run before it does damage."]
    ],
    mistakes: [
      ["Automating the most annoying step", "Cost it: time × frequency × errors."],
      ["No numbers in the proposal", "Hours per month, with the arithmetic shown."],
      ["No failure handling", "Name the four behaviours before the happy path."],
      ["Automating a decide step", "Prepare it, do not delegate it."]
    ],
    recap: [
      "Map, label, cost. Then choose.",
      "The saving must be arithmetic, and the failures must be designed.",
      "Say what you deliberately left manual."
    ]
  },

  34: {
    lead: "A presentation is one argument in an order the audience can follow. Every slide headline should be a claim, not a label.",
    sections: [
      {
        h: "One sentence first",
        p: [
          "Write the sentence you want repeated back to you afterwards: 'we should delay the launch by six weeks because the payment flow fails on three of the five phone models we tested.' Everything else exists to make that sentence believable.",
          "If you cannot write that sentence, you do not yet have a presentation; you have a status update. That is fine, but it should be an email.",
          "Then each slide proves one part of the sentence. The headline of each slide is the claim it proves, which means a reader who only reads your headlines gets the full argument."
        ]
      },
      {
        h: "What to cut",
        p: [
          "The slide that exists to show how much work you did. The methodology slide nobody asked for. The third example after the point has landed. The 'questions?' slide, which is a wasted opportunity to leave your recommendation on screen.",
          "Cutting is where most of the improvement happens, and it is uncomfortable because the cut material is work you did. The audience's attention is the scarce resource; spending it on your effort rather than their decision is the classic mistake.",
          "Replace the thank-you slide with the ask: the decision, the date, and what you need from them."
        ]
      },
      {
        h: "Rehearsing the questions, not the words",
        p: [
          "Reading your slides aloud is not rehearsal. Rehearsing is writing the three questions you dread and answering them out loud, badly, until they are not frightening.",
          "The questions are predictable: where did the number come from, what if you are wrong, why not the cheaper option, who owns this. Prepare one sentence for each. That preparation is more valuable than a better deck."
        ]
      }
    ],
    worked: {
      h: "Rebuilding a deck around one claim",
      steps: [
        "Old deck: 22 slides, titled by topic — 'Background', 'Method', 'Findings', 'Discussion'.",
        "New claim: 'We should delay the launch six weeks because payments fail on three of five phone models.'",
        "Slides: the failure (one screenshot), how we tested (three lines), what it costs to delay (one number), what it costs to launch anyway (one number), the recommendation, the ask.",
        "Six slides. Every headline is a claim. A reader who only reads headlines has the argument.",
        "Rehearsal: the three questions, answered out loud, three times."
      ]
    },
    terms: [
      ["Claim headline", "A slide title that asserts something rather than labelling a topic."],
      ["Through-line", "The single argument every slide advances."],
      ["The ask", "The decision you want, stated plainly at the end."],
      ["Load-bearing slide", "The slide the decision depends on. Make it undeniable."]
    ],
    mistakes: [
      ["Topic titles", "Make every headline a claim."],
      ["Keeping process slides", "Cut anything that does not advance the argument."],
      ["Rehearsing by reading", "Rehearse the hard questions out loud."],
      ["Ending on 'any questions?'", "End on the decision and the date."]
    ],
    recap: [
      "One sentence, then slides that prove it.",
      "Headlines are claims; the deck is readable without you.",
      "Rehearse the three questions you dread."
    ]
  },

  35: {
    lead: "Build the smallest thing that proves the idea, then work out one answer by hand so you can prove it is right.",
    sections: [
      {
        h: "Smallest version first",
        p: [
          "The first version should do the one thing the idea is about, with no settings, no accounts, no options, and no design system. If the idea is a calculator that converts a quote into a price, it needs three inputs and one output.",
          "Then write down what you deliberately left out. That list is not an apology; it is evidence that you understood the scope and chose it. It also becomes the next version's backlog.",
          "This is the same discipline as the six-line brief, pointed at software: a finished state, a boundary, and a check."
        ]
      },
      {
        h: "The hand-worked example",
        p: [
          "Before you build, compute one answer yourself with a pen. Then when the tool produces a different answer, you know which is wrong and where to look.",
          "Without that example you can only judge whether it looks right, which is how people ship tools that produce confident wrong numbers. With it, you can say 'this is wrong, the right answer is 42, here is the input that breaks it'.",
          "That sentence is also what makes you the person in charge of the tool rather than its user."
        ]
      },
      {
        h: "Input you did not choose",
        p: [
          "Real input is empty, misspelled, negative, duplicated, in the wrong unit, and pasted with whitespace. A tool that crashes on an empty field is not finished; it is a demo.",
          "Handle bad input visibly: show what was wrong and what to do. A silent fallback that guesses is worse than an error message, because the guess looks like a result."
        ]
      }
    ],
    worked: {
      h: "A small tool, built and proven",
      steps: [
        "Idea: a page that works out the cost of a print run from quantity, pages and colour.",
        "Hand-worked example: 250 copies × 12 pages single-sided at £0.04 per side = £120. Written down before building.",
        "Smallest version: three number inputs, one output, no styling beyond legibility.",
        "Test: enter the hand example. Output must be £120.",
        "Test the edges: blank quantity → message, not NaN. Negative pages → message. Zero → £0 with a note.",
        "Then, and only then, make it look decent."
      ]
    },
    terms: [
      ["Smallest version", "The build that proves the idea with nothing extra."],
      ["Hand-worked example", "An answer you calculated yourself, used as the test."],
      ["Edge case", "Bad or unusual input the tool must handle visibly."],
      ["Scope list", "What you deliberately left out, and why."]
    ],
    mistakes: [
      ["Building settings first", "One job, no options, then expand."],
      ["No hand-worked answer", "You can only judge appearance without one."],
      ["Crashing on empty input", "Bad input is normal. Handle it visibly."],
      ["Silent guessing", "An error message beats a plausible wrong number."]
    ],
    recap: [
      "Smallest version that proves the idea; list what you left out.",
      "One answer by hand, then compare.",
      "Bad input is the normal case, and it must fail loudly."
    ]
  },

  36: {
    lead: "Debugging is a procedure, not a mood. Read the exact error, shrink the problem, change one thing, check again.",
    sections: [
      {
        h: "Read the actual message",
        p: [
          "The single most expensive habit is paraphrasing an error. 'It says something about undefined' contains none of the information you need. Copy the exact text, including the file and the line number.",
          "Most errors name the thing that is wrong. People skip the message because it is unfamiliar, then spend ten minutes guessing at things it already ruled out.",
          "If the message is genuinely cryptic, search the exact string. Someone has had it before, and the answer is usually in the first result."
        ]
      },
      {
        h: "Shrink until it is obvious",
        p: [
          "Delete everything except the part that fails. A minimal reproduction makes the cause visible, because the cause is usually a thing you assumed was unrelated — and you have just removed all the unrelated things.",
          "This is faster than reading code, and it works on documents, spreadsheets and processes as well as software: cut the example down until the failure disappears, then add back the last piece.",
          "Once you have a minimal case, change one thing at a time. Two simultaneous changes and you have learned nothing, even if it starts working."
        ]
      },
      {
        h: "Asking for help without wasting the answer",
        p: [
          "Give the exact error, the smallest input that reproduces it, what you expected, and what you have already ruled out. The last one is what stops the advice you already tried.",
          "Ask for ranked hypotheses with a cheap test for each. That converts a conversation into a procedure, and you learn the diagnostic pattern rather than just the fix."
        ]
      }
    ],
    worked: {
      h: "A stuck bug, worked through",
      steps: [
        "Symptom: 'the page is blank sometimes'.",
        "Read the console: 'Uncaught TypeError: cannot read properties of null (reading addEventListener)' at app.js line 41.",
        "Line 41 refers to an element that only exists on one page. You had assumed every page had it.",
        "Minimal case: load the other page with only that line. It fails. Confirmed.",
        "Fix: guard the element, or move the code into the page where it belongs. One change, then re-check both pages.",
        "Add a note in the rules file: 'page-specific scripts must be loaded only on their page.'"
      ]
    },
    terms: [
      ["Stack trace", "The list of where an error occurred. Read it top-down for the first line in your code."],
      ["Minimal reproduction", "The smallest input that still fails. The fastest diagnostic."],
      ["Hypothesis", "A specific, testable guess about the cause."],
      ["Regression", "A bug you fixed that came back, usually because the cause was not the cause."]
    ],
    mistakes: [
      ["Paraphrasing the error", "Copy it exactly, with the line number."],
      ["Changing several things at once", "One change, then check."],
      ["Guessing without shrinking", "Delete until the failure is obvious."],
      ["Asking 'fix it' with no context", "Give the error, the minimal case, the expectation, and what you ruled out."]
    ],
    recap: [
      "Exact error, then shrink, then one change at a time.",
      "A minimal reproduction is the fastest route to the cause.",
      "Ranked hypotheses with cheap tests beat open-ended requests."
    ]
  },

  37: {
    lead: "Privacy is a habit, not a policy you read once. Three lines written down, and one real rehearsal, is enough to make it automatic.",
    sections: [
      {
        h: "What never leaves your machine",
        p: [
          "Personal data about other people, client information covered by a contract, credentials, unpublished financials, anything said in confidence. This is not about distrusting a vendor; it is that you cannot un-share, and the consequences belong to you.",
          "The practical rule is substitution: replace the identifying detail with a placeholder that keeps the structure. 'Client A', 'the supplier', 'employee 3'. If you need the pattern, the placeholder is enough. If you need the identity, the work probably should not be in a consumer tool.",
          "Check your organisation's or institution's policy before the first time, not after. One question to a tutor or manager is cheap."
        ]
      },
      {
        h: "Disclosure, in one line",
        p: [
          "Say what it helped with and what you decided. 'Drafted with an AI assistant, checked and rewritten by me' is enough, and it is increasingly expected rather than penalised.",
          "The risk is not the tool. It is the silence that makes the tool look like something to hide, and the surprise when it surfaces later.",
          "Disclosure also protects you professionally: it sets the expectation that you verified the output, because you said you did."
        ]
      }
    ],
    worked: {
      h: "Three lines, one rehearsal",
      steps: [
        "Line 1, never: 'Names, emails, client commercial terms, payroll, anything marked confidential.'",
        "Line 2, substitute: 'Use Client A, Supplier B, Employee 3. Keep the structure; drop the identity.'",
        "Line 3, disclose: 'One line in the document: what the tool helped with and what I decided.'",
        "Rehearsal: take one real document, strip it, use it, restore the detail yourself. Doing it once is what turns an intention into a habit.",
        "Save the three lines where you will see them: top of your notes file."
      ]
    },
    terms: [
      ["Personal data", "Information that identifies a living person. Handle as confidential by default."],
      ["Placeholder", "A stand-in that preserves structure without the identity."],
      ["Data minimisation", "Supplying only what the task needs, and nothing identifying."],
      ["Disclosure", "A plain statement of what a tool helped with."]
    ],
    mistakes: [
      ["'It's internal, so it's fine'", "Internal is not a permission. Check policy and minimise."],
      ["Deleting names afterwards", "You cannot un-share. Substitute before pasting."],
      ["Never disclosing", "Silence is the risk, not the use."],
      ["Reading the policy after an incident", "Ask before the first time."]
    ],
    recap: [
      "Never: personal data, client terms, credentials, confidential material.",
      "Substitute placeholders and keep the structure.",
      "One line of disclosure, every time."
    ]
  },

  38: {
    lead: "You do not need a plan for the next year. You need three commitments with a day and a time attached, and one of them involves another person.",
    sections: [
      {
        h: "Three commitments, not ten",
        p: [
          "One daily habit: ten minutes on a real task, one line logged. One artefact: something you build or write by day thirty that did not exist before. One person: a lesson taught, which is the test of whether you actually know it.",
          "Three is the number because it survives a bad week. Ten commitments collapse at the first busy Tuesday and then all of them feel broken.",
          "Attach each to a specific day and time. 'Monday, 9:15, ten minutes, the weekly report' happens. 'Regularly' does not."
        ]
      },
      {
        h: "What to expect, honestly",
        p: [
          "The first two weeks feel slow, because you are unlearning the search-box habit. Around week three the brief starts coming out automatically, and the correction rounds drop. That is the point at which most people stop noticing progress and quit, so expect it.",
          "There will also be a failure that shakes your confidence: a number you repeated without checking, or a change you did not review. Write it in the log, add a rule, and continue. That is the whole professional response.",
          "And keep one thing manual on purpose. The judgement layer is not a phase you graduate from; it is the part that stays."
        ]
      }
    ],
    worked: {
      h: "The plan, written out",
      steps: [
        "Habit: Monday to Friday, 9:15, ten minutes, one real task, one line in the log.",
        "Artefact by day 30: a one-page tool or a rewritten document that uses the six-line brief, the verification habit and one hand-checked number.",
        "Person: explain the six-line brief to one classmate or colleague in ten minutes, and ask them to point out where it was unclear.",
        "Review date: day 30, read the log, delete what you did not use, keep what worked.",
        "One rule that survives the month: never accept a number you cannot trace."
      ]
    },
    terms: [
      ["Habit anchor", "A specific time and place attached to the behaviour."],
      ["Artefact", "Something that exists at the end, which you can show."],
      ["Teach-back", "Explaining it to someone else. The test of understanding."],
      ["Review date", "A scheduled point to prune the system and keep what worked."]
    ],
    mistakes: [
      ["Ten commitments", "Three, attached to specific times."],
      ["A goal with no first step", "Name the day, the time, and the task."],
      ["Quitting at week three", "That is when the habit is forming and progress feels invisible."],
      ["Delegating the judgement layer", "Keep what matters, accountability and care."]
    ],
    recap: [
      "One habit, one artefact, one person taught. With dates.",
      "Expect a slow start and one confidence-shaking failure. Log both.",
      "Judge the system at day 30, prune it, and keep the judgement yours."
    ]
  },
};
