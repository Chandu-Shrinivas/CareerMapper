import mongoose from 'mongoose';

const assessmentTemplateSchema = new mongoose.Schema({
  skillIds: { type: [String], required: true, index: true }, // Sorted canonical skill IDs
  currentLevel: { type: String, required: true },
  requiredLevel: { type: String, required: true },
  domain: { type: String, required: true },
  targetRole: { type: String, required: true },
  company: { type: String, default: '' },
  roadmapMode: { type: String, required: true },
  relevantRoleRequirements: { type: String, default: '' },
  contextHash: { type: String, required: true, index: true },
  assessment: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    difficulty: { type: String, required: true },
    questions: [{
      skillId: { type: String, required: true },
      question: { type: String, required: true },
      type: { type: String, required: true },
      options: { type: [String], default: [] },
      correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
      acceptableAnswers: { type: [mongoose.Schema.Types.Mixed], default: [] },
      explanation: { type: String, required: true },
      difficulty: { type: String, required: true },
      points: { type: Number, default: 10 },
      domain: { type: String, required: true },
      evaluationCriteria: { type: [String], default: [] }
    }]
  },
  assessmentVersion: { type: Number, default: 1 },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
}, {
  timestamps: true
});

assessmentTemplateSchema.index({
  skillIds: 1,
  currentLevel: 1,
  requiredLevel: 1,
  domain: 1,
  targetRole: 1,
  company: 1,
  roadmapMode: 1
}, { unique: true });

const AssessmentTemplate = mongoose.models.AssessmentTemplate || mongoose.model('AssessmentTemplate', assessmentTemplateSchema);
export default AssessmentTemplate;
