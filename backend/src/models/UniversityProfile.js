const mongoose = require('mongoose');

const universityProfileSchema = new mongoose.Schema(
  {
    // Link back to the main User account (which has the email/password)
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      unique: true
    },
    
    universityName: { 
      type: String, 
      required: true 
    },
    location: { 
      type: String, 
      default: '' 
    },
    websiteUrl: { 
      type: String, 
      default: '' 
    },
    contactEmail: { 
      type: String, 
      default: '' 
    },
    
    // A list of students verified by this university career center
    verifiedStudents: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }],
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model('UniversityProfile', universityProfileSchema);
