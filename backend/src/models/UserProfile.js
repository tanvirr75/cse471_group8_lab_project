const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
  {
    // Link to the base User account (1-to-1 relationship)
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      unique: true 
    },
    
    // Academic Info
    university: { type: String, default: '' },
    department: { type: String, default: '' },
    graduationYear: { type: Number },

    // Professional Links
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },
    
    // Stored Cloudinary link for the uploaded PDF
    resumeUrl: { type: String, default: '' },

    // Feature 1: GitHub Integrated Data
    githubData: {
      repos: { type: Number, default: 0 },
      totalCommits: { type: Number, default: 0 },
      topLanguages: [{ type: String }],
      lastSynced: { type: Date }
    },

    // Feature 9: Portfolio Builder Data
    projects: [{
      title: String,
      description: String,
      link: String,
      techStack: [{ type: String }]
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      link: String
    }],
    experience: [{
      title: String,
      company: String,
      startDate: Date,
      endDate: Date,
      current: { type: Boolean, default: false },
      description: String
    }],

    // Feature 10: AI Career Recommendations
    careerInterests: [{ type: String }],

    // Core skills for the matching engine
    skills: [{ type: String }],

    // Feature 8: Employability Score
    employabilityScore: { type: Number, default: 0 },

    // Feature 4: Career Readiness Analysis
    careerReadiness: [{
      role: String,
      score: Number,
      missingSkills: [{ type: String }]
    }],

    // Feature 6: Personalized Learning Roadmap
    learningRoadmap: [{
      step: Number,
      topic: String,
      resourceLinks: [{ type: String }],
      status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' }
    }],
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model('UserProfile', userProfileSchema);
