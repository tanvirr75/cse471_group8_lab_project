const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const { protect } = require('../middlewares/authMiddleware');

// লগইন করা ইউজারের সব পোর্টফোলিও দেখুন (লিস্ট আকারে)
router.get('/me', protect, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(portfolios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// নতুন পোর্টফোলিও তৈরি করুন (এখন আর "already exists" চেক নেই)
router.post('/', protect, async (req, res) => {
  try {
    const { fullName, title, university, avatarInitials, links, projects, skills, certifications } = req.body;

    const portfolio = new Portfolio({
      userId: req.user._id,
      fullName,
      title,
      university,
      avatarInitials,
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

// পোর্টফোলিও আপডেট করুন (যেটা এডিট করতে চান)
router.put('/', protect, async (req, res) => {
  try {
    // সবচেয়ে সাম্প্রতিক পোর্টফোলিওটি আপডেট হবে (অথবা আপনি আইডি পাঠালে সেটি আপডেট হবে)
    const portfolio = await Portfolio.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    portfolio.fullName = req.body.fullName || portfolio.fullName;
    portfolio.title = req.body.title || portfolio.title;
    portfolio.university = req.body.university || portfolio.university;
    portfolio.avatarInitials = req.body.avatarInitials || portfolio.avatarInitials;
    portfolio.links = req.body.links || portfolio.links;
    portfolio.projects = req.body.projects || portfolio.projects;
    portfolio.skills = req.body.skills || portfolio.skills;
    portfolio.certifications = req.body.certifications || portfolio.certifications;

    await portfolio.save();
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;