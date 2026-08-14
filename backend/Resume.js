cat > models/Resume.js << 'EOF'
const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  cloudinaryPublicId: String,
  analysis: {
    structureScore: Number,
    feedback: String,
    keywords: [String],
    sections: [
      {
        name: String,
        status: String,
        comment: String
      }
    ]
  },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', ResumeSchema);
EOF