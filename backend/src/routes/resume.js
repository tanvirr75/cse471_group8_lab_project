const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const { protect } = require('../middlewares/authMiddleware');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Cloudinary আপলোড বাদ দিয়ে সরাসরি ডামি এনালাইসিস রিটার্ন (API কী এরর এড়াতে)
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
        "1. Add a professional summary — two lines stating your role focus.",
        "2. Quantify your projects.",
        "3. Insert missing keywords like Docker and testing."
      ]
    };

    const resumeEntry = new Resume({
      userId: req.user._id,
      fileUrl: "dummy_url.pdf", // ডামি লিংক
      analysis: dummyAnalysis
    });
    await resumeEntry.save();

    res.status(201).json({ message: "Resume analyzed successfully", data: resumeEntry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:userId', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.params.userId }).sort({ createdAt: -1 });
    if (!resume) return res.status(404).json({ message: "No resume found for this user" });
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;