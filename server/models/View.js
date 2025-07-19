const mongoose = require('mongoose');

const ViewSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, required: true },
  viewedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('View', ViewSchema); 