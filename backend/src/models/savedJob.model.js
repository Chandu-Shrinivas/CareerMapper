import mongoose from 'mongoose';

const savedJobSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    index: true,
  },
  jobId: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
    default: 'JSearch',
  },
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  companyLogo: {
    type: String,
    default: '',
  },
  companyDomain: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
  workMode: {
    type: String,
    default: '',
  },
  employmentType: {
    type: String,
    default: '',
  },
  experience: {
    type: String,
    default: '',
  },
  salaryMin: {
    type: Number,
    default: 0,
  },
  salaryMax: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  salaryText: {
    type: String,
    default: 'Competitive Salary',
  },
  skills: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  description: {
    type: String,
    default: '',
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  postedText: {
    type: String,
    default: 'Recently posted',
  },
  sourceUrl: {
    type: String,
    default: '',
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn'],
    default: 'Saved',
  },
  statusHistory: [
    {
      status: {
        type: String,
        required: true,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    }
  ],
  analysisData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  }
}, {
  timestamps: true,
});

// Ensure a user cannot save the same job (defined by source + jobId) twice.
savedJobSchema.index({ userEmail: 1, source: 1, jobId: 1 }, { unique: true });

export const SavedJob = mongoose.model('SavedJob', savedJobSchema);
