import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  activeTargetRole: {
    roleTitle: { type: String, required: true },
    company: { type: String, default: 'Target Company' },
    domain: { type: String, default: 'Technology' },
    matchScore: { type: Number, default: 80 },
    matchedSkills: [{ type: String }],
    skillsToStrengthen: [{ type: String }],
    source: { type: String, default: 'user_selected' },
    updatedAt: { type: Date, default: Date.now }
  },
  skills: [{
    name: { type: String },
    proficiency: { type: String, default: 'beginner' }
  }],
  onboardingCompleted: { type: Boolean, default: false }
}, { timestamps: true });

const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
