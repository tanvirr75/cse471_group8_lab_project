const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middlewares/authMiddleware');

// GET user profile
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update user(GitHub, LinkedIn, Resume লিংক, etc.)
router.patch('/update', protect, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);

    // Fields anyone can update
    if (updates.name !== undefined) user.name = updates.name;
    if (updates.email !== undefined) user.email = updates.email;
    if (updates.profilePicture !== undefined) user.profilePicture = updates.profilePicture;
    
    // Fields for Student
    if (updates.university !== undefined) user.university = updates.university;
    if (updates.universityName !== undefined) user.universityName = updates.universityName;
    if (updates.department !== undefined) user.department = updates.department;
    if (updates.targetRole !== undefined) user.targetRole = updates.targetRole;
    if (updates.skills !== undefined) user.skills = updates.skills;
    if (updates.githubUrl !== undefined) user.githubUrl = updates.githubUrl;
    if (updates.linkedinUrl !== undefined) user.linkedinUrl = updates.linkedinUrl;
    if (updates.resumeUrl !== undefined) user.resumeUrl = updates.resumeUrl;
    
    // Fields for Company/Recruiter
    if (updates.companyName !== undefined) user.companyName = updates.companyName;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// onboarding
router.patch('/complete-onboarding', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.onboardingCompleted = true;
    await user.save();
    res.status(200).json({ message: "Onboarding completed!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;