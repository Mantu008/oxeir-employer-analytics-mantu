const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['open', 'filled', 'archived', 'draft'], default: 'draft' },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
  skillsRequired: [{ type: String }],
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' }
  },
  location: {
    city: String,
    country: String,
    remote: { type: Boolean, default: false }
  },
  department: { type: String },
  experienceLevel: { type: String, enum: ['entry', 'mid', 'senior', 'lead'] },
  jobType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  views: { type: Number, default: 0 }
});

module.exports = mongoose.model('Job', JobSchema); 