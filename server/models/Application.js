const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, enum: ['applied', 'shortlisted', 'interviewed', 'hired', 'rejected'], default: 'applied' },
  appliedAt: { type: Date, default: Date.now },
  shortlistedAt: { type: Date },
  interviewedAt: { type: Date },
  hiredAt: { type: Date },
  rejectedAt: { type: Date },
  location: {
    city: String,
    country: String,
    coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
  },
  source: { type: String, enum: ['direct', 'referral', 'job-board', 'social-media'], default: 'direct' },
  resumeUrl: String,
  coverLetter: String,
  notes: String,
  rating: { type: Number, min: 1, max: 5 },
  skills: [{ type: String }],
  experience: { type: Number }, // years of experience
  education: {
    degree: String,
    institution: String,
    graduationYear: Number
  }
});

module.exports = mongoose.model('Application', ApplicationSchema); 