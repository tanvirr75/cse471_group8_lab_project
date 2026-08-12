cat > models/User.js << 'EOF'
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'recruiter', 'university', 'admin'], default: 'student' },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationExpires: Date,
  resetToken: String,
  resetExpires: Date,
  university: String,
  department: String,
  targetRole: String,
  profilePicture: String,
  githubUsername: String,
  linkedinUrl: String
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
EOF