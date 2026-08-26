const express = require('express');
const router = express.Router();
const multer = require('multer');
const Resume = require('../models/Resume');
const { protect } = require('../middlewares/authMiddleware');

// Configure multer with fileFilter for strict PDF validation
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const isPdfMime = file.mimetype === 'application/pdf';
    const isPdfExt = file.originalname.toLowerCase().endsWith('.pdf');
    if (isPdfMime || isPdfExt) {
      cb(null, true);
    } else {
      cb(new Error('INVALID_FILE_TYPE'), false);
    }
  }
});

// Helper to generate dynamic, varied analysis for testing different PDFs
function generateDynamicAnalysis(fileName, fileBuffer) {
  let hash = 0;
  const name = fileName || 'resume.pdf';
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  if (fileBuffer && fileBuffer.length > 0) {
    hash += fileBuffer[0] || fileBuffer.length;
  }

  const scoreOptions = [72, 78, 84, 88, 92, 96];
  const score = scoreOptions[Math.abs(hash) % scoreOptions.length];

  // Feedback pools
  const strongFeedback = [
    "Contact & links: Strong — Clean contact header with active GitHub & LinkedIn links.",
    "Technical skills: Strong — Well-structured skill taxonomy highlighting backend stacks.",
    "Education & Certifications: Strong — Degree and certifications clearly highlighted.",
    "Layout & Typography: Strong — ATS-friendly formatting with consistent typography."
  ];

  const improveFeedback = [
    "Project descriptions: Improve — Focus more on system architecture and problem solved.",
    "Keyword optimization: Improve — Include in-demand keywords like Docker, Redis, Kubernetes.",
    "Impact metrics: Improve — Quantify outcomes (e.g., 'reduced latency by 35%').",
    "Summary statement: Improve — Add a crisp 2-sentence objective tailored to target role."
  ];

  const addFeedback = [
    "Summary statement: Add — Missing professional elevator summary at the top.",
    "Live demo links: Add — Add clickable GitHub repo and deployment links to your projects.",
    "Cloud & DevOps tools: Add — Highlight AWS/GCP or CI/CD workflow experience."
  ];

  let selectedFeedback = [];
  if (score >= 90) {
    selectedFeedback = [
      strongFeedback[0],
      strongFeedback[1],
      strongFeedback[2],
      strongFeedback[3],
      improveFeedback[0],
      "Summary statement: Strong — Well-written professional summary."
    ];
  } else if (score >= 80) {
    selectedFeedback = [
      strongFeedback[0],
      strongFeedback[1],
      improveFeedback[0],
      improveFeedback[1],
      strongFeedback[3],
      improveFeedback[3]
    ];
  } else {
    selectedFeedback = [
      strongFeedback[0],
      improveFeedback[0],
      improveFeedback[1],
      improveFeedback[2],
      strongFeedback[3],
      addFeedback[0]
    ];
  }

  const topFixesOptions = {
    high: [
      "1. Fine-tune niche keywords — Tailor project descriptions to specific job postings.",
      "2. Highlight system scale — Mention requests per second or dataset volume handled.",
      "3. Add GitHub stars or community recognition if applicable."
    ],
    medium: [
      "1. Quantify achievements — Add concrete metrics (e.g., 'scaled API to handle 10k req/sec').",
      "2. Highlight backend technologies — Include missing keywords like Docker, Redis, PostgreSQL.",
      "3. Refine project bullets — Start each bullet with strong action verbs (Architected, Optimized)."
    ],
    low: [
      "1. Add a professional summary — Provide a 2-line summary emphasizing your key strengths.",
      "2. Reorganize project section — Highlight 2-3 most complex full-stack/backend projects first.",
      "3. ATS Keyword alignment — Add missing tools like Git, Docker, REST APIs, and Cloud services."
    ]
  };

  const topFixes = score >= 90 ? topFixesOptions.high : score >= 80 ? topFixesOptions.medium : topFixesOptions.low;

  return { score, feedback: selectedFeedback, topFixes };
}

// POST /api/resume/upload - Upload & analyze resume
router.post('/upload', protect, (req, res) => {
  upload.single('resume')(req, res, async (err) => {
    if (err) {
      if (err.message === 'INVALID_FILE_TYPE') {
        return res.status(400).json({
          success: false,
          message: 'Invalid file format. Please upload a valid PDF document (.pdf).'
        });
      }
      return res.status(400).json({ success: false, message: err.message || 'File upload error.' });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select a PDF file to analyze.'
      });
    }

    const fileName = req.file.originalname || 'Resume.pdf';
    const isPdf = fileName.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file format. Please upload a valid PDF document (.pdf).'
      });
    }

    try {
      const analysis = generateDynamicAnalysis(fileName, req.file.buffer);

      // Save new resume entry
      const resumeEntry = new Resume({
        userId: req.user._id,
        fileUrl: fileName,
        analysis: analysis
      });
      await resumeEntry.save();

      return res.status(201).json({
        success: true,
        message: 'Resume analyzed successfully',
        data: resumeEntry,
        fileName
      });
    } catch (dbErr) {
      console.error('Error saving resume:', dbErr);
      return res.status(500).json({ success: false, message: 'Server error while saving analysis.' });
    }
  });
});

// GET /api/resume/:userId - Get latest resume analysis
router.get('/:userId', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.params.userId }).sort({ createdAt: -1 });
    if (!resume) {
      return res.status(404).json({ message: 'No resume found' });
    }
    return res.status(200).json(resume);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving resume analysis.' });
  }
});

module.exports = router;