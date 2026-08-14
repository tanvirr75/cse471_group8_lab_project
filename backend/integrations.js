const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const router = express.Router();

// Connect GitHub and import repos
router.post('/github', auth, async (req, res) => {
  try {
    const { githubUsername } = req.body;
    if (!githubUsername) {
      return res.status(400).json({ msg: 'GitHub username is required' });
    }

    // Update user's githubUsername
    await User.findByIdAndUpdate(req.user.id, { githubUsername });

    // Fetch repos from GitHub API
    const response = await axios.get(
      `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`,
      {
        headers: { 
          'User-Agent': 'SkillSync-App',
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    const repos = response.data.map(repo => ({
      title: repo.name,
      description: repo.description || '',
      repoUrl: repo.html_url,
      techStack: repo.language ? [repo.language] : []
    }));

    // Update or create portfolio
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user.id },
      { 
        $set: { 
          'links.github': githubUsername,
          projects: repos 
        }
      },
      { upsert: true, new: true }
    );

    res.json({ 
      success: true, 
      count: repos.length,
      repos: repos.map(r => r.title)
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ msg: 'GitHub user not found' });
    }
    res.status(500).json({ msg: 'Failed to fetch GitHub data' });
  }
});

// Get user's GitHub data
router.get('/github/:userId', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.params.userId });
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.json({
      githubUsername: portfolio.links?.github,
      projects: portfolio.projects || []
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;