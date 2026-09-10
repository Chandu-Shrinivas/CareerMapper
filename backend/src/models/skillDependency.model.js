import mongoose from 'mongoose';

const skillDependencySchema = new mongoose.Schema({
  skillId: { type: String, required: true, index: true },
  prerequisiteSkillId: { type: String, required: true, index: true },
  relationshipType: { type: String, enum: ['requires', 'recommended'], default: 'requires' },
  confidence: { type: Number, default: 1.0 },
  source: { type: String, default: 'seed' },
  validated: { type: Boolean, default: false }
});

// Prevent duplicate dependency pairings
skillDependencySchema.index({ skillId: 1, prerequisiteSkillId: 1 }, { unique: true });

const SkillDependency = mongoose.models.SkillDependency || mongoose.model('SkillDependency', skillDependencySchema);

export default SkillDependency;
