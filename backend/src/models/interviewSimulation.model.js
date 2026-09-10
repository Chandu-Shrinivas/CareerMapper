import mongoose from 'mongoose';

const interviewSimulationSchema = new mongoose.Schema({
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
  mode: {
    type: String,
    enum: ['Technical', 'Behavioral', 'Domain', 'Mixed', 'Company'],
    default: 'Mixed'
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  currentDifficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  questions: [{
    questionId: { type: String, required: true },
    category: { type: String, default: 'technical' },
    question: { type: String, required: true },
    type: { type: String, default: 'short_answer' },
    options: [{ type: String }],
    difficulty: { type: String, default: 'intermediate' }
  }],
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  windowResults: [{
    type: Boolean
  }],
  responses: [{
    questionId: { type: String, required: true },
    questionText: { type: String },
    userAnswer: { type: String, required: true },
    score: { type: Number, default: 0 }, // 0 to 100
    isCorrect: { type: Boolean, default: false },
    feedback: { type: String, default: '' },
    strength: { type: String, default: 'Moderate' },
    missingConcepts: [{ type: String }],
    answeredAt: { type: Date, default: Date.now }
  }],
  scoreSummary: {
    overallScore: { type: Number, default: 0 },
    technicalScore: { type: Number, default: 0 },
    domainScore: { type: Number, default: 0 },
    behavioralScore: { type: Number, default: 0 },
    strongestAreas: [{ type: String }],
    weakestAreas: [{ type: String }],
    recommendedTopics: [{ type: String }]
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const InterviewSimulation = mongoose.models.InterviewSimulation || mongoose.model('InterviewSimulation', interviewSimulationSchema);
export default InterviewSimulation;
