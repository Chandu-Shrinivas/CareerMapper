import mongoose from 'mongoose';

const jobAnalysisSchema = new mongoose.Schema({
  descriptionHash: { type: String, required: true, index: true },
  normalizedText: { type: String, required: true },
  provider: { type: String, required: true, default: 'gemini' },
  model: { type: String, required: true, default: 'gemini-2.5-flash' },
  promptVersion: { type: String, required: true, default: 'job-analysis-v1' },
  schemaVersion: { type: String, required: true, default: 'job-roadmap-v1' },
  analysis: { type: mongoose.Schema.Types.Mixed, required: true },
  extractedSkills: [{ type: String }],
  structuredDescription: { type: mongoose.Schema.Types.Mixed }
}, {
  timestamps: true
});

// Index for multi-key lookup: hash + promptVersion + schemaVersion
jobAnalysisSchema.index({ descriptionHash: 1, promptVersion: 1, schemaVersion: 1 }, { unique: true });

const JobAnalysis = mongoose.models.JobAnalysis || mongoose.model('JobAnalysis', jobAnalysisSchema);

export default JobAnalysis;
