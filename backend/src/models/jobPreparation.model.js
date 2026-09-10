import mongoose from 'mongoose';

const preparationTaskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  phaseId: { type: String, default: 'phase-1' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['FOUNDATION', 'SKILL_BUILDING', 'PRACTICE', 'PROJECT', 'INTERVIEW'],
    default: 'SKILL_BUILDING' 
  },
  priority: { 
    type: String, 
    enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], 
    default: 'MEDIUM' 
  },
  estimatedTime: { type: String, default: '2 hours' },
  prerequisites: [{ type: String }],
  status: { type: String, enum: ['PENDING', 'COMPLETED'], default: 'PENDING' },
  completedAt: { type: Date, default: null }
}, { _id: false });

const interviewQuestionSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  category: { type: String, enum: ['Technical', 'Coding', 'Project', 'HR', 'Domain'], default: 'Technical' },
  question: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  type: { type: String, enum: ['multiple_choice', 'subjective'], default: 'subjective' },
  options: [{ type: String }],
  answerGuide: { type: String, default: '' },
  isCompanyReported: { type: Boolean, default: false }
}, { _id: false });

const jobPreparationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  jobId: { type: String, required: true, index: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  location: { type: String, default: '' },
  source: { type: String, default: 'JSearch' },
  extractedSkills: [{ type: String }],
  matchedSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  readinessScore: { type: Number, default: 0 },
  phases: [{
    phaseId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    estimatedDays: { type: Number, default: 7 }
  }],
  tasks: [preparationTaskSchema],
  interviewQuestions: [interviewQuestionSchema],
  status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'ARCHIVED'], default: 'ACTIVE' }
}, {
  timestamps: true
});

jobPreparationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const JobPreparation = mongoose.models.JobPreparation || mongoose.model('JobPreparation', jobPreparationSchema);
export default JobPreparation;
