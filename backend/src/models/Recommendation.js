const mongoose = require('mongoose');

// Feature 11: Smart Job Recommendation System
// Caches one scored recommendation per (student, job) pair so the engine only
// has to re-score a job when it is new or when the student's profile changed,
// instead of recomputing every match on every request.
const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    // Final 0-100 compatibility score produced by recommendationEngine
    matchPercent: { type: Number, required: true, min: 0, max: 100 },
    // Job skills the student already has / lacks - rendered as chips in the UI
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    // Human-readable explanations ("Matches 3 of your skills: React, Node.js")
    reasons: [{ type: String }],
    // When this score was last computed; compared against Job.updatedAt and
    // UserProfile.updatedAt to decide whether the cache is stale
    computedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// One cached score per (student, job) pair - the engine upserts against this.
recommendationSchema.index({ userId: 1, jobId: 1 }, { unique: true });
// Fast lookup of a student's recommendations already sorted by best match.
recommendationSchema.index({ userId: 1, matchPercent: -1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);
