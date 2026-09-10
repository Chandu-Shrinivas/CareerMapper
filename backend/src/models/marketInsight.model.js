import mongoose from 'mongoose';

const marketInsightSchema = new mongoose.Schema({
  role: { type: String, required: true },
  country: { type: String, required: true },
  overview: {
    description: String,
    responsibilities: [String],
    environment: String,
    experienceLevels: String,
    technologies: [String]
  },
  demand: {
    status: { type: String, enum: ['growing', 'stable', 'declining', 'mixed', 'insufficient_data'], default: 'insufficient_data' },
    confidence: { type: String, enum: ['high', 'medium', 'low'], default: 'low' },
    signals: [{
      signal: String,
      source: String
    }]
  },
  historicalEvidence: [{
    year: Number,
    metric: String,
    value: mongoose.Schema.Types.Mixed,
    unit: String,
    source: {
      title: String,
      organization: String,
      url: String
    },
    confidence: String
  }],
  historicalTrend: {
    available: { type: Boolean, default: false },
    reason: String,
    metric: String,
    baseYear: Number,
    baseValue: Number,
    data: [{
      year: Number,
      value: mongoose.Schema.Types.Mixed, // Number or null
      type: { type: String, enum: ['base', 'observed', 'derived', 'estimated', 'predicted'] },
      metric: String,
      unit: String,
      source: String,
      url: String,
      evidence: String
    }],
    method: String,
    observedEvidence: [{
      year: Number,
      growth: mongoose.Schema.Types.Mixed,
      unit: String,
      source: String,
      url: String,
      evidence: String
    }],
    confidence: { type: String, enum: ['high', 'medium', 'low'] }
  },
  skills: {
    core: [String],
    emerging: [String],
    stable: [String],
    declining: [String]
  },
  companies: [{
    company: String,
    role: String,
    location: String,
    experience: String,
    requiredSkills: [String],
    preferredSkills: [String],
    salary: String,
    postingDate: String,
    source: {
      title: String,
      url: String
    }
  }],
  salary: [{
    experienceLevel: String,
    min: Number,
    max: Number,
    currency: String,
    period: String,
    source: {
      title: String,
      organization: String,
      url: String
    }
  }],
  sources: [{
    title: String,
    organization: String,
    sourceType: String,
    url: String
  }],
  generatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

marketInsightSchema.index({ role: 1, country: 1 });

export default mongoose.models.MarketInsight || mongoose.model('MarketInsight', marketInsightSchema);
