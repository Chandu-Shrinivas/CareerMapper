import mongoose from 'mongoose';

const assessmentAttemptSchema = new mongoose.Schema({
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true, index: true },
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true, index: true },
  userId: { type: String, required: true, index: true },
  assessmentVersion: { type: Number, required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    answer: { type: mongoose.Schema.Types.Mixed, required: true }
  }],
  score: { type: Number, default: 0 },
  earnedPoints: { type: Number, default: 0 },
  maximumPoints: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  durationSeconds: { type: Number, default: 0 },
  difficultyProgression: { type: [String], default: [] },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  result: { type: String, enum: ['passed', 'failed'] },
  questionResults: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    questionVersion: { type: Number, required: true },
    answer: { type: mongoose.Schema.Types.Mixed },
    correct: { type: Boolean, required: true },
    pointsEarned: { type: Number, required: true },
    feedback: { type: String, default: '' },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true }
  }]
}, {
  timestamps: true
});

const AssessmentAttempt = mongoose.models.AssessmentAttempt || mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
export default AssessmentAttempt;
