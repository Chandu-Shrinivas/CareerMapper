import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true, index: true },
  skillId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['learn', 'practice', 'project', 'assessment', 'simulation', 'evidence', 'review', 'interview'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  estimatedMinutes: { type: Number, required: true },
  xp: { type: Number, required: true },
  priority: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], required: true },
  prerequisites: { type: [String], default: [] },
  instructions: { type: String, default: '' },
  expectedOutcome: { type: String, default: '' },
  deliverables: { type: String, default: '' },
  evaluationCriteria: { type: String, default: '' },
  source: { type: String, enum: ['ai', 'fallback'], default: 'ai' },
  order: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'verified', 'skipped'],
    default: 'not_started'
  }
}, {
  timestamps: true
});

const Mission = mongoose.models.Mission || mongoose.model('Mission', missionSchema);
export default Mission;
