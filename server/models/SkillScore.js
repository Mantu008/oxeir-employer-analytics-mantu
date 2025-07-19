const mongoose = require('mongoose');

const SkillScoreSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  skill: { type: String, required: true },
  score: { type: Number, min: 0, max: 100, required: true },
  category: { type: String, enum: ['technical', 'soft', 'domain'], default: 'technical' },
  assessmentType: { type: String, enum: ['test', 'interview', 'portfolio', 'certification'], default: 'test' },
  evaluatedAt: { type: Date, default: Date.now },
  evaluatorId: { type: mongoose.Schema.Types.ObjectId },
  notes: String,
  proficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'intermediate' }
});

module.exports = mongoose.model('SkillScore', SkillScoreSchema); 