const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },

  // main ব্রাঞ্চ থেকে আসা নতুন ফিল্ড
  cloudinaryPublicId: { type: String },

  analysis: {
    // আপনার আগের কোড (Frontend যাতে কাজ করে)
    score: Number,
    feedback: [String],
    topFixes: [String],

    // টিমের নতুন কোড (একসাথে যোগ করা হয়েছে)
    structureScore: Number,
    keywords: [String],
    sections: [
      {
        name: String,
        status: String,
        comment: String
      }
    ]
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', ResumeSchema);