import { detectLevel } from './src/utils/levelDetector.js';

const text = "i am a beginner at python. however, i have expert communication skills and have years of experience in leadership.";
const pythonLevel = detectLevel(text, "python");
console.log(`Python level detected: ${pythonLevel}`);
// Should be beginner because it says "beginner at python". But because "expert" is in the text, it will return "advanced"!
