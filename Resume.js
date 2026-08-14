const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fileName: { type: String, required: true },
  parsedText: { type: String },
  analysis: {
    overallScore: { type: Number, required: true }, // 0 to 100
    structureRating: { type: Number },
    formattingScore: { type: Number },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingKeywords: [{ type: String }],
    formattingSuggestions: [{ type: String }],
    summaryFeedback: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', ResumeSchema);