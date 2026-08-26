import { SavedJob } from '../models/savedJob.model.js';

// 1. Save Job
export const saveJob = async (req, res) => {
  try {
    const job = req.body;
    const userEmail = req.user.email; // Derived from auth middleware, never request body
    
    if (!job || !job.id || !job.title || !job.company) {
      return res.status(400).json({ error: 'Invalid request: job id, title, and company are required.' });
    }

    const source = job.source || 'JSearch';
    const jobId = job.id; // external source ID

    // Prevent duplicate saves for the same user
    const existing = await SavedJob.findOne({ userEmail, source, jobId });
    if (existing) {
      return res.status(409).json({ error: 'Conflict: This job is already saved.' });
    }

    // Save job snapshot with preserved metadata
    const savedJob = new SavedJob({
      userEmail,
      jobId,
      source,
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo || '',
      companyDomain: job.companyDomain || '',
      location: job.location || '',
      country: job.country || '',
      workMode: job.workMode || '',
      employmentType: job.employmentType || '',
      experience: job.experience || '',
      salaryMin: job.salaryMin || 0,
      salaryMax: job.salaryMax || 0,
      currency: job.currency || 'INR',
      salaryText: job.salaryText || 'Competitive Salary',
      skills: Array.isArray(job.skills) ? job.skills : [],
      description: job.description || '',
      postedAt: job.postedAt ? new Date(job.postedAt) : new Date(),
      postedText: job.postedText || 'Recently posted',
      sourceUrl: job.sourceUrl || job.applyUrl || '', // preserve apply URL exactly
      status: 'Saved',
      statusHistory: [
        {
          status: 'Saved',
          updatedAt: new Date()
        }
      ],
      analysisData: job.analysisData || null
    });

    await savedJob.save();
    return res.status(201).json({ status: 'success', data: savedJob });
  } catch (error) {
    console.error('Error saving job:', error);
    return res.status(500).json({ error: 'Internal server error while saving job.' });
  }
};

// 2. Get Saved Jobs
export const getSavedJobs = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const jobs = await SavedJob.find({ userEmail }).sort({ savedAt: -1 });
    return res.status(200).json({ status: 'success', data: jobs });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    return res.status(500).json({ error: 'Internal server error while fetching saved jobs.' });
  }
};

// 3. Update Saved Job Status
export const updateSavedJobStatus = async (req, res) => {
  try {
    const { savedJobId } = req.params; // MongoDB document _id
    const { status } = req.body;
    const userEmail = req.user.email;

    const allowedStatuses = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status: Status must be one of: ${allowedStatuses.join(', ')}` });
    }

    // Query scoped to current user for security
    const job = await SavedJob.findOne({ _id: savedJobId, userEmail });
    if (!job) {
      return res.status(404).json({ error: 'Saved job not found or access denied.' });
    }

    // Only update and append history if status actually changed
    if (job.status !== status) {
      job.status = status;
      job.statusHistory.push({
        status,
        updatedAt: new Date()
      });
      await job.save();
    }

    return res.status(200).json({ status: 'success', data: job });
  } catch (error) {
    console.error('Error updating saved job status:', error);
    return res.status(500).json({ error: 'Internal server error while updating job status.' });
  }
};

// 4. Delete Saved Job
export const deleteSavedJob = async (req, res) => {
  try {
    const { savedJobId } = req.params; // MongoDB document _id
    const userEmail = req.user.email;

    // Scoped to current user for security
    const result = await SavedJob.findOneAndDelete({ _id: savedJobId, userEmail });
    if (!result) {
      return res.status(404).json({ error: 'Saved job not found or access denied.' });
    }

    return res.status(200).json({ status: 'success', message: 'Job successfully removed from saved list.' });
  } catch (error) {
    console.error('Error deleting saved job:', error);
    return res.status(500).json({ error: 'Internal server error while removing saved job.' });
  }
};

// 5. Get Application Tracker Data
export const getTrackerSummary = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const jobs = await SavedJob.find({ userEmail }).sort({ updatedAt: -1 });

    const summary = {
      total: jobs.length,
      Saved: 0,
      Applied: 0,
      Assessment: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
      Withdrawn: 0
    };

    jobs.forEach(j => {
      if (summary[j.status] !== undefined) {
        summary[j.status]++;
      }
    });

    return res.status(200).json({
      status: 'success',
      data: {
        summary,
        jobs
      }
    });
  } catch (error) {
    console.error('Error getting tracker summary:', error);
    return res.status(500).json({ error: 'Internal server error while fetching tracker data.' });
  }
};
