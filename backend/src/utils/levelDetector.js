export const detectLevel = (text, skill) => {
  if (text.includes("expert") || text.includes("advanced")) {
    return "advanced";
  } else if (text.includes("experience") || text.includes("worked") || text.includes("years")) {
    return "intermediate";
  } else if (text.includes("familiar") || text.includes("basic")) {
    return "beginner";
  }
  
  return "beginner";
};
