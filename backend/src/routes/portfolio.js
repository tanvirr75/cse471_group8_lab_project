const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const { protect } = require('../middlewares/authMiddleware');

// Default initial sample portfolio data
const DEFAULT_PORTFOLIO = {
  avatarInitials: 'NH',
  fullName: 'Naimul Hasan',
  title: 'Backend Developer',
  university: 'CSE, BRAC University',
  employabilityScore: 76,
  bio: 'Backend Developer passionate about scalable distributed systems.',
  links: {
    github: 'github.com/naimul',
    linkedin: 'in/naimul-hasan',
    website: 'naimul.dev'
  },
  projects: [
    {
      title: 'SkillSync API',
      description: 'REST backend for a career platform — Node, Express, MongoDB, JWT.',
      techStack: ['Node.js', 'MongoDB'],
      repoUrl: 'https://github.com/naimul/skillsync-api'
    },
    {
      title: 'E-commerce Backend',
      description: 'Scalable API with payment integration and admin dashboard.',
      techStack: ['Express', 'Stripe'],
      repoUrl: 'https://github.com/naimul/ecommerce-backend'
    }
  ],
  skills: ['JavaScript', 'Node.js', 'MongoDB', 'Express', 'REST', 'Git'],
  certifications: [
    { name: 'Meta Backend Developer (Coursera)', issuer: 'Coursera', year: 2024 },
    { name: 'MongoDB University M001', issuer: 'MongoDB', year: 2024 }
  ]
};

// GET /api/portfolio/me - List all portfolios for the user (or auto-seed default)
router.get('/me', protect, async (req, res) => {
  try {
    let portfolios = await Portfolio.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    // If no portfolio exists yet, create default one so UI always looks great
    if (portfolios.length === 0) {
      const initial = new Portfolio({
        userId: req.user._id,
        fullName: req.user.name || DEFAULT_PORTFOLIO.fullName,
        avatarInitials: (req.user.name || 'NH').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NH',
        title: DEFAULT_PORTFOLIO.title,
        university: DEFAULT_PORTFOLIO.university,
        employabilityScore: DEFAULT_PORTFOLIO.employabilityScore,
        links: DEFAULT_PORTFOLIO.links,
        projects: DEFAULT_PORTFOLIO.projects,
        skills: DEFAULT_PORTFOLIO.skills,
        certifications: DEFAULT_PORTFOLIO.certifications
      });
      await initial.save();
      portfolios = [initial];
    }
    
    res.status(200).json(portfolios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/portfolio/:id - Get single portfolio by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.user._id });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/portfolio - Create a new portfolio
router.post('/', protect, async (req, res) => {
  try {
    const { fullName, title, university, avatarInitials, employabilityScore, links, projects, skills, certifications } = req.body;

    const initials = avatarInitials || (fullName ? fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'NH');

    const portfolio = new Portfolio({
      userId: req.user._id,
      fullName: fullName || 'New Developer',
      title: title || 'Full Stack Developer',
      university: university || 'Computer Science',
      avatarInitials: initials,
      employabilityScore: employabilityScore !== undefined ? employabilityScore : 78,
      links: links || {},
      projects: projects || [],
      skills: skills || [],
      certifications: certifications || []
    });

    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/portfolio/:id - Update specific portfolio
router.put('/:id', protect, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    if (req.body.fullName) {
      portfolio.fullName = req.body.fullName;
      portfolio.avatarInitials = req.body.avatarInitials || req.body.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    if (req.body.title !== undefined) portfolio.title = req.body.title;
    if (req.body.university !== undefined) portfolio.university = req.body.university;
    if (req.body.employabilityScore !== undefined) portfolio.employabilityScore = Number(req.body.employabilityScore);
    if (req.body.avatarInitials !== undefined) portfolio.avatarInitials = req.body.avatarInitials;
    if (req.body.links !== undefined) portfolio.links = req.body.links;
    if (req.body.projects !== undefined) portfolio.projects = req.body.projects;
    if (req.body.skills !== undefined) portfolio.skills = req.body.skills;
    if (req.body.certifications !== undefined) portfolio.certifications = req.body.certifications;

    await portfolio.save();
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/portfolio - Update latest portfolio
router.put('/', protect, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    if (!portfolio) {
      portfolio = new Portfolio({ userId: req.user._id, fullName: req.body.fullName || 'Naimul Hasan', title: req.body.title || 'Backend Developer' });
    }

    if (req.body.fullName) {
      portfolio.fullName = req.body.fullName;
      portfolio.avatarInitials = req.body.avatarInitials || req.body.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    if (req.body.title !== undefined) portfolio.title = req.body.title;
    if (req.body.university !== undefined) portfolio.university = req.body.university;
    if (req.body.employabilityScore !== undefined) portfolio.employabilityScore = Number(req.body.employabilityScore);
    if (req.body.avatarInitials !== undefined) portfolio.avatarInitials = req.body.avatarInitials;
    if (req.body.links !== undefined) portfolio.links = req.body.links;
    if (req.body.projects !== undefined) portfolio.projects = req.body.projects;
    if (req.body.skills !== undefined) portfolio.skills = req.body.skills;
    if (req.body.certifications !== undefined) portfolio.certifications = req.body.certifications;

    await portfolio.save();
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/portfolio/:id - Delete a portfolio
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await Portfolio.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Portfolio not found' });
    res.status(200).json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;