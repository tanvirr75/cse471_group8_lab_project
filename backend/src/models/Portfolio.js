const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    avatarInitials: { type: String, default: 'NH' },
    fullName: { type: String, required: true },
    title: { type: String, required: true },
    university: { type: String },
    employabilityScore: { type: Number, default: 0 },
    bio: { type: String },
    links: {
      github: { type: String },
      linkedin: { type: String },
      website: { type: String },
    },
    projects: [
      {
        title: { type: String },
        description: { type: String },
        techStack: [String],
        repoUrl: { type: String },
      },
    ],
    skills: [String],
    certifications: [mongoose.Schema.Types.Mixed],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', PortfolioSchema);