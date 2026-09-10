import axios from 'axios';
import { config } from '../config/env.js';

/**
 * Request completion from Groq completions.
 * Injects profile, skills recommendations, and current job contexts.
 */
export const getChatCompletion = async (messages, context = {}) => {
  const groqApiKey = config.groqApiKey;

  // Build context details
  let contextPrompt = '';

  if (context.userProfile) {
    const prof = context.userProfile;
    contextPrompt += `User Profile Context:
- Degree: ${prof.degree || 'N/A'}
- Specialization: ${prof.specialization || 'N/A'}
- Experience Level: ${prof.experience || 'N/A'}
- Target Career Goal: ${prof.careerGoal || 'N/A'}
- Interests: ${(prof.interests || []).join(', ') || 'N/A'}
- Registered Skills: ${(prof.skills || []).map(s => `${s.name} (${s.proficiency || 'intermediate'})`).join(', ') || 'N/A'}
`;
  }

  if (context.careerProfile) {
    const cp = context.careerProfile;
    contextPrompt += `User Career Analysis:
- Target Domain: ${cp.domain || 'N/A'}
- Top Career Role Matches: ${(cp.recommendations || []).map(r => `${r.role} (${r.score}% Match)`).join(', ') || 'N/A'}
`;
  }

  if (context.currentJob) {
    const jobData = context.currentJob.job;
    const analysis = context.currentJob.analysis;
    contextPrompt += `Active/Selected Job Listing:
- Title: ${jobData?.title || 'N/A'}
- Company: ${jobData?.company || 'N/A'}
- Location: ${jobData?.location || 'N/A'}
- Salary Details: ${jobData?.salaryText || 'N/A'}
- Required Experience: ${jobData?.experience || 'N/A'}
- Work Mode: ${jobData?.workMode || 'N/A'}
- Alignment Match Score: ${analysis?.matchScore || jobData?.matchScore || 0}%
- Matched Skills: ${(analysis?.matchedSkills || []).map(s => s.display || s).join(', ') || 'N/A'}
- Skills to Strengthen (Gaps): ${(analysis?.missingSkills || []).map(s => s.display || s).join(', ') || 'N/A'}
`;
  }

  const systemMessage = {
    role: 'system',
    content: `You are the CareerMapper AI Assistant, a professional, encouraging, and intelligent career advisor.
You help the user analyze their skills, explore target roles, match jobs, and strategize profile development.

Here is the user's current CareerMapper context:
${contextPrompt || 'No current context loaded.'}

Guidelines:
1. Provide constructive, action-oriented career advice.
2. Reference their current skills, matched scores, and missing skill gaps dynamically.
3. Be clean, professional, and concise. Use markdown lists and bold text where appropriate to structure your advice.
4. Do NOT mention any internal AI model or provider names (such as Groq, Compound-Mini, Llama, etc.). Rebrand yourself as the CareerMapper Assistant.
5. If the user asks "Why don't I match this job?", refer specifically to the currently selected job's details and analyze their matched vs missing skills from the context. Explain clearly which skills they have, which ones are missing, and how to improve.
6. If no context details are available, answer politely based on general career advice principles. Never invent details about their profile or jobs if they are not in the context.`
  };

  const apiMessages = [systemMessage, ...messages];

  if (!groqApiKey || groqApiKey === 'YOUR_GROQ_API_KEY_HERE' || !groqApiKey.trim()) {
    console.warn('[CHAT SERVICE] GROQ_API_KEY is unconfigured or invalid.');
    return 'AI service unavailable. Please try again.';
  }

  try {
    const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.1-8b-instant',
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 800
    }, {
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 12000
    });

    return res.data?.choices?.[0]?.message?.content || 'AI service unavailable. Please try again.';
  } catch (err) {
    console.warn('[CHAT SERVICE] Groq completion failed:', err.message);
    return 'AI service unavailable. Please try again.';
  }
};

