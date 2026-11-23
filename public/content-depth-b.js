/* ============================================================
   DEEPER READING — lessons 7-12
   Same shape as part A: how it works, a worked example, the words,
   the mistakes, and a recap worth testing yourself against.
   ============================================================ */

export const DEPTH_B = {
  7: {
    lead: "Most 'AI is useless for this' conclusions come from using the wrong surface, not the wrong model.",
    sections: [
      {
        h: "Two different products sharing a name",
        p: [
          "A chat window can only reason about what is in the conversation. That makes it excellent for thinking: explaining a concept, arguing with your draft, planning, quizzing you, turning messy notes into structure.",
          "An agent — a tool with file access, a terminal, a browser, or your calendar — can act. It reads the actual document, edits the actual file, runs the actual code. That makes it right for doing: changing a spreadsheet, building a page, finding what is in a folder, running a check.",
          "The failure mode is using chat for a job that lives in files. You paste a summary of the spreadsheet, the model reasons about the summary, and the answer is subtly wrong because the real cells were never in the room. The reverse failure is using an agentic tool for a thinking task: slower, more expensive, and it starts changing things you only wanted to discuss."
        ]
      },
      {
        h: "How to choose in five seconds",
        p: [
          "Ask: does this job need my real material, or only my thinking? If the answer involves the current state of a file, a folder, a system or an account, you need a surface that can see it. If it involves judgement, explanation or drafting, chat is faster.",
          "A second question: does it need to remember across sessions? If yes, that belongs in a project note or a saved instruction file, not in a conversation you will lose."
        ]
      }
    ],
    worked: {
      h: "Same task, wrong surface versus right surface",
      steps: [
        "Task: 'Find the three students in this spreadsheet who are behind on submissions and draft each a polite reminder.'",
        "Chat version: you paste 40 rows as text, the model guesses at names and rows because the paste lost formatting, and one reminder goes to the wrong person. You spend longer checking than doing.",
        "Agent version: you point it at the file, it reads the columns, and it prints the three rows it thinks qualify before drafting anything. You check three rows instead of forty.",
        "The draft still needs your review — tone, facts, whether the reminder is even appropriate. The surface changed the reliability of the input, not the quality of the writing."
      ]
    },
    terms: [
      ["Surface", "Where you are working: a chat, an editor with file access, a terminal agent, a browser agent."],
      ["Agent", "A model with tools and a loop, so it can act and check rather than only answer."],
      ["Grounding", "Supplying the actual material so the answer rests on it instead of on assumptions."],
      ["Tool call", "One action an agent takes — read a file, run a command, fetch a page."]
    ],
    mistakes: [
      ["Pasting a summary and expecting file-level accuracy", "Give the tool the file itself."],
      ["Using an agent for a conversation", "If nothing should change, chat is cheaper and safer."],
      ["Assuming agents are simply better", "They are better at acting and worse at staying put. Match the surface to the job."],
      ["Forgetting that a new session has no memory", "Put durable context in a project note."]
    ],
    recap: [
      "Chat is for thinking; an agent is for acting on real material.",
      "Pasting a summary loses the detail that made the answer right or wrong.",
      "Ask whether the job needs real material or just your judgement."
    ]
  },

  8: {
    lead: "Wishes cannot be finished. Tasks can. Almost every frustrating session is a wish wearing a task's clothes.",
    sections: [
      {
        h: "The test for a real task",
        p: [
          "A task has a finished state you could recognise from the outside, and it says what may not change. 'Improve my CV' has neither. 'Rewrite the summary section in under 70 words for a retail manager role, keep every date and job title exactly as written' has both.",
          "The boundary matters as much as the goal. Without it, improvement is unbounded: the model will also reword your job titles, reorder your education, and add a skills section with three skills you do not have. Every one of those is a defensible interpretation of 'improve'.",
          "A good test before you send: could a stranger tell whether this is done, without asking me anything? If not, it is still a wish."
        ]
      },
      {
        h: "Splitting work so it can be checked",
        p: [
          "Big requests produce impressive partial work. A model asked to 'redo the whole project' will produce something that looks complete, with gaps you discover later. Split until each piece has a visible finish line and can be checked in under five minutes.",
          "The split is usually by output, not by effort: the outline, then section one, then section two, then the conclusion, then the edit pass. Each is separately reviewable, and a mistake in the outline does not contaminate four sections before you notice.",
          "For file work, the split is by file or by function. One change, one review, one commit. This is also how you keep a working state you can return to."
        ]
      }
    ],
    worked: {
      h: "Rewriting one vague request into three checkable tasks",
      steps: [
        "Wish: 'Make my business plan better.'",
        "Task 1: 'Read the plan and list the five claims a reader would challenge first, with the section and page. Do not rewrite anything.' (Output: a list. Checkable: yes.)",
        "Task 2: 'For claim 3 only, tell me what evidence would settle it and where to find it. No writing yet.' (Output: a research direction.)",
        "Task 3: 'Rewrite section 4's opening paragraph, 90 words, using only these two figures, keeping my sentence style.' (Output: one paragraph. Checkable in thirty seconds.)",
        "Three tasks, three reviews, no moment where you are staring at a rewritten plan wondering what changed."
      ]
    },
    terms: [
      ["Acceptance criterion", "A condition a reviewer can test. The core of a task."],
      ["Boundary", "What must not change. Often more important than the goal."],
      ["Chunk", "A piece of work small enough to finish and check in one sitting."],
      ["Definition of done", "The sentence that lets someone else decide whether this is finished."]
    ],
    mistakes: [
      ["Asking for 'better'", "Name the dimension: shorter, clearer, more evidence, specific audience."],
      ["No boundary on what may change", "State what must stay the same. Otherwise everything is fair game."],
      ["One enormous request", "Split by output until each piece is checkable."],
      ["Judging by looks instead of criteria", "Write the criterion first, then judge against it."]
    ],
    recap: [
      "A task has a recognisable finish and a boundary.",
      "Without a boundary, 'improve' quietly means 'change everything'.",
      "Split by output so each piece can be checked in minutes."
    ]
  },

  9: {
    lead: "A file in the folder is worth a paragraph in the chat, because it survives the conversation.",
    sections: [
      {
        h: "What a project note does",
        p: [
          "Anything working inside a folder starts from zero knowledge about it. It does not know what the project is for, which files are sacred, which commands matter, or what convention the code or the writing follows. So it guesses, and guesses are where wrong edits come from.",
          "A short note removes the guessing. Two or three lines is often enough: what this is, who it is for, what not to touch. More useful still: the commands that matter, the conventions, and how to check a change.",
          "The note also acts as a boundary that outlives the chat. Instructions given in a conversation disappear when the conversation does; a file in the folder is read every time."
        ]
      },
      {
        h: "Keeping it honest",
        p: [
          "A stale note is worse than none, because it creates confidence in wrong information. Date it, and prune it when reality changes. The test is simple: could someone follow this note and do the right thing today?",
          "Resist the urge to write an essay. Long instructions get skimmed by humans and diluted by models. Bullet lines that can be checked are more useful than paragraphs of aspiration."
        ]
      }
    ],
    worked: {
      h: "The two-line note that stops the wrong edits",
      steps: [
        "Create a file called NOTES.md in the project folder.",
        "Line 1: 'This is my dissertation data folder. The files in /raw are original exports — never edit them.'",
        "Line 2: 'Working files go in /work. The final analysis is analysis.xlsx and it is the only file my supervisor sees.'",
        "Add one line: 'If a change would alter a raw file, stop and tell me instead.'",
        "Now every session starts knowing the boundary. You have removed the single most likely bad outcome without writing any code."
      ]
    },
    terms: [
      ["Project note", "A short file describing the project, read before work begins."],
      ["Convention", "A house rule about how things are named, ordered or formatted."],
      ["Read-only", "Material that must not be edited, only read. Say so explicitly."],
      ["Verification step", "The command or check that proves a change worked."]
    ],
    mistakes: [
      ["No note at all", "Two lines today prevents tomorrow's wrong edit."],
      ["A note nobody could follow", "Make each line checkable and current."],
      ["Writing it once and never updating", "Date it and prune it. Stale rules get ignored."],
      ["Putting boundaries only in the chat", "Put them in the folder where they persist."]
    ],
    recap: [
      "Anything working in a folder starts ignorant; the note is its briefing.",
      "State what must never be touched, not just what you want.",
      "Short, current and checkable, or it will be ignored."
    ]
  },

  10: {
    lead: "A formula is a rule written down. The hard part is never the syntax; it is admitting what should happen when the data is missing.",
    sections: [
      {
        h: "Say the rule before you ask for it",
        p: [
          "Most spreadsheet requests fail because the requester has not decided the rule. 'Calculate growth' is not a rule. 'This month minus last month, divided by last month, and blank if last month is zero or empty' is a rule.",
          "Writing it in words forces the edge cases into the open: blanks, zeros, negatives, text in a number column, duplicate rows, dates stored as text. These are not corner cases in real spreadsheets — they are most of the rows.",
          "Once the rule is written, the formula is mechanical. And because you wrote the rule, you can test it: pick one row, compute it by hand, compare."
        ]
      },
      {
        h: "Why hand-checking one row is non-negotiable",
        p: [
          "A plausible-looking formula produces plausible-looking numbers. If it is wrong, everything downstream is wrong and nothing looks wrong. One hand-worked row is the only cheap proof that the logic matches the intention.",
          "Choose a row with an awkward feature if you can — a blank, a zero, a negative. That single row tests the edge case you were most likely to get wrong.",
          "For anything someone else will rely on, add a visible note in the sheet: what the column means, what blanks mean, and which row you checked. It takes a minute and it is what separates a working file from a confident one."
        ]
      }
    ],
    worked: {
      h: "From a sentence to a tested formula",
      steps: [
        "Rule in words: 'Percentage change from last month to this month. Blank if last month is blank or zero. Show one decimal place.'",
        "Formula: =IF(OR(B2=\"\",B2=0),\"\",(C2-B2)/B2) formatted as a percentage with one decimal.",
        "Test row: last month 200, this month 250 → 25%. Check by hand: 50/200 = 0.25. Correct.",
        "Test the awkward row: last month blank → shows blank, not #DIV/0!. Correct.",
        "Add the header note: 'MoM % change; blank where last month is missing or zero.'",
        "Now the sheet can be defended, because the rule, the formula and the test all agree."
      ]
    },
    terms: [
      ["Edge case", "Blank, zero, negative, duplicate or wrongly typed input. Most real rows are edge cases."],
      ["IF / OR", "The functions that turn a rule's exceptions into visible behaviour instead of errors."],
      ["Absolute reference", "A cell reference locked with $ so it does not shift when copied."],
      ["Hand check", "Computing one row yourself to prove the formula's logic."]
    ],
    mistakes: [
      ["Asking for a formula before deciding the rule", "Write the rule in words, including exceptions."],
      ["Ignoring blanks", "Say what a blank should show. Errors in a sheet destroy trust fast."],
      ["Copying down without checking one row", "Hand-compute one row, preferably an awkward one."],
      ["Hiding logic in a hard-coded total", "Totals must be formulas, or nobody can audit them."]
    ],
    recap: [
      "Rules first, formulas second. Edge cases are part of the rule.",
      "One hand-worked row, ideally an awkward one, is the proof.",
      "Document what blanks mean, in the sheet itself."
    ]
  },

  11: {
    lead: "A dashboard without a decision is decoration with a database behind it.",
    sections: [
      {
        h: "Start from the decision",
        p: [
          "Finish this sentence before you build anything: 'Because of this screen, we will decide whether to ___.' If you cannot, you do not need a dashboard; you need a question. Most requests for dashboards are really requests for clarity about what matters.",
          "Once the decision is named, the metrics choose themselves. A decision about staffing needs volume and waiting time. A decision about pricing needs conversion by tier and margin. A decision about whether a campaign worked needs a comparison against a baseline, not a big number.",
          "Three metrics is a good ceiling. A screen that shows everything changes nothing, because the reader has to do the analysis you were supposed to do."
        ]
      },
      {
        h: "Honesty in the numbers",
        p: [
          "Every number must come from the file. Nothing estimated, nothing rounded into a nicer story. And every dashboard needs two lines underneath it: where the numbers come from, and what it does not show.",
          "'What this doesn't show' is the most professional thing on the page. It pre-empts the question that would otherwise undermine you, and it demonstrates that you know the limits of your own evidence.",
          "Check one number by hand before you present. Always one. If the total in the chart does not match the total in the sheet, everything else on screen becomes suspect, including the parts that are right."
        ]
      }
    ],
    worked: {
      h: "Turning a data dump into one decision screen",
      steps: [
        "Decision: 'Should we keep running the Tuesday workshop?'",
        "Three metrics: attendance as a share of sign-ups, cost per attendee, and repeat attendance.",
        "One comparison: this term against the same term last year, because seasonality would otherwise look like decline.",
        "One hand check: total attendees across the chart equals the row count in the export.",
        "Two footer lines: 'Source: bookings export, 1 Sep–30 Nov' and 'Does not include walk-ins, which are recorded on paper.'",
        "Now the screen supports a decision and cannot be embarrassed by one obvious question."
      ]
    },
    terms: [
      ["Decision-led", "Designing the view around a choice someone has to make."],
      ["Baseline", "The comparison period or group. Without one, a number means nothing."],
      ["Provenance", "The stated source and date range of the data."],
      ["Limitation note", "The honest line about what the view does not cover."]
    ],
    mistakes: [
      ["Building before naming the decision", "Write the sentence first. If it will not finish, stop."],
      ["Showing every metric", "Three that change the decision."],
      ["No baseline or date range", "A number with no comparison is a rumour."],
      ["No limitation note", "Pre-empt the question that would undermine the work."]
    ],
    recap: [
      "Name the decision. Then the metrics.",
      "Provenance and a 'what this doesn't show' line are part of the deliverable.",
      "Hand-check one number before anyone else sees it."
    ]
  },

  12: {
    lead: "Research help is genuinely powerful, and it has one failure mode that can end a project: a citation that does not exist.",
    sections: [
      {
        h: "What the tool can and cannot do",
        p: [
          "It can orient you fast: the terms people use, the shape of the debate, the questions a good study would ask, the obvious objections, where to look. That is real value, and it saves hours.",
          "It cannot be your source unless it is actually reading a source. Without retrieval or a document you supplied, it is producing the shape of an answer from training data, and training data does not include a live check that a paper exists.",
          "Even with retrieval, the link may be real and the claim may be a misreading. Retrieval fixes invented links; it does not fix invented interpretation."
        ]
      },
      {
        h: "The three-source rule",
        p: [
          "For any claim that matters, get three kinds of source: a primary document (the report, the paper, the filing), an independent critic or replication, and a practitioner account of what happened in practice. Label which is which.",
          "Where they agree, you can be reasonably confident. Where only the vendor agrees with itself, you have marketing. Where they disagree, the disagreement is usually the most interesting part of your report, and naming it makes your work stronger rather than weaker.",
          "And ask for the thing that would overturn the conclusion. A source set with no falsifying condition is a belief, not research."
        ]
      }
    ],
    worked: {
      h: "A research request that survives scrutiny",
      steps: [
        "Request: 'I'm writing about whether four-day weeks affect productivity. Give me the main terms researchers use, the two strongest opposing findings, and what a credible study would need to control for. Every factual claim needs a link I can open; say unverified rather than guessing.'",
        "You get orientation, plus links. You open the two that carry the argument.",
        "One link is a think-tank summary rather than the study. You follow it to the original and read the method section.",
        "You notice the sample is self-selected companies, which the summary omitted. That is now a limitation paragraph in your report.",
        "The model did the finding; you did the reading. That division of labour is what makes the result defensible."
      ]
    },
    terms: [
      ["Primary source", "The original document, dataset or study, not a description of it."],
      ["Retrieval", "Giving the model documents or search results so answers rest on real material."],
      ["Replication", "A second study reaching a similar result. Stronger evidence than one finding."],
      ["Falsifying condition", "What evidence would prove the conclusion wrong. Ask for it every time."]
    ],
    mistakes: [
      ["Accepting citations without opening them", "Open the two or three the argument depends on."],
      ["Stopping at the summary of a study", "Read the method and the sample. That is where limits live."],
      ["Averaging disagreeing sources", "Show both, say which is better evidenced, explain why it matters."],
      ["No falsifying condition", "Ask what would change the conclusion. If nothing would, it is not research."]
    ],
    recap: [
      "Use the tool to orient and to interrogate; get evidence from sources you open.",
      "Three kinds of source, labelled. Vendor-only agreement is marketing.",
      "Always ask what evidence would overturn the conclusion."
    ]
  },
};
