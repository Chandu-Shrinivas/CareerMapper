import mongoose from 'mongoose';

const interviewPrepSchema = new mongoose.Schema({
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  contextKey: {
    type: String,
    required: true,
    index: true
  },
  company: {
    type: String,
    required: true
  },
  targetRole: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true,
    default: 'General'
  },
  preparationMatrix: [{
    skillId: { type: String, required: true },
    skillName: { type: String, required: true },
    requiredProficiency: { type: String, default: 'intermediate' },
    currentProficiency: { type: String, default: 'beginner' },
    status: { 
      type: String, 
      enum: ['READY', 'STRONG', 'NEEDS_PRACTICE', 'MISSING', 'HIGH_PRIORITY'],
      default: 'NEEDS_PRACTICE'
    },
    gap: { type: String, default: '' },
    priority: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], default: 'HIGH' },
    reason: { type: String, default: '' },
    recommendedAction: { type: String, default: '' }
  }],
  topics: [{
    topicId: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, default: 'Technical' },
    importance: { type: String, default: 'HIGH' },
    priority: { type: String, default: 'HIGH' },
    estimatedMinutes: { type: Number, default: 30 },
    relatedSkills: [{ type: String }],
    status: { type: String, enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'], default: 'NOT_STARTED' },
    reason: { type: String, default: '' }
  }],
  questionBank: [{
    questionId: { type: String, required: true },
    category: { type: String, default: 'technical' },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
    skillId: { type: String, default: '' },
    topic: { type: String, default: '' },
    question: { type: String, required: true },
    type: { type: String, enum: ['multiple_choice', 'short_answer', 'scenario', 'subjective'], default: 'multiple_choice' },
    options: [{ type: String }],
    correctAnswer: { type: String, select: false }, // Hidden from default queries for security
    evaluationCriteria: { type: String, select: false }, // Hidden from default queries for security
    points: { type: Number, default: 10 },
    isCompanyReported: { type: Boolean, default: false }
  }],
  readinessScore: {
    overall: { type: Number, default: 0 },
    skillReadiness: { type: Number, default: 0 },
    technicalReadiness: { type: Number, default: 0 },
    domainReadiness: { type: Number, default: 0 },
    interviewPerformance: { type: Number, default: 0 },
    weakAreas: [{ type: String }],
    strongAreas: [{ type: String }],
    blockingRequirements: [{ type: String }],
    explanation: { type: String, default: '' }
  },
  nextInterviewMove: {
    title: { type: String, default: 'Complete Preparation Matrix' },
    reason: { type: String, default: 'Identify key preparation priorities' },
    topicId: { type: String, default: '' },
    priority: { type: String, default: 'HIGH' },
    estimatedMinutes: { type: Number, default: 30 },
    type: { type: String, enum: ['PRACTICE_TOPIC', 'QUESTION_BANK', 'SIMULATION', 'REVIEW_GAPS'], default: 'PRACTICE_TOPIC' }
  },
  version: {
    type: Number,
    default: 1
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const InterviewPrep = mongoose.models.InterviewPrep || mongoose.model('InterviewPrep', interviewPrepSchema);
export default InterviewPrep;
