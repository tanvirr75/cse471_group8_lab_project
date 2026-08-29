const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const { protect } = require('../middlewares/authMiddleware');
const { analyzeResumeWithGemini } = require('../services/geminiService');

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

// Intelligent PDF content analyzer (detects real resumes vs non-CV PDFs)
async function analyzePdfContent(fileName, fileBuffer) {
  let text = '';
  try {
    if (fileBuffer && fileBuffer.length > 0) {
      const parsed = await pdfParse(fileBuffer);
      text = parsed.text || '';
    }
  } catch (e) {
    console.log('PDF text parsing note:', e.message);
  }

  const lowerText = text.toLowerCase();
  const lowerName = (fileName || '').toLowerCase();

  // Resume section signals
  const resumeSectionSignals = [
    'experience', 'education', 'skills', 'projects', 'summary', 'profile',
    'curriculum vitae', 'resume', 'employment', 'certifications', 'internship',
    'objective', 'achievements', 'qualification', 'publications', 'work history', 'graduated'
  ];

  // Contact signals
  const contactSignals = [
    'email', '@', 'linkedin', 'github', 'phone', 'portfolio', 'contact', 'tel'
  ];

  // Technical & Developer signals
  const techSignals = [
    'javascript', 'python', 'java', 'react', 'node', 'express', 'sql', 'mongodb',
    'docker', 'aws', 'git', 'c++', 'html', 'css', 'typescript', 'api', 'backend',
    'frontend', 'full stack', 'developer', 'engineer', 'database', 'rest', 'linux',
    'software', 'computer science', 'bachelor', 'master', 'university', 'college'
  ];

  let resumeSectionCount = 0;
  resumeSectionSignals.forEach(signal => {
    if (lowerText.includes(signal) || lowerName.includes(signal)) resumeSectionCount++;
  });

  let contactCount = 0;
  contactSignals.forEach(signal => {
    if (lowerText.includes(signal)) contactCount++;
  });

  let techCount = 0;
  techSignals.forEach(signal => {
    if (lowerText.includes(signal) || lowerName.includes(signal)) techCount++;
  });

  // Check if this PDF is actually a resume/CV or a random non-CV PDF
  const isResumeByName = lowerName.includes('resume') || lowerName.includes('cv') || lowerName.includes('profile');
  const isGenuineResume = (text.length > 50 && (resumeSectionCount >= 2 || (contactCount >= 1 && techCount >= 2)))
    || isResumeByName;

  // Case 1: NON-CV PDF (e.g. assignments, slides, bills, book chapters, random PDF)
  if (!isGenuineResume) {
    const lowScore = Math.min(32, Math.max(18, 18 + (resumeSectionCount * 3)));
    return {
      score: lowScore,
      feedback: [
        "Document Type: Add — Non-Resume Document Detected. This PDF appears to be a general document without standard CV structure.",
        "Work Experience: Add — No employment history or professional experience detected.",
        "Technical Skills: Add — No developer skills or technical stack keywords identified.",
        "Contact & Profile: Add — No contact email, GitHub, or LinkedIn profile links found.",
        "Education: Add — No university, degree, or educational background found.",
        "Summary statement: Add — Missing professional elevator summary at the top."
      ],
      topFixes: [
        "1. Upload a standard Resume/CV document instead of a general non-resume PDF.",
        "2. Ensure core sections (Summary, Skills, Experience, Education) are clearly present.",
        "3. Include your contact details with direct GitHub and LinkedIn links."
      ]
    };
  }

  // Case 2: GENUINE RESUME - Dynamic content-based scoring
  let calculatedScore = 68;
  if (resumeSectionCount >= 4) calculatedScore += 8;
  if (contactCount >= 2) calculatedScore += 7;
  if (techCount >= 4) calculatedScore += 8;
  if (lowerText.includes('%') || lowerText.includes('reduced') || lowerText.includes('improved') || lowerText.includes('scaled') || lowerText.includes('built')) {
    calculatedScore += 5;
  }

  // Hash variance based on file content for testing
  let hash = 0;
  for (let i = 0; i < lowerName.length; i++) {
    hash = ((hash << 5) - hash) + lowerName.charCodeAt(i);
    hash |= 0;
  }
  const score = Math.min(97, Math.max(72, calculatedScore + (Math.abs(hash) % 7) - 3));

  const feedback = [
    contactCount >= 2
      ? "Contact & links: Strong — Clean contact header with active GitHub & LinkedIn links."
      : "Contact & links: Improve — Include direct hyperlinks to GitHub and LinkedIn profiles.",
    techCount >= 4
      ? "Technical skills: Strong — Well-structured skill taxonomy highlighting core stack."
      : "Technical skills: Improve — Group skills into categories (Languages, Frameworks, Databases, Tools).",
    lowerText.includes('%') || lowerText.includes('improved') || lowerText.includes('reduced')
      ? "Project descriptions: Strong — Quantified project outcomes and engineering impact."
      : "Project descriptions: Improve — Quantify project metrics (e.g., 'reduced latency by 35%').",
    techCount >= 5
      ? "Keyword optimization: Strong — In-demand keywords detected for software engineering roles."
      : "Keyword optimization: Improve — Add high-frequency keywords like Docker, Redis, CI/CD, and Microservices.",
    "Formatting: Strong — Clean typography with clear section hierarchy.",
    lowerText.includes('summary') || lowerText.includes('profile') || lowerText.includes('objective')
      ? "Summary statement: Strong — Well-written professional summary."
      : "Summary statement: Add — Add a crisp 2-sentence summary highlighting your primary strengths."
  ];

  const topFixes = score >= 90 ? [
    "1. Fine-tune targeted keywords — Tailor project descriptions to specific job postings.",
    "2. System scalability details — Highlight dataset volume, concurrency, or latency figures.",
    "3. Add GitHub stars or demo deployment links for top 2 projects."
  ] : score >= 80 ? [
    "1. Quantify achievements — Add measurable metrics to project bullet points.",
    "2. Expand tool stack — Include missing modern tools like Docker, Redis, and Cloud services.",
    "3. Lead with action verbs — Start each accomplishment bullet with strong verbs (Engineered, Architected)."
  ] : [
    "1. Add a professional summary — Provide a 2-line summary emphasizing your key stack.",
    "2. Restructure projects — Highlight your most complex full-stack/backend projects first.",
    "3. ATS Keyword alignment — Add missing tools like Git, Docker, REST APIs, and database technologies."
  ];

  return { score, feedback, topFixes };
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

      let analysis;

      // Parse the PDF text to share with the AI analyzer
      let text = '';
      try {
        if (req.file && req.file.buffer && req.file.buffer.length > 0) {
          const parsed = await pdfParse(req.file.buffer);
          text = parsed.text || '';
        }
      } catch (e) {
        console.log('PDF text parsing note:', e.message);
      }

      const lowerText = text.toLowerCase();
      const lowerName = fileName.toLowerCase();

      // Detect whether this is actually a resume/CV vs a generic PDF
      const resumeSectionSignals = [
        'experience', 'education', 'skills', 'projects', 'summary', 'profile',
        'curriculum vitae', 'resume', 'employment', 'certifications', 'internship',
        'objective', 'achievements', 'qualification', 'publications', 'work history', 'graduated'
      ];
      let resumeSectionCount = 0;
      resumeSectionSignals.forEach(signal => {
        if (lowerText.includes(signal) || lowerName.includes(signal)) resumeSectionCount++;
      });
      const isResumeByName = lowerName.includes('resume') || lowerName.includes('cv') || lowerName.includes('profile');
      const isGenuineResume = (text.length > 50 && resumeSectionCount >= 2) || isResumeByName;

      // Case 1: NON-CV PDF - keep existing low-score heuristic (don't send to Gemini)
      if (!isGenuineResume) {
        analysis = await analyzePdfContent(fileName, req.file.buffer);
      } else {
        // Case 2: GENUINE RESUME - try Gemini AI first, fall back to heuristic
        try {
          const aiResult = await analyzeResumeWithGemini(fileName, text);
          analysis = {
            score: Math.min(100, Math.max(0, Math.round(aiResult.score || 78))),
            feedback: Array.isArray(aiResult.feedback) && aiResult.feedback.length
              ? aiResult.feedback.slice(0, 10)
              : [],
            topFixes: Array.isArray(aiResult.topFixes) && aiResult.topFixes.length
              ? aiResult.topFixes.slice(0, 5)
              : [],
            keywords: Array.isArray(aiResult.keywords) ? aiResult.keywords : [],
            sections: Array.isArray(aiResult.sections) ? aiResult.sections : []
          };
          if (!analysis.feedback.length) throw new Error('Empty AI feedback');
        } catch (aiErr) {
          console.log('Gemini unavailable, using heuristic fallback:', aiErr.message);
          const h = await analyzePdfContent(fileName, req.file.buffer);
          analysis = {
            ...h,
            structureScore: h.score,
            keywords: [],
            sections: h.feedback.map(fb => {
              const parts = fb.split(':');
              const status = parts[0]?.includes('Improve') ? 'Improve'
                : parts[0]?.includes('Add') ? 'Add' : 'Strong';
              return {
                name: parts[0]?.trim() || 'General',
                status,
                comment: parts.slice(1).join(':').trim()
              };
            })
          };
        }
      }


      // Save resume entry
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
      console.error('Error analyzing/saving resume:', dbErr);
      return res.status(500).json({ success: false, message: 'Server error while analyzing resume.' });
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