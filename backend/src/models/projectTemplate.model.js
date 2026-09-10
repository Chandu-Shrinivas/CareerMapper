import mongoose from 'mongoose';

const projectTemplateSchema = new mongoose.Schema({
  skillIds: { type: [String], required: true, index: true }, // Sorted canonical skill IDs
  currentLevel: { type: String, required: true },
  requiredLevel: { type: String, required: true },
  domain: { type: String, required: true },
  targetRole: { type: String, required: true },
  company: { type: String, default: '' },
  roadmapMode: { type: String, required: true },
  relevantRoleRequirements: { type: String, default: '' },
  projects: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'practical_project', 'case_study', 'design_challenge', 'engineering_exercise',
        'analysis', 'simulation', 'portfolio_piece', 'presentation', 'research',
        'implementation', 'assessment_project'
      ],
      required: true
    },
    estimatedMinutes: { type: Number, required: true },
    objectives: { type: [String], default: [] },
    instructions: { type: [String], default: [] },
    deliverables: { type: [String], default: [] },
    evaluationCriteria: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    evidenceRequirements: { type: [String], default: [] },
    milestones: [{
      title: { type: String, required: true },
      description: { type: String, default: '' }
    }]
  }],
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // 7-day TTL cache
}, {
  timestamps: true
});

// Compound index to match target context
projectTemplateSchema.index({
  skillIds: 1,
  currentLevel: 1,
  requiredLevel: 1,
  domain: 1,
  targetRole: 1,
  company: 1,
  roadmapMode: 1
}, { unique: true });

const ProjectTemplate = mongoose.models.ProjectTemplate || mongoose.model('ProjectTemplate', projectTemplateSchema);
export default ProjectTemplate;
