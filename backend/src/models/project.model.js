import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true, index: true },
  userId: { type: String, required: true, index: true },
  skillIds: { type: [String], required: true, index: true }, // Canonical skill IDs
  missionIds: { type: [String], default: [] }, // Pre-requisite mission instance IDs
  title: { type: String, required: true },
  description: { type: String, required: true },
  domain: { type: String, required: true },
  targetRole: { type: String, required: true },
  company: { type: String, default: '' },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
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
  priority: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], required: true },
  prerequisites: { type: [String], default: [] },
  objectives: { type: [String], default: [] },
  instructions: { type: [String], default: [] },
  deliverables: { type: [String], default: [] },
  evaluationCriteria: { type: [String], default: [] },
  tools: { type: [String], default: [] },
  expectedSkills: { type: [String], default: [] },
  evidenceRequirements: { type: [String], default: [] },
  source: { type: String, enum: ['ai', 'fallback'], default: 'ai' },
  order: { type: Number, default: 0 },
  selectionStatus: {
    type: String,
    enum: ['active', 'excluded_by_time', 'excluded_by_dependency'],
    default: 'active',
    index: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'submitted', 'under_review', 'completed', 'verified', 'skipped'],
    default: 'not_started'
  },
  milestones: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['not_started', 'completed'], default: 'not_started' }
  }]
}, {
  timestamps: true
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
