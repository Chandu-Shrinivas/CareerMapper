import mongoose from 'mongoose';

const jobAnalysisSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true, index: true },
  extractedSkills: [{ type: String }],
  structuredDescription: {
    aboutRole: { type: String, default: '' },
    responsibilities: [{ type: String }],
    requiredSkills: [{ type: String }],
    preferredSkills: [{ type: String }],
    experience: { type: String, default: '' },
    education: { type: String, default: '' },
    benefits: [{ type: String }],
    otherRequirements: { type: String, default: '' }
  },
  generatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

// Configure TTL index to automatically remove old cache entries
jobAnalysisSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const JobAnalysis = mongoose.models.JobAnalysis || mongoose.model('JobAnalysis', jobAnalysisSchema);

export default JobAnalysis;
