import mongoose from 'mongoose';

const skillVerificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true, index: true },
  skillId: { type: String, required: true, index: true },
  canonicalSkillId: { type: String, required: true },
  targetRole: { type: String, required: true },
  company: { type: String, default: '' },
  domain: { type: String, required: true },

  // Assessment summary
  assessmentAttempts: { type: Number, default: 0 },
  bestAssessmentScore: { type: Number, default: 0 },
  latestAssessmentScore: { type: Number, default: 0 },
  assessmentPassed: { type: Boolean, default: false },
  assessmentLevel: { type: String, default: 'Needs Foundation' },

  // Mission summary
  totalMissions: { type: Number, default: 0 },
  completedMissions: { type: Number, default: 0 },
  verifiedMissions: { type: Number, default: 0 },
  missionCompletionPercentage: { type: Number, default: 0 },

  // Project summary
  totalProjects: { type: Number, default: 0 },
  completedProjects: { type: Number, default: 0 },
  verifiedProjects: { type: Number, default: 0 },
  projectCompletionPercentage: { type: Number, default: 0 },

  // Evidence summary
  totalEvidence: { type: Number, default: 0 },
  acceptedEvidence: { type: Number, default: 0 },
  verifiedEvidence: { type: Number, default: 0 },
  pendingEvidence: { type: Number, default: 0 },
  rejectedEvidence: { type: Number, default: 0 },

  // Confidence
  confidenceScore: { type: Number, default: 0 },
  verificationStatus: {
    type: String,
    enum: ['UNVERIFIED', 'DEVELOPING', 'DEMONSTRATED', 'STRONG', 'VERIFIED'],
    default: 'UNVERIFIED',
    index: true
  },
  confidenceBreakdown: {
    assessment: {
      score: { type: Number, default: 0 },
      weight: { type: Number, default: 35 },
      contribution: { type: Number, default: 0 }
    },
    projects: {
      score: { type: Number, default: 0 },
      weight: { type: Number, default: 25 },
      contribution: { type: Number, default: 0 }
    },
    evidence: {
      score: { type: Number, default: 0 },
      weight: { type: Number, default: 20 },
      contribution: { type: Number, default: 0 }
    },
    missions: {
      score: { type: Number, default: 0 },
      weight: { type: Number, default: 10 },
      contribution: { type: Number, default: 0 }
    },
    recency: {
      score: { type: Number, default: 0 },
      weight: { type: Number, default: 10 },
      contribution: { type: Number, default: 0 }
    },
    final: { type: Number, default: 0 }
  },

  // Warnings, missing data, and next actions
  verificationWarnings: { type: [String], default: [] },
  missing: { type: [String], default: [] },
  recommendedNextAction: { type: String, default: '' },

  // Metadata
  lastVerifiedAt: { type: Date, default: Date.now },
  lastActivityAt: { type: Date, default: Date.now },
  verificationVersion: { type: Number, default: 1 }
}, {
  timestamps: true
});

// Ensure a single verification document per user, roadmap, and skill
skillVerificationSchema.index({ userId: 1, roadmapId: 1, skillId: 1 }, { unique: true });

const SkillVerification = mongoose.models.SkillVerification || mongoose.model('SkillVerification', skillVerificationSchema);
export default SkillVerification;
