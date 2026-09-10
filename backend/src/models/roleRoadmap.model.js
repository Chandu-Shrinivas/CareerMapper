import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['Doc', 'Video', 'Article', 'Project', 'Guide'], default: 'Doc' }
}, { _id: false });

const nodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  whyItMatters: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['FOUNDATION', 'CORE', 'TOOLS', 'ADVANCED', 'PROJECTS'],
    default: 'CORE' 
  },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    default: 'Intermediate' 
  },
  estimatedHours: { type: Number, default: 10 },
  prerequisites: [{ type: String }],
  subtopics: [{ type: String }],
  resources: [resourceSchema]
}, { _id: false });

const roleRoadmapSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Engineering' },
  icon: { type: String, default: 'Code' },
  nodes: [nodeSchema]
}, {
  timestamps: true
});

const RoleRoadmap = mongoose.models.RoleRoadmap || mongoose.model('RoleRoadmap', roleRoadmapSchema);
export default RoleRoadmap;
