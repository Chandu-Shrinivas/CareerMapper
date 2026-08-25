import axios from 'axios';

export const suggestDomainForSkill = async (skill) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey === 'PASTE_YOUR_GEMINI_API_KEY_HERE' || !apiKey.trim()) {
    return {
      success: false,
      errorType: 'MISSING_KEY',
      error: 'AI domain suggestion service is currently unavailable: Gemini API key configuration is missing.'
    };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const prompt = `Which domain does the skill '${skill}' belong to? Respond only with one domain name like IT, MBA, Mechanical.`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    }, {
      timeout: 5000 // 5 seconds timeout protection
    });

    // Extracting the text from Gemini response structure
    const suggestedDomain = response.data.candidates[0].content.parts[0].text.trim();

    return {
      success: true,
      skill,
      suggestedDomain
    };
  } catch (error) {
    console.error('Error suggesting domain from Gemini:', error?.response?.data || error.message);
    let errorMsg = error.message;
    let errorType = 'API_ERROR';
    if (error.response && (error.response.status === 400 || error.response.status === 403 || error.response.status === 401)) {
      errorMsg = 'Gemini API key is invalid or unauthorized.';
      errorType = 'INVALID_KEY';
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      errorMsg = 'Gemini API call timed out.';
      errorType = 'TIMEOUT';
    } else {
      errorMsg = `Gemini API execution failed: ${error.message}`;
    }
    return {
      success: false,
      errorType,
      error: errorMsg
    };
  }
};
