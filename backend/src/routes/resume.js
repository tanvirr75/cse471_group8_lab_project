const express = require('express');
const router = express.Router();
const multer = require('multer');
const Resume = require('../models/Resume');
const { protect } = require('../middlewares/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

// ডেমো ডাটা দিয়ে আপলোড কাজ করানো
router.post('/upload', protect, upload.single('resume'), async (req, res) => {
  const dummyAnalysis = {
    score: 78,
    feedback: [
      "Contact & links: Strong",
      "Technical skills: Strong",
      "Project descriptions: Improve",
      "Keyword optimization: Improve",
      "Formatting: Strong",
      "Summary statement: Add"
    ],
    topFixes: [
      "1. Add a professional summary.",
      "2. Quantify your projects.",
      "3. Insert missing keywords like Docker."
    ]
  };

  // ডাটাবেসে সেভ করা (Cloudinary ছাড়া)
  const resumeEntry = new Resume({
    userId: req.user._id,
    fileUrl: "dummy_url.pdf",
    analysis: dummyAnalysis
  });
  await resumeEntry.save();

  res.status(201).json({ message: "Resume analyzed successfully", data: resumeEntry });
});

router.get('/:userId', protect, async (req, res) => {
  const resume = await Resume.findOne({ userId: req.params.userId });
  if (!resume) return res.status(404).json({ message: "No resume found" });
  res.status(200).json(resume);
});

module.exports = router;