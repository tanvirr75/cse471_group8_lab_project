const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },
    workplace: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],
      default: "On-site",
    },
    location: { type: String, default: "" },
    skills: [{ type: String }],
    
    // Additional recruitment details
    experienceLevel: { 
      type: String, 
      enum: ['Entry-level', 'Mid-level', 'Senior', 'Director'],
      default: 'Entry-level'
    },
    educationRequirement: { type: String, default: '' },
    salaryRange: { 
      min: { type: Number }, 
      max: { type: Number }, 
      currency: { type: String, default: 'USD' } 
    },
    
    description: { type: String, default: "" },
    source: { type: String, default: "internal" },
    deadline: { type: Date },
    
    status: {
      type: String,
      enum: ['open', 'closed', 'draft'],
      default: 'open'
    },
    
    // Who posted it and which company it belongs to
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "CompanyProfile" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
