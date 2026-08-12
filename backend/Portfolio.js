cat > models/Portfolio.js << 'EOF'
const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  projects: [
    {
      title: String,
      description: String,
      repoUrl: String,
      techStack: [String]
    }
  ],
  skills: [String],
  certifications: [
    {
      name: String,
      issuer: String,
      year: Number
    }
  ],
  links: {
    linkedin: String,
    github: String,
    personalWebsite: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
EOF