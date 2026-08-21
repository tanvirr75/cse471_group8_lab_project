const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    status: {
      type: String,
      enum: ["applied", "under_review", "interview", "rejected", "accepted"],
      default: "applied",
    },
    // Feature 7 & 11: AI Job Match Percentage at the time of applying
    matchPercentage: { type: Number, default: 0 },
    
    // Feature 13: Link to the specific resume file they used for this application
    resumeUsed: { type: String, default: '' },
    
    // Feature 14: Interview Scheduling
    interviewDetails: {
      date: { type: String },
      time: { type: String },
      platform: { type: String },
      linkOrLocation: { type: String },
      message: { type: String }
    },

    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
