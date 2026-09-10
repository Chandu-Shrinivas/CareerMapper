import mongoose from 'mongoose';

const assessmentQuestionSchema = new mongoose.Schema({
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true, index: true },
  skillId: { type: String, required: true }, // Canonical skill ID
  question: { type: String, required: true },
  type: {
    type: String,
    enum: ['mcq', 'multiple_select', 'true_false', 'short_answer', 'numerical', 'scenario', 'code', 'practical'],
    required: true
  },
  options: { type: [String], default: [] },
  correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true }, // MCQ: string, Multiple Select: array, True/False: bool/string, Numerical: number
  acceptableAnswers: { type: [mongoose.Schema.Types.Mixed], default: [] }, // acceptable text or regex patterns
  explanation: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  points: { type: Number, default: 10 },
  domain: { type: String, required: true },
  evaluationCriteria: { type: [String], default: [] },
  order: { type: Number, default: 0 },
  source: { type: String, enum: ['ai', 'fallback'], default: 'ai' },
  questionVersion: { type: Number, default: 1 }
}, {
  timestamps: true
});

const AssessmentQuestion = mongoose.models.AssessmentQuestion || mongoose.model('AssessmentQuestion', assessmentQuestionSchema);
export default AssessmentQuestion;
