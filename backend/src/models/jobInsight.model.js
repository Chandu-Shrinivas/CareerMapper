import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  location: { type: String, required: true },
  country: { type: String, default: 'India' },
  workMode: { type: String, enum: ['Remote', 'Hybrid', 'On-site'], default: 'On-site' },
  employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], default: 'Full-time' },
  experience: { type: String, default: '1-3 years' },
  salaryMin: { type: Number, default: 0 },
  salaryMax: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  salaryText: { type: String, default: '' },
  skills: [{ type: String }],
  description: { type: String, default: '' },
  postedAt: { type: Date, default: Date.now },
  postedText: { type: String, default: 'Recently' },
  source: { type: String, default: 'LinkedIn' },
  sourceUrl: { type: String, required: true }
}, { _id: false });

const jobInsightSchema = new mongoose.Schema({
  queryKey: { type: String, required: true, unique: true, index: true },
  query: { type: String, required: true },
  location: { type: String, default: 'all' },
  country: { type: String, default: 'India' },
  jobs: [jobSchema],
  nextPageCursor: { type: String, default: null },
  generatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
});

const JobInsight = mongoose.model('JobInsight', jobInsightSchema);

export default JobInsight;
