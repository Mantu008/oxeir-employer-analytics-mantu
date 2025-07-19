const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  institution: { type: String, required: true },
  category: { type: String, enum: ['technical', 'business', 'soft-skills', 'certification'], default: 'technical' },
  duration: { type: Number }, // in weeks
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  skills: [{ type: String }],
  description: String,
  url: String,
  rating: { type: Number, min: 1, max: 5 },
  enrollmentCount: { type: Number, default: 0 },
  completionRate: { type: Number, min: 0, max: 100 },
  price: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  instructor: { type: String },
  language: { type: String, default: 'English' },
  certificate: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema); 