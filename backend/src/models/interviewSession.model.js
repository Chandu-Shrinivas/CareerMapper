import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  question: { type: String, required: true },
  userAnswer: { type: String, required: true },
  feedback: { type: String, default: '' },
  score: { type: Number, default: 0 },
  evaluatedAt: { type: Date, default: Date.now }
}, { _id: false });

const interviewSessionSchema = new mongoose.Schema({
  preparationId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPreparation', required: true, index: true },
  userId: { type: String, required: true, index: true },
  mode: { type: String, enum: ['Mixed', 'Technical', 'Coding', 'Project', 'HR'], default: 'Mixed' },
  questions: [{
    questionId: { type: String, required: true },
    category: { type: String, default: 'Technical' },
    question: { type: String, required: true },
    difficulty: { type: String, default: 'Intermediate' }
  }],
  responses: [responseSchema],
  overallScore: { type: Number, default: 0 },
  status: { type: String, enum: ['IN_PROGRESS', 'COMPLETED'], default: 'IN_PROGRESS' }
}, {
  timestamps: true
});

const InterviewSession = mongoose.models.InterviewSession || mongoose.model('InterviewSession', interviewSessionSchema);
export default InterviewSession;
