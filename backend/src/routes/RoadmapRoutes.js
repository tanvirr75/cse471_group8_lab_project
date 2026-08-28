const express = require('express');
const router = express.Router();
const { generateRoadmapWithGemini } = require('../services/geminiService');
const Roadmap = require('../models/Roadmap');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// POST /api/readiness/roadmap
router.post('/roadmap', protect, authorizeRoles('student'), async (req, res) => {
  try {
    const { userId, targetRole, currentSkills } = req.body;

    if (!targetRole || !currentSkills || !Array.isArray(currentSkills)) {
      return res.status(400).json({ error: 'targetRole and currentSkills array are required.' });
    }

    // Call Gemini API for skill gap detection & roadmap generation
    const aiResponse = await generateRoadmapWithGemini(targetRole, currentSkills);

    // Save result to MongoDB
    const newRoadmap = new Roadmap({
      userId: userId || 'demo-student-id',
      targetRole: aiResponse.targetRole,
      currentSkills: currentSkills,
      missingSkills: aiResponse.missingSkills,
      readinessPercentage: aiResponse.readinessPercentage,
      roadmapSteps: aiResponse.roadmapSteps
    });

    await newRoadmap.save();

    return res.status(200).json({
      success: true,
      message: 'Learning roadmap generated successfully',
      data: newRoadmap
    });
  } catch (error) {
    console.error('Roadmap Route Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

module.exports = router;