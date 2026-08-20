const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const { protect } = require('../middlewares/authMiddleware');

// GET: লগইন করা ইউজারের পোর্টফোলিও ডাটা আনা
router.get('/me', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found. Please create one.' });
    }
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: পোর্টফোলিও তৈরি করা (যদি আগে থেকে না থাকে)
router.post('/', protect, async (req, res) => {
  try {
    const existing = await Portfolio.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Portfolio already exists. Use PUT to update.' });
    }

    const { fullName, title, university, employabilityScore, bio, links, projects, skills, certifications } = req.body;
    const portfolio = new Portfolio({
      userId: req.user._id,
      fullName,
      title,
      university,
      employabilityScore,
      bio,
      links,
      projects,
      skills,
      certifications
    });
    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: পোর্টফোলিও আপডেট করা
router.put('/', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const { fullName, title, university, employabilityScore, bio, links, projects, skills, certifications } = req.body;

    portfolio.fullName = fullName || portfolio.fullName;
    portfolio.title = title || portfolio.title;
    portfolio.university = university || portfolio.university;
    portfolio.employabilityScore = employabilityScore || portfolio.employabilityScore;
    portfolio.bio = bio || portfolio.bio;
    portfolio.links = links || portfolio.links;
    portfolio.projects = projects || portfolio.projects;
    portfolio.skills = skills || portfolio.skills;
    portfolio.certifications = certifications || portfolio.certifications;

    await portfolio.save();
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;