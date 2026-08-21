const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema(
  {
    // Link to the base User account (the Recruiter)
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      unique: true
    },
    
    // Core company details
    companyName: { type: String, required: true },
    logo: { type: String, default: '' }, // Cloudinary URL
    industry: { type: String, default: '' },
    location: { type: String, default: '' },
    websiteUrl: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    description: { type: String, default: '' },
    
    // Verification documents (e.g. business registration links)
    verificationDocuments: [{ type: String }],
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);
