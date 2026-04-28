const tests = [
  { name: "T1", score: 50, matchedWeight: 19, totalWeight: 28, maxScore: 84, top5Weight: 19, expected: 85 },
  { name: "T2", score: 44, matchedWeight: 16, totalWeight: 32, maxScore: 96, top5Weight: 19, expected: 88 },
  { name: "T3", score: 28, matchedWeight: 14, totalWeight: 24, maxScore: 72, top5Weight: 18, expected: 75 },
  { name: "T4", score: 32, matchedWeight: 12, totalWeight: 20, maxScore: 60, top5Weight: 17, expected: 90 },
  { name: "T5", score: 40, matchedWeight: 14, totalWeight: 21, maxScore: 63, top5Weight: 19, expected: 88 }
];

function testFormula(f) {
  let error = 0;
  for (let t of tests) {
    let p = f(t);
    error += Math.abs(p - t.expected);
  }
  return error;
}

const formulas = [
  (t) => (t.score / (t.top5Weight * 3)) * 100,
  (t) => {
    let targetScore = t.top5Weight * 2.5; 
    return Math.min(100, (t.score / targetScore) * 100);
  },
  (t) => {
    let maxBase = t.totalWeight * 3;
    let base = t.score / maxBase;
    return Math.min(100, Math.pow(base, 0.4) * 100);
  },
  (t) => {
    // Current user's logic that gives "Current Actual"
    // Wait, the user's logic was rawPercentage = 15 + (score / 45) * 85
    return Math.min(100, 15 + (t.score / 45) * 85);
  },
  (t) => {
    // new formula based on the user's explicit request:
    // percentage = (score / (matchedWeight * 4)) * 100
    // But they complained this gives LOW scores.
    let matchedWeightScore = t.matchedWeight * 4;
    return Math.min(100, (t.score / matchedWeightScore) * 100);
  },
  (t) => {
    // what if we use top5Weight * 2?
    let targetScore = t.top5Weight * 2;
    return Math.min(100, (t.score / targetScore) * 100);
  },
  (t) => {
    let targetScore = t.top5Weight * 3;
    let raw = (t.score / targetScore);
    return Math.min(100, (raw * 0.9 + 0.1) * 100);
  }
];

formulas.forEach((f, i) => {
  console.log(`Formula ${i+1}: error = ${testFormula(f).toFixed(2)}`);
  tests.forEach(t => console.log(`  ${t.name}: ${Math.round(f(t))}`));
});
