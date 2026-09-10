import mongoose from 'mongoose';

const evidenceAnalysisSchema = new mongoose.Schema({
  evidenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Evidence', required: true, index: true },
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true, index: true },
  userId: { type: String, required: true, index: true },
  skillIds: { type: [String], required: true }, // Canonical skill IDs
  analysis: { type: mongoose.Schema.Types.Mixed, default: {} },
  relevant: { type: Boolean, required: true },
  confidence: { type: Number, required: true },
  matchedSkills: { type: [String], default: [] },
  missingEvidence: { type: [String], default: [] },
  reasoning: { type: String, required: true },
  provider: { type: String, default: 'Gemini' },
  model: { type: String, default: 'gemini-1.5-flash' },
  version: { type: Number, default: 1 },
  analyzedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
}, {
  timestamps: true
});

evidenceAnalysisSchema.index({ evidenceId: 1, version: 1 }, { unique: true });

const EvidenceAnalysis = mongoose.models.EvidenceAnalysis || mongoose.model('EvidenceAnalysis', evidenceAnalysisSchema);
export default EvidenceAnalysis;
