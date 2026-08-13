const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  targetRole: { type: String, required: true },
  currentSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  readinessPercentage: { type: Number, required: true },
  roadmapSteps: [
    {
      stepNumber: { type: Number },
      title: { type: String },
      focusArea: { type: String },
      skillsToLearn: [{ type: String }],
      recommendedProjects: [{ type: String }],
      suggestedResources: [{ type: String }]
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);