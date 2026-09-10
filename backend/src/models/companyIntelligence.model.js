import mongoose from 'mongoose';

const companyIntelligenceSchema = new mongoose.Schema({
  contextKey: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  company: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  targetRole: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  domain: {
    type: String,
    required: true,
    default: 'General',
    index: true
  },
  companyOverview: {
    industry: { type: String, default: 'General' },
    companySize: { type: String, default: 'Enterprise / Mid-size' },
    description: { type: String, default: '' },
    businessAreas: [{ type: String }]
  },
  roleExpectations: {
    coreResponsibilities: [{ type: String }],
    techStack: [{ type: String }],
    experienceExpectations: { type: String, default: 'Standard' }
  },
  skillRequirements: {
    requiredSkills: [{ type: String }],
    preferredSkills: [{ type: String }]
  },
  interviewAreas: {
    technicalTopics: [{ type: String }],
    behavioralAreas: [{ type: String }],
    typicalStages: [{ type: String }]
  },
  sources: [{
    title: { type: String },
    source: { type: String },
    url: { type: String },
    confidence: { type: Number, default: 0.9 }
  }],
  isFallback: {
    type: Boolean,
    default: false
  },
  version: {
    type: Number,
    default: 1
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days TTL cache
  }
}, {
  timestamps: true
});

const CompanyIntelligence = mongoose.models.CompanyIntelligence || mongoose.model('CompanyIntelligence', companyIntelligenceSchema);
export default CompanyIntelligence;
