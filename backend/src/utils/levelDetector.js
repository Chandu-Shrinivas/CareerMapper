export const detectLevel = (text, skill, skillIndex) => {
  if (!text || !skill) return "beginner";

  const lowerText = text.toLowerCase();
  const lowerSkill = skill.toLowerCase();

  const index = (skillIndex !== undefined) ? skillIndex : lowerText.indexOf(lowerSkill);
  if (index === -1) {
    return "beginner";
  }

  // Identify sentence boundaries containing the skill occurrence
  const separators = ['.', '!', '?', '\n'];
  let leftIdx = 0;
  let rightIdx = lowerText.length;

  for (let i = index - 1; i >= 0; i--) {
    if (separators.includes(lowerText[i])) {
      leftIdx = i + 1;
      break;
    }
  }

  for (let i = index + lowerSkill.length; i < lowerText.length; i++) {
    if (separators.includes(lowerText[i])) {
      rightIdx = i;
      break;
    }
  }

  const keywords = [
    { word: "expert", level: "advanced" },
    { word: "advanced", level: "advanced" },
    { word: "intermediate", level: "intermediate" },
    { word: "experience", level: "intermediate" },
    { word: "worked", level: "intermediate" },
    { word: "years", level: "intermediate" },
    { word: "familiar", level: "beginner" },
    { word: "basic", level: "beginner" },
    { word: "beginner", level: "beginner" }
  ];

  // Helper to find all indices of a substring
  const getOccurrences = (str, word) => {
    const indices = [];
    let idx = str.indexOf(word);
    while (idx !== -1) {
      indices.push(idx);
      idx = str.indexOf(word, idx + 1);
    }
    return indices;
  };

  const occurrences = [];
  keywords.forEach(({ word, level }) => {
    const indices = getOccurrences(lowerText, word);
    indices.forEach(idx => {
      // Proximity index must reside inside the same sentence
      if (idx >= leftIdx && idx <= rightIdx) {
        occurrences.push({ word, level, index: idx });
      }
    });
  });

  let closest = null;
  let minDistance = Infinity;
  const WINDOW_THRESHOLD = 60; // 60 characters window

  occurrences.forEach(occ => {
    const distance = Math.abs(occ.index - index);
    if (distance <= WINDOW_THRESHOLD && distance < minDistance) {
      minDistance = distance;
      closest = occ;
    }
  });

  if (closest) {
    return closest.level;
  }

  return "beginner";
};


