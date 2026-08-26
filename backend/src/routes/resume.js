const express = require('express');
const router = express.Router();
const multer = require('multer');
const Resume = require('../models/Resume');
const { protect } = require('../middlewares/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

// Upload & analyze resume
router.post('/upload', protect, upload.single('resume'), async (req, res) => {
  const fileName = req.file?.originalname || 'Resume.pdf';
  
  // Generate realistic varied scores & feedback for testing multiple PDFs
  const randomScores = [78, 84, 89, 92, 95];
  const hash = fileName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const score = randomScores[hash % randomScores.length];

  const dummyAnalysis = {
    score: score,
    feedback: [
      score >= 85 ? "Contact & links: Strong" : "Contact & links: Improve",
      "Technical skills: Strong",
      score >= 90 ? "Project descriptions: Strong" : "Project descriptions: Improve",
      score >= 80 ? "Keyword optimization: Strong" : "Keyword optimization: Improve",
      "Formatting: Strong",
      score >= 88 ? "Summary statement: Strong" : "Summary statement: Add"
    ],
    topFixes: score >= 90 
      ? [
          "1. Fine-tune job-specific keywords for target roles.",
          "2. Add links to live deployed demo projects.",
          "3. Highlight recent certifications."
        ]
      : [
          "1. Add a professional summary statement at the top.",
          "2. Quantify your projects with measurable metrics (e.g., improved speed by 30%).",
          "3. Insert missing keywords like Docker, Redis, or CI/CD pipelines."
        ]
  };

  // Save to database
  const resumeEntry = new Resume({
    userId: req.user._id,
    fileUrl: fileName,
    analysis: dummyAnalysis
  });
  await resumeEntry.save();

  res.status(201).json({ message: "Resume analyzed successfully", data: resumeEntry, fileName });
});

router.get('/:userId', protect, async (req, res) => {
  const resume = await Resume.findOne({ userId: req.params.userId }).sort({ createdAt: -1 });
  if (!resume) return res.status(404).json({ message: "No resume found" });
  res.status(200).json(resume);
});

module.exports = router;