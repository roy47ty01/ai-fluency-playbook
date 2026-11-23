/* ============================================================
   DEEPER READING — lessons 13-19
   ============================================================ */

export const DEPTH_C = {
  13: {
    lead: "A page is an argument in an order. Everything else — colour, type, animation — is adjustment.",
    sections: [
      {
        h: "Decide the argument before the design",
        p: [
          "Write the headline first. Not a topic label like 'Sustainability' but a claim like 'Our packaging change cut plastic by 40% and raised costs by 6%'. A headline that takes a position forces every section under it to do a job.",
          "Then list sections in the order a reader needs them, which is rarely the order you discovered them. Usually: the claim, the evidence, the objection, the decision. Readers arrive sceptical; give them the reason to keep reading, then the proof, then the strongest counter-argument, then what you want them to do.",
          "This is the same structure as a good report or a good presentation, which is not a coincidence. The medium changes; the argument does not."
        ]
      },
      {
        h: "Feedback that produces a change, not a reroll",
        p: [
          "'Make it better' invites a reroll: a different page, equally arbitrary. Useful feedback names a place and a symptom: 'the second paragraph repeats the first', 'the call to action sits below the fold on a phone', 'the heading and the subheading contradict each other'.",
          "Ask for one change at a time on anything visual. Three simultaneous changes make it impossible to know which one helped, and visual work is where people most often lose track of what they liked.",
          "And bound the scope explicitly: no extra pages, no sign-up form, no analytics, no invented testimonials. Unbounded scope is how a one-page site becomes a half-finished product."
        ]
      }
    ],
    worked: {
      h: "Briefing a page that comes back usable",
      steps: [
        "Headline, exactly: 'The cheapest way to cut our delivery emissions was to stop splitting orders.'",
        "Audience: a operations manager who is sceptical and busy.",
        "Sections in order: the claim, the three numbers behind it, the cost, the objection ('but customers want speed'), what we changed, what to do next.",
        "Constraints: one page, no sign-up, no stock photos, mobile first, no claims beyond the three numbers.",
        "Done means: she can decide in two minutes whether to ask for the full report.",
        "Review: read it on a phone-sized window and check that the decision is visible without scrolling twice."
      ]
    },
    terms: [
      ["Claim", "A headline that asserts something, rather than labelling a topic."],
      ["Above the fold", "What a visitor sees before scrolling. The argument has to start here."],
      ["Scope boundary", "The explicit list of what the page will not include."],
      ["Symptom", "The observable problem — repeated paragraph, hidden button — rather than a feeling."]
    ],
    mistakes: [
      ["Starting with colours and fonts", "Decide claim and order first; style is cheap to adjust."],
      ["Vague feedback", "Name the place and the symptom. One change at a time."],
      ["Unbounded scope", "Say what to leave out, explicitly."],
      ["Never viewing it on a phone", "Most readers are on one. Check the decision is visible early."]
    ],
    recap: [
      "Headline is a claim; sections follow the reader's needs, not your discovery order.",
      "Feedback names a place and a symptom.",
      "Bound the scope or the page grows features nobody asked for."
    ]
  },

  14: {
    lead: "Reviewing AI work is a different skill from writing it. You are looking for intent, side effects and silent assumptions — not for elegance.",
    sections: [
      {
        h: "Three questions, in order",
        p: [
          "Does it do what I asked? Compare against the brief and the acceptance criteria, not against your impression of the writing. This is where a beautiful answer to a neighbouring question gets caught.",
          "What else did it touch? Read the diff, the changed cells, the extra sections. Blast radius is the thing people skip and the thing that causes the incident. If four files changed and you expected one, the other three are the review.",
          "What did it quietly assume? Assumptions are invisible in the artefact because they are the thing the artefact rests on. Ask directly: what did you assume that I did not say?"
        ]
      },
      {
        h: "Asking for an adversarial review",
        p: [
          "Models are better at finding weaknesses when asked to attack than when asked to confirm. 'Review this as an adversary, not an author: what requirement could this silently fail, what did you assume, what else does it touch, where does real input break it?' produces a genuinely useful list.",
          "Then verify the list rather than trusting it. Some findings will be wrong, some will be style opinions. The value is coverage: it points you at the places worth your attention.",
          "The reverse also works and is underused: ask for the strongest argument against the work, then answer it in the document. That is how reports get stronger instead of merely longer."
        ]
      },
      {
        h: "Separate blocking from nice-to-have",
        p: [
          "A review that lists twelve equal points is not a review. Classify: would block shipping, should fix soon, cosmetic. That ordering is the reviewer's actual contribution, and it is the part a model is worst at, because it does not know your risk tolerance.",
          "You do. So take the list and re-order it yourself. That act is the judgement the job is actually paying for."
        ]
      }
    ],
    worked: {
      h: "Reviewing a change in four minutes",
      steps: [
        "Read the stated intent: 'added a totals row to the report'.",
        "Check the artefact: the totals row exists, and two formulas above it changed to include the new row — a circular reference waiting to happen.",
        "Check blast radius: one other sheet references the same range. That will now double-count.",
        "Ask the tool what it assumed. Answer: 'that the totals row would not be included in the sum above it.' It was wrong.",
        "Classify: circular reference blocks; the double-count blocks; the header wording is cosmetic.",
        "Fix the two blocking items, re-check the one number a reader would test, and note what you changed."
      ]
    },
    terms: [
      ["Blast radius", "Everything a change could affect beyond the line you meant to edit."],
      ["Diff", "The exact set of changes. The artefact of a review, not the summary."],
      ["Silent assumption", "Something the work depends on that was never stated."],
      ["Blocking", "A defect that must be fixed before the work is used."]
    ],
    mistakes: [
      ["Judging style before intent", "Intent and side effects first, elegance last."],
      ["Trusting the change summary", "Read the diff. The summary omits by design."],
      ["Reviewing as an author", "Ask for an adversarial pass, then verify its findings."],
      ["Twelve equal priorities", "Classify blocking / soon / cosmetic yourself."]
    ],
    recap: [
      "Intent, blast radius, assumptions — in that order.",
      "Adversarial review finds more than confirmatory review.",
      "Ranking the findings is your job, not the model's."
    ]
  },

  15: {
    lead: "An agent is a loop: plan, act, observe, correct. Your job is not to write better prompts inside the loop. It is to bound the loop.",
    sections: [
      {
        h: "What makes a loop safe",
        p: [
          "Three statements before it starts: what it may touch, what it must ask about, and what it must never do. Everything else is detail. Without them, the agent's competence becomes your exposure.",
          "Read-only first. Then one small write. Then a bigger one. This is the same reason you do not hand a new employee the production database on day one, and the reason is not distrust — it is that neither of you yet knows where the edges are.",
          "Bound the number of steps too. A loop that can run indefinitely will eventually do something surprising, and the surprise is usually a repeated action: sending twice, appending twice, charging twice."
        ]
      },
      {
        h: "Observe, don't assume",
        p: [
          "After each action, look at the actual result, not the report of the result. A file that was supposedly edited may be unchanged; a command that supposedly succeeded may have written to the wrong path.",
          "The most valuable habit with agents is a checkpoint you can return to: version control, a copy of the file, a saved state. Then a bad loop costs a rollback rather than an afternoon.",
          "And keep the approval at the last responsible moment. Drafting is cheap and reversible; sending, paying, publishing and deleting are not."
        ]
      },
      {
        h: "When to stop looping and think",
        p: [
          "If two attempts fail in the same way, the problem is probably the plan, not the execution. Stop, restate the goal, and ask for three hypotheses with a cheap test each. Looping harder on a wrong plan produces expensive consistency.",
          "A loop is a tool for mechanical progress. Design decisions belong outside it, where you can see the whole picture."
        ]
      }
    ],
    worked: {
      h: "A bounded loop, written out",
      steps: [
        "Goal: add a contact form to one page.",
        "May touch: index.html, styles.css. Must ask: anything involving the server, any new dependency.",
        "Must never: change the pricing section, add analytics, send a real email.",
        "Step 1: propose the change as a plan. You approve.",
        "Step 2: make the edit. You open the page and check the form appears and the existing sections are untouched.",
        "Step 3: run the local server and submit the form with empty fields. Confirm it fails visibly rather than silently.",
        "Stop. Commit. Next task in a fresh request."
      ]
    },
    terms: [
      ["Agentic loop", "Plan, act, observe, correct, repeated until a stop condition."],
      ["Stop condition", "The stated point at which the loop ends. Without one, it drifts."],
      ["Checkpoint", "A saved state you can return to: commit, copy, snapshot."],
      ["Approval gate", "A human decision required before an irreversible action."]
    ],
    mistakes: [
      ["Starting with broad write access", "Read-only, then one small write."],
      ["No step limit", "Bound the steps; repeated actions are the classic failure."],
      ["Trusting the report of an action", "Inspect the result itself."],
      ["Looping harder on a wrong plan", "Two identical failures means stop and re-plan."]
    ],
    recap: [
      "State may-touch, must-ask, never-do before the loop starts.",
      "Observe results, keep a checkpoint, gate the irreversible step.",
      "Two identical failures means the plan is wrong, not the effort."
    ]
  },

  16: {
    lead: "A 3D scene has five parts. Once you can name them, the whole subject stops being mysterious.",
    sections: [
      {
        h: "The five parts",
        p: [
          "A scene is a container. A camera decides what part of it is visible and from where. Geometry plus material make a mesh — the shape and how it responds to light. Lights make surfaces readable (or, with basic materials, are ignored entirely). And a render loop redraws the frame many times a second, which is what makes motion look like motion.",
          "Almost every 'it looks wrong' problem is one of three things: the camera is in the wrong place, the light is doing nothing because the material ignores it, or the object is not in the scene graph where you think it is.",
          "In three.js these map to Scene, PerspectiveCamera, Mesh, Light and a requestAnimationFrame loop. Learn those five names and the documentation becomes readable."
        ]
      },
      {
        h: "Performance in one paragraph",
        p: [
          "The GPU is asked to draw things. Each separate object is usually a draw call; each pixel is work. So the cost is roughly how many objects you draw and how many pixels you fill, not how many triangles a single object has.",
          "Practical consequences: reuse geometry, merge or instance repeated objects, cap the pixel ratio at 2, and stop rendering when nobody is looking. Those four changes fix most slow 3D pages.",
          "A wireframe draws lines rather than filled triangles, which is why a wireframe scene can look expensive and still be cheap — and why it is a good way to start."
        ]
      }
    ],
    worked: {
      h: "Reading a minimal scene line by line",
      steps: [
        "const renderer = new THREE.WebGLRenderer({ canvas, antialias: true }) — the thing that draws into your canvas.",
        "const scene = new THREE.Scene() — the container. Nothing appears unless it is added here.",
        "const camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 100) — field of view, aspect ratio, near and far clipping.",
        "camera.position.set(0, 0, 5.4) — back the camera up so the object fits. Most 'nothing is visible' bugs are here.",
        "const mesh = new THREE.LineSegments(...) — geometry (shape) plus material (appearance).",
        "scene.add(mesh) — the step people forget. An object that is not added is not drawn.",
        "function frame() { mesh.rotation.y += 0.004; renderer.render(scene, camera); requestAnimationFrame(frame); } — the loop."
      ]
    },
    terms: [
      ["Scene graph", "The tree of objects in a scene. Move a parent and its children follow."],
      ["PerspectiveCamera", "A camera with a field of view, which gives depth. Aspect ratio must match the canvas."],
      ["Draw call", "One instruction to the GPU to draw something. Usually the real cost driver."],
      ["Material", "How a surface looks. Basic materials ignore lights; standard materials respond to them."]
    ],
    mistakes: [
      ["Forgetting scene.add", "If it does not appear, check this first."],
      ["Camera inside or behind the object", "Move it back and set near/far sensibly."],
      ["Basic material with lights added", "It will ignore them. Use a standard material or accept flat colour."],
      ["Uncapped pixel ratio", "Cap at 2. High-density screens otherwise multiply the pixel work."]
    ],
    recap: [
      "Scene, camera, mesh (geometry + material), light, loop.",
      "Nothing draws unless it is in the scene and in front of the camera.",
      "Cost is draw calls and pixels, not polygons alone."
    ]
  },

  17: {
    lead: "Motion reads as expensive when it is slow, eased, and slightly connected to the person looking at it.",
    sections: [
      {
        h: "Easing, and why linear looks cheap",
        p: [
          "Linear motion moves at a constant speed and stops instantly, which nothing physical does. Easing changes the speed over time — slow at the start, faster in the middle, slow at the end — and that single change is most of the difference between a demo and a design.",
          "The practical version is a small interpolation each frame: move a fraction of the remaining distance rather than a fixed amount. The object approaches its target smoothly and naturally decelerates.",
          "Restraint matters as much as easing. Halve the movement you think you need. A subtle parallax that follows the pointer reads as crafted; a large one reads as a toy."
        ]
      },
      {
        h: "Accessibility is part of the motion design",
        p: [
          "Some people experience genuine nausea and dizziness from motion, and operating systems offer a reduced-motion setting for exactly that reason. Honour it: render a static frame, or reduce the movement to near zero.",
          "This is not a nice-to-have. It is the difference between a page that some visitors can use and one they have to leave. It is also trivially cheap to implement — one media query check before starting the loop.",
          "The same logic applies to flashing, fast parallax and autoplaying movement that cannot be paused. Design the still version first; it is what a lot of people will see."
        ]
      }
    ],
    worked: {
      h: "From mechanical to considered in two edits",
      steps: [
        "Before: group.rotation.y += 0.02 every frame, constant and fast. Feels like a spinning logo from 2009.",
        "Edit 1, slower and eased: group.rotation.y += (target + spin - group.rotation.y) * 0.08. It now accelerates and settles.",
        "Edit 2, tie it to the pointer: target = mouseX * 0.4. A small movement the visitor causes, rather than motion imposed on them.",
        "Edit 3, the reduced-motion branch: if the setting is on, rotate once and render a single frame.",
        "Result: less movement, better feel, and nobody is made unwell by it."
      ]
    },
    terms: [
      ["Easing", "Non-linear speed change over time. The main ingredient of motion that feels designed."],
      ["Interpolation (lerp)", "Moving a fraction of the remaining distance each frame to approach a target."],
      ["Parallax", "Small apparent movement caused by the viewer's position or pointer."],
      ["Reduced motion", "An OS accessibility setting. Honour it with a static or near-static version."]
    ],
    mistakes: [
      ["Constant-speed rotation", "Ease it. Linear reads as mechanical."],
      ["Too much movement", "Halve it. Restraint is what looks expensive."],
      ["Ignoring prefers-reduced-motion", "Offer a static frame. This is accessibility, not preference."],
      ["Animation that cannot be paused", "Autoplaying motion needs a way out."]
    ],
    recap: [
      "Slow and eased beats fast and linear, every time.",
      "Tie motion to the visitor's input, in small amounts.",
      "Design the still version; some people will only ever see that."
    ]
  },

  18: {
    lead: "A 3D page is a page first. Performance and fallbacks are not polish; they are whether it works.",
    sections: [
      {
        h: "Where the time actually goes",
        p: [
          "Frame time is dominated by draw calls and pixels filled. A thousand separate cubes cost far more than one mesh with a thousand instances, even though the triangle count is identical.",
          "The four cheap fixes, in order of return: stop rendering when the canvas is off screen, cap the device pixel ratio at 2, reuse geometry and materials instead of rebuilding them, and merge or instance repeated objects.",
          "Measure rather than guess. A frame counter and a draw-call readout turn performance from an argument into a number, which is also how you know whether a change helped."
        ]
      },
      {
        h: "The five failure modes to design for",
        p: [
          "No WebGL, or a context that fails to create. Low-end phones with weak GPUs. Reduced motion. Screen readers, which cannot see a canvas at all. Slow networks, where a large model or texture arrives after the user has scrolled past.",
          "Each has a fallback: a static image or a CSS composition, a lower particle count, a static frame, a text description with real content, and progressive loading with a placeholder that does not jump.",
          "The test that catches most of this in thirty seconds: open the page in a normal browser with 3D unavailable, and read it. If the page still makes sense, you have built a page. If it is empty, you have built a demo."
        ]
      }
    ],
    worked: {
      h: "A performance pass on a heavy scene",
      steps: [
        "Read the numbers: 240 draw calls, 60fps on a laptop, 22fps on a mid-range phone.",
        "Fix 1: pause the loop when the canvas leaves the viewport. Phone frames recover when scrolling elsewhere; battery stops draining.",
        "Fix 2: replace 200 separate particles objects with one Points object. Draw calls drop sharply.",
        "Fix 3: cap the pixel ratio, which on a high-density phone cuts the pixel work by more than half.",
        "Fix 4: dispose of geometry and materials when switching shapes, so memory does not grow every click.",
        "Re-measure. Report the change in frame time, not in adjectives."
      ]
    },
    terms: [
      ["Draw call", "One GPU instruction to draw something. Fewer is faster."],
      ["Instancing", "Drawing many copies of one geometry in a single call."],
      ["Pixel ratio", "Device pixels per CSS pixel. Cap it at 2."],
      ["Fallback", "What renders when 3D cannot. Must carry the content, not just an apology."]
    ],
    mistakes: [
      ["Optimising polygon count only", "Draw calls and pixels usually matter more."],
      ["Rendering off screen", "Pause the loop when it is not visible."],
      ["Building new geometry every update", "Reuse and dispose deliberately."],
      ["Testing only on your own machine", "Check a phone, no-WebGL and reduced-motion."]
    ],
    recap: [
      "Off-screen pause, pixel-ratio cap, reuse, instancing: four fixes, most of the gain.",
      "Design the fallback as content, not as an error message.",
      "Measure frames and draw calls; do not argue from impressions."
    ]
  },

  19: {
    lead: "A rules file is how you stop re-teaching the same twenty things. It is also how a project stays coherent when you are not the only one working on it.",
    sections: [
      {
        h: "What belongs in it",
        p: [
          "Five headings do the work: what this is, the commands that matter, the conventions, what never to touch, and how to check a change. Everything else is optional.",
          "The test for each line is that a strict reviewer could apply it. 'Never add a dependency without asking' can be tested. 'Write clean code' cannot, and a rule that cannot be tested trains people to ignore rules.",
          "Keep it to a page. A long file gets skimmed by people and diluted by models, and both failures look the same from a distance: the rule that mattered was not followed."
        ]
      },
      {
        h: "Maintaining it",
        p: [
          "Date the file. When a rule stops being true, change it the same day, because the cost of a stale rule is not just that rule — it is that every other rule becomes negotiable.",
          "Add a rule after a mistake, not before. Rules invented in advance are guesses about failure; rules added after a real failure are knowledge. That ordering is why the file gets shorter and better over time rather than longer and ignored."
        ]
      }
    ],
    worked: {
      h: "A rules file that actually gets followed",
      steps: [
        "What this is: 'A one-page site for a student society. Static HTML, one stylesheet, no build step.'",
        "Commands: 'Open index.html directly. There is no server and no install.'",
        "Conventions: 'Lowercase class names, one blank line between sections, no inline styles.'",
        "Never: 'Never touch the venue address in the footer — it is confirmed with the venue. Never add analytics.'",
        "Check a change: 'Open the page, check the mobile width, and confirm every link still goes somewhere real.'",
        "Date it at the top. Add a line each time something goes wrong."
      ]
    },
    terms: [
      ["Rules file", "Project instructions loaded before work begins. Sometimes called AGENTS.md or CLAUDE.md."],
      ["Checkable rule", "A rule with a stated failure a reviewer could detect."],
      ["Convention", "A house style that removes daily decisions."],
      ["Pruning", "Removing rules that are stale or that nobody follows."]
    ],
    mistakes: [
      ["Aspirational rules", "Write rules with observable failures."],
      ["A file longer than a page", "Keep it short enough to be read every time."],
      ["Never updating it", "Stale rules teach everyone to ignore rules."],
      ["Writing rules before any failure", "Add rules after real mistakes; they are the ones that stick."]
    ],
    recap: [
      "Five headings: what, commands, conventions, never, check.",
      "If a reviewer cannot test it, it is not a rule.",
      "Grow the file from real failures and prune it as you go."
    ]
  },
};
