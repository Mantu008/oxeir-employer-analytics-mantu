const mongoose = require('mongoose');

const CourseCompletionSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  completedAt: { type: Date, default: Date.now },
  grade: { type: String, enum: ['A', 'B', 'C', 'D', 'F', 'Pass', 'Fail'] },
  certificateUrl: String,
  wasHired: { type: Boolean, default: false },
  hireDate: { type: Date },
  performanceRating: { type: Number, min: 1, max: 5 }, // How well they performed in the role
  notes: String
});

module.exports = mongoose.model('CourseCompletion', CourseCompletionSchema); 