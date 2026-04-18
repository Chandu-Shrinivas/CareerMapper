import axios from 'axios';

export const suggestDomainForSkill = async (skill) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const prompt = `Which domain does the skill '${skill}' belong to? Respond only with one domain name like IT, MBA, Mechanical.`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    // Extracting the text from Gemini response structure
    const suggestedDomain = response.data.candidates[0].content.parts[0].text.trim();

    return {
      skill,
      suggestedDomain
    };
  } catch (error) {
    console.error('Error suggesting domain from Gemini:', error?.response?.data || error.message);
    throw new Error('Failed to fetch suggestion from Gemini API');
  }
};
