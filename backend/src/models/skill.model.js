import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  canonical: { type: String, required: true, unique: true, index: true },
  display: { type: String, required: true },
  category: { type: String, required: true },
  iconUrl: { type: String, default: '' },
  iconType: { type: String, enum: ['devicon', 'simpleicons', 'lucide'], default: 'lucide' },
  iconName: { type: String, default: 'Wrench' },
  // Extended fields for Adaptive Roadmap
  aliases: { type: [String], default: [] },
  domain: { type: String, default: '' },
  parentSkill: { type: String, default: null },
  prerequisites: { type: [String], default: [] }
});

const Skill = mongoose.models.Skill || mongoose.model('Skill', skillSchema);

export default Skill;
