const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middlewares/authMiddleware');

// update user(GitHub, LinkedIn, Resume লিংক)
router.patch('/update', protect, async (req, res) => {
  try {
    const { githubUrl, linkedinUrl, resumeUrl, university, department } = req.body;
    const user = await User.findById(req.user._id);

    if (githubUrl !== undefined) user.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;
    if (university !== undefined) user.university = university;
    if (department !== undefined) user.department = department;

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