// Fallback logic for offline/unconfigured environments
const getFallbackReply = (userQuery, context) => {
  const query = userQuery.toLowerCase().trim();
  
  if (query.match(/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening))/i)) {
    return `Hello! 👋 I am your **CareerMapper AI Assistant**. How can I help you with your career goals, skill development, or job match analysis today?`;
  }

  if (query.includes('2+1') || query.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/)) {
    try {
      const match = query.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
      if (match) {
        const a = parseFloat(match[1]);
        const op = match[2];
        const b = parseFloat(match[3]);
        let res = 0;
        if (op === '+') res = a + b;
        if (op === '-') res = a - b;
        if (op === '*') res = a * b;
        if (op === '/') res = b !== 0 ? a / b : 0;
        return `The answer to **${a} ${op} ${b}** is **${res}**. Let me know if you need help with career mapping or technical skill analysis!`;
      }
    } catch (e) {}
  }

  if (context.activeTargetRole) {
    const tr = context.activeTargetRole;
    contextPrompt += `Active Target Role Context:
- Target Role: ${tr.roleTitle || 'N/A'}
- Target Company: ${tr.company || 'N/A'}
- Domain: ${tr.domain || 'N/A'}
- Profile Match Score: ${tr.matchScore !== undefined ? tr.matchScore : 80}%
- Matched Skills: ${(tr.matchedSkills || []).join(', ') || 'None registered'}
- Skills to Strengthen (Gaps): ${(tr.skillsToStrengthen || []).join(', ') || 'None identified'}
`;
  }

  if (query.includes('next') || query.includes('learn next') || query.includes('roadmap') || query.includes('focus')) {
    if (context.activeTargetRole?.roleTitle) {
      const gaps = context.activeTargetRole.skillsToStrengthen;
      const nextSkill = gaps && gaps.length > 0 ? gaps[0] : 'core technical projects';
      return `For your active target role **${context.activeTargetRole.roleTitle}**, your highest priority next skill focus is **${nextSkill}**. You can track your interactive learning tree on the **Career Roadmap** page!`;
    }
  }

  if (query.includes('career') || query.includes('suit') || query.includes('profile') || query.includes('match')) {
    if (context.activeTargetRole?.roleTitle) {
      const tr = context.activeTargetRole;
      return `Based on your profile, your active target role is **${tr.roleTitle}** with a match score of **${tr.matchScore || 80}%**. Check the **Career Roadmap** page to complete your personalized learning track!`;
    }
    if (context.careerProfile?.recommendations?.length > 0) {
      const top = context.careerProfile.recommendations[0];
      const roleName = top.roleTitle || top.title || top.role;
      const scoreVal = top.matchScore ?? top.score;
      if (roleName && scoreVal !== undefined) {
        return `Based on your profile, your top career match is **${roleName}** with a match score of **${scoreVal}%**. You can check the **Career Analysis** page for a full breakdown!`;
      } else if (roleName) {
        return `Based on your profile, your top career match is **${roleName}**. Check the **Career Analysis** page for detailed skill match breakdowns!`;
      }
    }
    return `To discover which careers suit your skills, please make sure you've completed your profile or selected a target role on Career Analysis!`;
  }
  
  if (query.includes('skill') || query.includes('learn') || query.includes('improve')) {
    if (context.userProfile?.skills?.length > 0) {
      const skillNames = context.userProfile.skills.slice(0, 3).map((s) => s.name).join(', ');
      return `You have registered **${context.userProfile.skills.length} skills** (including **${skillNames}**). To improve your match, review the skill gaps identified under your top matched roles in the Dashboard or Career Paths page.`;
    }
    return `To get personalized skill recommendations, upload your resume or add manual skills to your inventory!`;
  }
  
  if (query.includes('job') || query.includes('why')) {
    if (context.currentJob?.job) {
      const job = context.currentJob.job;
      const analysis = context.currentJob.analysis;
      const missing = (analysis?.missingSkills || []).map((s) => s.display || s).join(', ') || 'none';
      const matched = (analysis?.matchedSkills || []).map((s) => s.display || s).join(', ') || 'none';
      return `For the **${job.title}** role at **${job.company}**, you have a match score of **${analysis?.matchScore || job.matchScore || 0}%**.
- **Matched Skills**: ${matched}
- **Skills to Strengthen**: ${missing}
Focus on building these skills to improve alignment!`;
    }
    return `I see you are interested in jobs! Try searching for roles on the Jobs page and opening one of the listings to view your match statistics.`;
  }
  
  return `I am your CareerMapper Assistant. I can help you analyze your skills, review match details for jobs, or identify career paths. How can I help you today?`;
};
