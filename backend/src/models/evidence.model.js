import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true, index: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  skillIds: { type: [String], required: true }, // Canonical skill IDs
  type: {
    type: String,
    enum: [
      'github_repo', 'portfolio_url', 'file', 'report', 'spreadsheet', 'screenshot',
      'presentation', 'certificate', 'assessment_result', 'video_demo', 'manual_evidence',
      'external_url'
    ],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  fileMetadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  submittedAt: { type: Date, default: Date.now },
  verificationStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'needs_revision', 'verified'],
    default: 'pending',
    index: true
  },
  verificationNotes: { type: String, default: '' },
  source: { type: String, enum: ['user', 'automatic'], default: 'user' }
}, {
  timestamps: true
});

const Evidence = mongoose.models.Evidence || mongoose.model('Evidence', evidenceSchema);
export default Evidence;
