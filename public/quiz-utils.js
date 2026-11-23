/* ============================================================
   QUIZ UTILITIES — deterministic option shuffling

   Why this exists: writing 164 questions by hand produced a bad habit.
   Most of the correct answers ended up in the same position, so a learner
   could pass by always picking the second option. That is a broken test,
   not a hard one.

   The fix is to shuffle the options. The shuffle is seeded from the
   question text, so a given question always shows its options in the same
   order for everyone — no random reordering between renders, no losing
   your place when a lesson is re-rendered, and no way to pattern-match on
   position.
   ============================================================ */

function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* Returns the question with its options in a stable, seed-shuffled order
   and the correct index adjusted to match. */
export function prepare(q) {
  const [text, opts, correct, why] = q;
  const seed0 = hash(text);
  const order = opts.map((_, i) => i);
  let seed = seed0;
  for (let i = order.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    const t = order[i];
    order[i] = order[j];
    order[j] = t;
  }
  return {
    text,
    opts: order.map((i) => opts[i]),
    correct: order.indexOf(correct),
    why
  };
}

/* The effective position of the correct answer after shuffling. */
export function correctIndex(q) {
  return prepare(q).correct;
}
