import { getJobsData } from '../services/job.service.js';
import { getNormalizedSkillName } from '../utils/skillNormalizer.js';
import { getJobAnalysis } from '../services/jobAnalysis.service.js';

export const getJobs = async (req, res) => {
  try {
    const query = req.query.query || 'full-stack-developer';
    const location = req.query.location || 'all';
    const country = req.query.country || 'India';
    const userRole = req.query.role || '';
    const page = parseInt(req.query.page || '1', 10);
    const forceRefresh = req.query.refresh === 'true';

    // Parse user's current skills from query param (skills=react:expert,sql:intermediate)
    const userSkills = [];
    if (req.query.skills) {
      req.query.skills.split(',').forEach(item => {
        const parts = item.split(':');
        const rawName = parts[0].trim();
        let rawLevel = parts[1] ? parts[1].trim().toLowerCase() : 'beginner';
        if (rawLevel === 'undefined' || !['beginner', 'intermediate', 'advanced', 'expert'].includes(rawLevel)) {
          rawLevel = 'beginner';
        }
        const name = getNormalizedSkillName(rawName);
        if (name) {
          userSkills.push({ name, level: rawLevel });
        }
      });
    }

    const result = await getJobsData(query, location, country, userSkills, userRole, forceRefresh, page);

    res.setHeader('X-Cache', result.isCacheHit ? 'HIT' : 'MISS');

    return res.status(200).json({
      status: 'success',
      data: result,
      count: result.jobs.length
    });
  } catch (error) {
    console.error('Job search API error:', error);
    return res.status(500).json({ error: error.message || 'Failed to search jobs.' });
  }
};

export const analyzeJob = async (req, res) => {
  try {
    const { jobId, description, jobTitle, userSkills, userRole } = req.body;
    if (!jobId || !description || !jobTitle) {
      return res.status(400).json({ error: 'jobId, description, and jobTitle are required.' });
    }

    // Call service to get analysis
    const result = await getJobAnalysis(jobId, description, jobTitle, userSkills || [], userRole || '');
    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error('Job analysis API error:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze job.' });
  }
};
