import mongoose from 'mongoose';

const jobRoadmapNodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Core Preparation' },
  type: { 
    type: String, 
    enum: ['skill', 'technology', 'concept', 'revision', 'interview', 'project', 'assessment', 'group'],
    default: 'technology'
  },
  importance: { 
    type: String, 
    enum: ['critical', 'required', 'preferred', 'nice-to-have'],
    default: 'required'
  },
  canonicalSkillId: { type: String, default: '' },
  estimatedMinutes: { type: Number, default: 120 },
  whyRequired: { type: String, default: '' },
  jobEvidence: { type: String, default: '' },
  preparationGoal: { type: String, default: '' },
  resources: [{
    title: { type: String, default: '' },
    url: { type: String, default: '' }
  }],
  interviewRelevance: { type: String, default: 'high' },
  prerequisites: [{ type: String }],
  completionMode: { type: String, enum: ['all', 'choose-one'], default: 'all' },
  progressEligible: { type: Boolean, default: true },
  status: { type: String, enum: ['default', 'learning', 'done', 'skipped'], default: 'default' }
}, { _id: false });

const jobRoadmapEdgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  relationType: { 
    type: String, 
    enum: ['main-flow', 'prerequisite', 'child', 'alternative', 'related'],
    default: 'prerequisite'
  }
}, { _id: false });

const jobPreparationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  jobId: { type: String, required: true, index: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  location: { type: String, default: '' },
  source: { type: String, default: 'JSearch' },
  canonicalRoleId: { type: String, default: 'software-engineer' },
  
  jobSnapshot: {
    jobId: { type: String },
    jobTitle: { type: String },
    company: { type: String },
    descriptionHash: { type: String },
    analyzedAt: { type: Date, default: Date.now },
    analysisVersion: { type: String, default: 'job-analysis-v1' }
  },

  requirements: [{
    id: { type: String },
    name: { type: String },
    canonicalSkillId: { type: String },
    category: { type: String },
    importance: { type: String },
    evidence: { type: String },
    source: { type: String },
    reason: { type: String }
  }],

  nodes: [jobRoadmapNodeSchema],
  edges: [jobRoadmapEdgeSchema],

  nodeStatuses: {
    type: Map,
    of: String,
    default: {}
  },

  readiness: {
    overallReadiness: { type: Number, default: 0 },
    criticalReadiness: { type: Number, default: 0 },
    requiredReadiness: { type: Number, default: 0 },
    preferredReadiness: { type: Number, default: 0 },
    totalWeight: { type: Number, default: 0 },
    matchedWeight: { type: Number, default: 0 },
    matchedRequirements: [{ type: mongoose.Schema.Types.Mixed }],
    partialRequirements: [{ type: mongoose.Schema.Types.Mixed }],
    missingRequirements: [{ type: mongoose.Schema.Types.Mixed }]
  },

  progress: {
    totalNodes: { type: Number, default: 0 },
    completedNodes: { type: Number, default: 0 },
    eligibleNodes: { type: Number, default: 0 },
    progressPercentage: { type: Number, default: 0 }
  },

  interviewQuestions: [{
    questionId: { type: String },
    category: { type: String },
    question: { type: String },
    difficulty: { type: String },
    answerGuide: { type: String }
  }],

  status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'ARCHIVED'], default: 'ACTIVE' }
}, {
  timestamps: true
});

jobPreparationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const JobPreparation = mongoose.models.JobPreparation || mongoose.model('JobPreparation', jobPreparationSchema);
export default JobPreparation;
