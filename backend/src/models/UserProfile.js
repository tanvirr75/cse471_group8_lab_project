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

    // Core skills for the matching engine
    skills: [{ type: String }],
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model('UserProfile', userProfileSchema);
