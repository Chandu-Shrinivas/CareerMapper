import mongoose from 'mongoose';

const roadmapSnapshotSchema = new mongoose.Schema({
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true, index: true },
  version: { type: Number, required: true },
  roadmapData: { type: mongoose.Schema.Types.Mixed, required: true },
  recalculationReason: { type: String, default: '' },
  adaptationSummary: { type: mongoose.Schema.Types.Mixed, default: null }
}, {
  timestamps: true
});

// Ensure uniqueness per roadmap and version combination
roadmapSnapshotSchema.index({ roadmapId: 1, version: 1 }, { unique: true });

const RoadmapSnapshot = mongoose.models.RoadmapSnapshot || mongoose.model('RoadmapSnapshot', roadmapSnapshotSchema);

export default RoadmapSnapshot;
