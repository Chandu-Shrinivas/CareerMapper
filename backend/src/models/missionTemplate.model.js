import mongoose from 'mongoose';

const missionTemplateSchema = new mongoose.Schema({
  skillId: { type: String, required: true, index: true },
  currentLevel: { type: String, required: true },
  requiredLevel: { type: String, required: true },
  domain: { type: String, required: true },
  targetRole: { type: String, required: true },
  company: { type: String, default: '' },
  roadmapMode: { type: String, required: true },
  relevantRoleRequirements: { type: String, default: '' },
  missions: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['learn', 'practice', 'project', 'assessment', 'simulation', 'evidence', 'review', 'interview'],
      required: true
    },
    instructions: { type: String, default: '' },
    expectedOutcome: { type: String, default: '' },
    deliverables: { type: String, default: '' },
    evaluationCriteria: { type: String, default: '' },
    estimatedMinutes: { type: Number, required: true }
  }],
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // 7-day TTL cache
}, {
  timestamps: true
});

// Compound index to match complete target context
missionTemplateSchema.index({
  skillId: 1,
  currentLevel: 1,
  requiredLevel: 1,
  domain: 1,
  targetRole: 1,
  company: 1,
  roadmapMode: 1
}, { unique: true });

const MissionTemplate = mongoose.models.MissionTemplate || mongoose.model('MissionTemplate', missionTemplateSchema);
export default MissionTemplate;
