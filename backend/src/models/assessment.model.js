import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true, index: true },
  userId: { type: String, required: true, index: true },
  skillIds: { type: [String], required: true, index: true }, // Canonical skill IDs
  targetRole: { type: String, required: true },
  company: { type: String, default: '' },
  domain: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['knowledge', 'practical', 'scenario', 'technical', 'case_study', 'simulation', 'mixed'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  estimatedMinutes: { type: Number, required: true },
  missionIds: { type: [String], default: [] },
  projectIds: { type: [String], default: [] },
  passingScore: { type: Number, default: 70 },
  maxScore: { type: Number, default: 100 },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'passed', 'failed', 'expired'],
    default: 'not_started'
  },
  selectionStatus: {
    type: String,
    enum: ['active', 'excluded_by_time', 'excluded_by_dependency'],
    default: 'active',
    index: true
  },
  attemptCount: { type: Number, default: 0 },
  bestScore: { type: Number, default: null },
  currentScore: { type: Number, default: null },
  source: { type: String, enum: ['ai', 'fallback'], default: 'ai' },
  assessmentVersion: { type: Number, default: 1 },
  completedAt: { type: Date, default: null }
}, {
  timestamps: true
});

const Assessment = mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema);
export default Assessment;
