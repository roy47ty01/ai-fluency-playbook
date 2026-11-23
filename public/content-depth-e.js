/* ============================================================
   DEEPER READING — lessons 27-32
   ============================================================ */

export const DEPTH_E = {
  27: {
    lead: "Ten minutes on real work, five days a week, with one line written down. That is the whole method, and it beats a weekend of reading.",
    sections: [
      {
        h: "Why the log is the mechanism",
        p: [
          "Reading gives you recognition: 'yes, that makes sense'. Skill needs retrieval and correction, which only happen when you try something and see what comes back. The log is where the correction gets recorded, so it can change your next attempt.",
          "Three columns are enough: task, did it work, what I would change. Written in ten seconds, immediately after, not at the end of the week when the detail is gone.",
          "Read the log weekly and look for a pattern rather than a lesson. Most people find one repeated failure — usually under-specifying the audience or the length — and fixing that one thing improves everything at once."
        ]
      },
      {
        h: "What to practice on",
        p: [
          "Not exercises. Real tasks you were going to do anyway: the reply you owe, the reading you need to understand, the formula you need, the notes you have to turn into actions. Practice only sticks when the output matters to you.",
          "Start with low-stakes, reversible work. Drafts, summaries, explanations, planning. Move to anything with consequences only once the habits are automatic.",
          "Five days matters more than ten minutes. Spacing is what makes memory durable; a single long session produces familiarity, not skill."
        ]
      }
    ],
    worked: {
      h: "The first five days, concretely",
      steps: [
        "Day 1: turn one messy email thread into 'decisions, open questions, who owes what'. Log: worked, but it invented an owner — check names next time.",
        "Day 2: ask for an explanation of a concept from your course, then explain it back in your own words and ask what you got wrong. Log: the explanation was too general; ask for an example first.",
        "Day 3: draft a 120-word update with a six-line brief. Log: first version was usable, because the brief existed.",
        "Day 4: ask for a formula with the blank case stated. Hand-check one row. Log: correct on the first attempt.",
        "Day 5: write a five-line handoff and start a fresh chat. Log: quality jumped; the old chat had been quietly repeating itself."
      ]
    },
    terms: [
      ["Retrieval practice", "Recalling or applying something from memory. Produces durable learning; rereading does not."],
      ["Spacing", "Short sessions across days instead of one long one."],
      ["Feedback loop", "Trying, observing the result, and adjusting. The log is the record of it."],
      ["Pattern", "A repeated failure across tasks. More valuable than any single lesson."]
    ],
    mistakes: [
      ["Practising on exercises", "Use real work, or the learning does not transfer."],
      ["Logging at the end of the week", "Log immediately, in one line."],
      ["Writing essays in the log", "Three columns. Speed is what keeps it alive."],
      ["Doing one long session", "Five short days beats one long one for retention."]
    ],
    recap: [
      "Ten minutes, real task, one line logged. Five days, not one.",
      "Look for your repeated failure weekly; fix that one thing.",
      "Start reversible and low-stakes; earn the right to use it on what matters."
    ]
  },

  28: {
    lead: "Email and meetings are where AI pays for itself fastest and where a careless paste does the most damage.",
    sections: [
      {
        h: "The two highest-return jobs",
        p: [
          "Turning a messy thread into structure: what was decided, what is still open, who owes what. This is mechanical, checkable, and saves the fifteen minutes you would spend rereading.",
          "Turning notes into actions with owners and dates. Also mechanical, also checkable, and the check is the whole job — owners are the thing a model most often invents.",
          "Notice what these have in common: they restructure information that already exists. They do not generate commitments, and they do not send anything."
        ]
      },
      {
        h: "Privacy before convenience",
        p: [
          "A thread contains names, sometimes clients, sometimes things said in confidence. Replace names with roles before pasting, or use a tool that operates inside your organisation's boundary.",
          "This is not paranoia about the vendor. It is that pasting identifiable client information into a consumer tool may breach a contract or a policy you have not read, and the consequences land on you rather than the tool.",
          "Placeholders work perfectly: 'Client A', 'Manager', 'the supplier'. The structure is what you need; the identities are not."
        ]
      },
      {
        h: "The send button stays yours",
        p: [
          "Drafting is cheap and reversible. Sending is neither, and a wrong recipient or a wrong tone costs more than the time saved.",
          "The habit: draft, read it as the recipient, check every name and number, then send yourself. Thirty seconds, and you keep the speed without the risk."
        ]
      }
    ],
    worked: {
      h: "Thread to actions, safely",
      steps: [
        "Remove names: 'Client A asked for the revised quote by Friday. Manager B wants the timeline confirmed.'",
        "Ask: 'Turn this into decisions, open questions, and actions with an owner and a date. Mark anything you are inferring with [inferred]. Do not add owners who are not named.'",
        "Check the output against the thread: two actions, one owner each, no invented names.",
        "Send the summary to the thread yourself, with one line: 'Summary below — correct me if I have misread anything.'",
        "That last line is what makes the summary safe: it invites correction rather than asserting authority."
      ]
    },
    terms: [
      ["Structuring", "Turning prose into decisions, questions and actions. A safe, high-value use."],
      ["Placeholder", "A stand-in like 'Client A' that preserves structure without the identity."],
      ["Provenance", "Where a claim came from — here, the original thread."],
      ["Human send", "The rule that the irreversible step is done by a person."]
    ],
    mistakes: [
      ["Pasting identifiable client data", "Replace names with roles first."],
      ["Auto-sending drafts", "Draft automatically, send manually."],
      ["Trusting invented owners", "Check every name against the source."],
      ["No correction invitation", "Ask recipients to correct the summary."]
    ],
    recap: [
      "Restructure existing information; do not generate commitments.",
      "Placeholders before paste. Policy before convenience.",
      "The send button is the human step, every time."
    ]
  },

  29: {
    lead: "Do not ask for a summary of a long document. Ask for its skeleton, its load-bearing assumptions, and which two pages you must read yourself.",
    sections: [
      {
        h: "Why summaries fail you",
        p: [
          "A summary compresses by removing detail, and detail is usually where the interest is: the caveat, the sample size, the assumption in a footnote. You finish the summary feeling informed and unable to answer a question about the argument.",
          "Worse, a summary is derived text. If the model has misread one section, the summary presents the misreading confidently and you have no way to see it.",
          "What you actually need is a map: what each section is doing, what the whole thing rests on, and where the weak points are. Then you read the two pages that carry the weight."
        ]
      },
      {
        h: "The three asks",
        p: [
          "One: 'In one line each, what job does each section do?' That gives you the architecture without the content.",
          "Two: 'What does the whole argument rest on? Name the two or three assumptions that, if false, break it.' That is the highest-value question you can ask about any document.",
          "Three: 'Which two pages should I read myself, and why those?' Then actually read them, by hand, at full attention."
        ]
      },
      {
        h: "Then argue with it",
        p: [
          "Once you have the map, ask what the document does not cover and who would disagree. A tutorial question is usually about the boundary of the evidence, and the boundary is exactly what a document leaves out.",
          "This is also the honest way to use AI on assigned reading: you still read the part that matters, you just spend less time lost in the parts that do not."
        ]
      }
    ],
    worked: {
      h: "Forty pages in twenty minutes",
      steps: [
        "Ask for the section map and the load-bearing assumptions. Read both lists carefully — this is five minutes well spent.",
        "Ask which two pages to read. Read them with a pen, marking the claims.",
        "Check one number or quote in the document against its stated source.",
        "Ask: 'What does this document not cover, and what would a sceptical reviewer challenge first?'",
        "Write your own two-sentence position. If you cannot, you have not understood it yet, whatever the summary said."
      ]
    },
    terms: [
      ["Skeleton", "The job each section does, in one line each."],
      ["Load-bearing assumption", "The belief the argument stands on. If false, the conclusion fails."],
      ["Derived text", "Output produced from another text. Carries its misreadings forward."],
      ["Boundary", "What the evidence does not cover. Where most critiques land."]
    ],
    mistakes: [
      ["Asking for a summary", "Ask for structure, assumptions and the pages to read."],
      ["Never reading the source", "Read the two pages that carry the argument."],
      ["Checking no numbers", "Verify one against the document's own source."],
      ["Skipping the critique question", "The gaps are what a marker or a manager asks about."]
    ],
    recap: [
      "Map, assumptions, two pages. That is the reading method.",
      "A summary cannot tell you what a document is wrong about.",
      "Finish by writing your own position in two sentences."
    ]
  },

  30: {
    lead: "AI can help you understand and practise. It cannot do the understanding for you, and anything you cannot defend out loud is a risk you are carrying.",
    sections: [
      {
        h: "The order that teaches you something",
        p: [
          "Read the source first, by hand. Then use AI to quiz you on it: 'ask me five questions about this, one at a time, and tell me what I got wrong.' Then write your own answer without help. Then ask it to attack your argument.",
          "That order produces understanding, because the thinking happens in your head. The reverse order — get the answer, then read to check it — produces recognition: you can follow the argument and cannot reproduce it.",
          "The difference shows up in a viva, an interview, or a group discussion, which is exactly where grades and jobs are decided."
        ]
      },
      {
        h: "What defensible means",
        p: [
          "You can explain the reasoning, answer a follow-up, and say where the evidence came from. If any of those three fail, the work is not yours yet — and the risk is not the tool, it is that you will be asked and will not be able to answer.",
          "Disclosure is part of being professional: one line saying what it helped with. Most policies allow substantially more than students assume, provided it is declared. The problems come from silence, not from use."
        ]
      },
      {
        h: "Checking it against your course",
        p: [
          "Read your own institution's policy, because it varies enormously. Ask your tutor if it is unclear — that question is normal and it protects you.",
          "When AI contradicts your lecture notes, treat neither as automatically right. Go to the primary source. Confident, general explanations are exactly the kind that quietly disagree with the specific version your course is teaching."
        ]
      }
    ],
    worked: {
      h: "Studying a topic without cheating yourself",
      steps: [
        "Read the assigned chapter, by hand. Fifteen minutes, no tool.",
        "Ask for an explanation aimed at your level, then explain it back in three sentences and ask what you got wrong.",
        "Ask for five exam-style questions, one at a time. Answer from memory, before looking.",
        "Write your own 200-word answer. Then ask for the strongest objection to it.",
        "Add one line to the assignment: 'I used an AI assistant to quiz me and to critique a draft; the argument and wording are mine.'"
      ]
    },
    terms: [
      ["Recognition", "Following an explanation and feeling you understand it. Not the same as recall."],
      ["Recall", "Producing the idea without prompting. What exams and interviews test."],
      ["Defensible", "You can explain the reasoning, answer follow-ups, and cite the evidence."],
      ["Disclosure", "A plain statement of what a tool helped with."]
    ],
    mistakes: [
      ["Getting the answer first", "Read, then quiz, then write. The order is the method."],
      ["Mistaking fluency for understanding", "If you cannot say it without the tool, you do not have it."],
      ["Silent use", "Declare it in one line. Silence is the risk."],
      ["Trusting it over your course material", "Check the primary source, not the more confident answer."]
    ],
    recap: [
      "Read first, quiz second, write third, critique last.",
      "Defensible means you can explain it, extend it and source it.",
      "Declare the help. Then read your actual course policy."
    ]
  },

  31: {
    lead: "In business work, the tool is a research assistant and a hostile reviewer. It is never the source of a number.",
    sections: [
      {
        h: "Where the numbers must come from",
        p: [
          "Any figure in a business case needs a source you can open, with a method and a date. Market sizes in particular are notorious: the same market is 'worth £2bn' and 'worth £40bn' depending on how the boundary is drawn, and both figures can be honestly reported.",
          "So the first question is never 'how big is the market' but 'what counts as being in this market'. Get that definition from a real report, then use the figure that matches it.",
          "Use the assistant to find the vocabulary and the plausible sources; use the source for the number. That division is what makes the case defensible in a tutorial or an investment meeting."
        ]
      },
      {
        h: "The section that makes a case credible",
        p: [
          "Name the competitor, substitute, regulation or behaviour that could kill the idea, and say what you would do about it. Every reviewer is looking for whether you can see the thing that defeats you.",
          "A business case with no serious counter-argument reads as enthusiasm. The counter-argument section is where judgement is visible, and it is the part no tool can supply because it requires knowing your actual situation."
        ]
      },
      {
        h: "Interrogating your own conclusion",
        p: [
          "Ask for the three strongest objections to your recommendation, ranked by how likely they are to be right. Then answer the top one in the document rather than in your head.",
          "Then ask what evidence would change your mind. If nothing would, you have written advocacy rather than analysis, and a good reviewer will notice."
        ]
      }
    ],
    worked: {
      h: "A defensible market paragraph",
      steps: [
        "Ask where to look for UK market data on your category, and which terms the industry uses. Note the sources.",
        "Open two of them. Record the definition, the year and the method.",
        "Choose the figure whose definition matches your product, and state the definition in the text.",
        "Add a range rather than a single number, and say why the range exists.",
        "Add one sentence naming the competitor who could make the whole segment irrelevant, and what you would do about it."
      ]
    },
    terms: [
      ["Market definition", "What is counted as inside the market. Changes the number more than anything else."],
      ["Triangulation", "Checking one figure against two independent sources."],
      ["Substitute", "What customers use instead. Often the real competitor."],
      ["Falsifying evidence", "What would show your recommendation is wrong."]
    ],
    mistakes: [
      ["Taking a market size from a chat", "Get the figure from a source you can open."],
      ["One number, no range", "State a range and why it exists."],
      ["No competitor or substitute", "Name what could kill the idea."],
      ["Never asking what would change your mind", "Then it is advocacy, not analysis."]
    ],
    recap: [
      "Assistant for orientation and objections; sources for numbers.",
      "Define the market before quoting its size.",
      "The counter-argument section is where credibility lives."
    ]
  },

  32: {
    lead: "A model is a set of assumptions written down. Write them in sentences first, give each a range, and change one at a time.",
    sections: [
      {
        h: "Sentences before cells",
        p: [
          "'Revenue is price times volume. Costs are fixed plus per unit. Growth slows after month six.' Three sentences, and now the spreadsheet is a translation rather than a guess.",
          "Writing the sentences first makes the logic reviewable by someone who will never open the file, which is usually the person marking it or funding it. It also exposes assumptions you had not noticed you were making.",
          "The most common failure is building a model whose formulas are right and whose assumptions are unstated. It looks rigorous, and it is the opposite."
        ]
      },
      {
        h: "Ranges, and what they buy you",
        p: [
          "Every assumption gets a low, expected and high value. Not because you know the range, but because pretending to know a single number is the thing that destroys credibility when it is questioned.",
          "Sensitivity is then mechanical: move one assumption from low to high, watch the conclusion, and report which assumption the conclusion is most sensitive to. That single sentence is usually the most valuable output of the whole model.",
          "If the conclusion flips within a plausible range, you do not have a recommendation — you have a decision that needs more evidence. Saying so is a stronger answer than a confident spreadsheet."
        ]
      },
      {
        h: "Keeping it auditable",
        p: [
          "One input sheet, one calculation sheet, one output. No hard-coded numbers inside formulas. Every total a formula. Colour or label the inputs so a reviewer can see what is an assumption and what is derived.",
          "Then check one row by hand — always one — because a model with a wrong formula and good formatting is the most dangerous artefact in business."
        ]
      }
    ],
    worked: {
      h: "A three-assumption model, honestly built",
      steps: [
        "Assumptions: price £12 (range 10-14), units per month 400 (250-600), fixed cost £1,800, variable cost £5 per unit.",
        "Write them on an inputs sheet, each with low, expected and high.",
        "Calculation: revenue = price × units; contribution = (price − variable) × units; profit = contribution − fixed.",
        "Sensitivity: at low units the profit is negative; the conclusion flips at about 260 units.",
        "Report: 'The recommendation holds if we sell more than 260 units a month; below that it loses money. That threshold is the number to test in the pilot.'"
      ]
    },
    terms: [
      ["Assumption", "An input you do not know for certain. Must be visible and ranged."],
      ["Contribution", "Price minus variable cost. What each unit adds toward fixed costs."],
      ["Sensitivity", "How much the conclusion moves when one assumption changes."],
      ["Hard-coded", "A number typed into a formula. Makes the model unauditable."]
    ],
    mistakes: [
      ["Building before writing assumptions", "Sentences first, then cells."],
      ["A single number per assumption", "Give low, expected, high."],
      ["Hiding inputs in formulas", "One inputs sheet, labelled."],
      ["Never checking a row by hand", "One hand-worked row, every time."]
    ],
    recap: [
      "Assumptions as sentences, with ranges, before any formula.",
      "Report which assumption the conclusion is most sensitive to.",
      "Inputs, calculation, output. No hard-coded totals."
    ]
  },
};
