import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  company: { type: String, default: '' },
  targetRole: { type: String, required: true },
  domain: { type: String, default: 'General' },
  jobId: { type: String, default: null },
  deadline: { type: Date, default: null },
  availability: {
    hoursPerWeek: { type: Number, default: 10 }
  },
  readinessScore: { type: Number, default: 0 },
  phases: [{
    phaseId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    estimatedHours: { type: Number, default: 0 },
    skills: [{
      canonicalId: { type: String, required: true },
      displayName: { type: String, required: true },
      proficiencyLevel: { type: String, default: 'beginner' },
      priority: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' }
    }]
  }],
  prioritizedSkills: [{
    canonicalId: { type: String, required: true },
    displayName: { type: String, required: true },
    priority: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
    requirementType: { type: String, enum: ['required', 'preferred'], default: 'required' }
  }],
  version: { type: Number, default: 1 },
  previousVersion: { type: String, default: null },
  recalculatedAt: { type: Date, default: null },
  recalculationReason: { type: String, default: '' },
  adaptationSummary: { type: mongoose.Schema.Types.Mixed, default: null },
  activePhase: { type: String, default: '' },
  roadmapState: { type: String, enum: ['ACTIVE', 'COMPLETED', 'AT_RISK', 'DEADLINE_CHANGED', 'TARGET_CHANGED'], default: 'ACTIVE' }
}, {
  timestamps: true
});

const Roadmap = mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;
