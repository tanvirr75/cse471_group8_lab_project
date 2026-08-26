const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'recruiter', 'university', 'admin'],
      default: 'student',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // ✅ আপনার (HEAD) থেকে আসা অনবোর্ডিং ফিল্ড
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    onboardingCompleted: { type: Boolean, default: false },
    university: { type: String, default: '' },
    department: { type: String, default: '' },

    // ✅ টিমের (Incoming) থেকে আসা নতুন ফিল্ড
    targetRole: { type: String },
    githubUsername: { type: String },
    linkedinUsername: { type: String },
    companyName: { type: String },
    universityName: { type: String },

    // Feature 13: Recruiter Shortlisting
    shortlistedCandidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);