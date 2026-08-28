const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Feature 6: AI Skill Gap Detection & Personalized Learning Roadmap
 */
async function generateRoadmapWithGemini(targetRole, currentSkills) {
  const model = genAI.getGenerativeModel({
<<<<<<< HEAD
    model: 'gemini-3.6-flash',
=======
    model: 'gemini-1.5-flash',
>>>>>>> origin/main
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `
  You are an expert AI Career Advisor for SkillSync.
  Evaluate the skill gap for a student aiming to become a "${targetRole}".

  Student's Current Skills: ${JSON.stringify(currentSkills)}

  Analyze required competencies for "${targetRole}" vs their current skills.
  Provide a strict JSON response matching this EXACT structure:
  {
    "targetRole": "${targetRole}",
    "readinessPercentage": 65,
    "missingSkills": ["Docker", "Kubernetes", "CI/CD Pipelines", "System Design"],
    "roadmapSteps": [
      {
        "stepNumber": 1,
        "title": "Core Foundations & Tooling",
        "focusArea": "DevOps Basics & Containerization",
        "skillsToLearn": ["Docker", "Containerization Fundamentals"],
        "recommendedProjects": ["Containerize a Next.js + Node.js full-stack app"],
        "suggestedResources": ["Docker Official Docs", "FreeCodeCamp DevOps Course"]
      },
      {
        "stepNumber": 2,
        "title": "CI/CD & Automated Deployment",
        "focusArea": "Workflow Automation",
        "skillsToLearn": ["GitHub Actions", "Vercel Deployment"],
        "recommendedProjects": ["Build an automated CI/CD pipeline for GitHub"],
        "suggestedResources": ["GitHub Actions Documentation"]
      }
    ]
  }
  `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

<<<<<<< HEAD
/**
 * Feature 2: AI Resume Analysis
 * Gemini evaluates an uploaded resume's structure, formatting, projects,
 * skills, keywords, education, and overall presentation quality.
 * Falls back to heuristic analysis in the route when unavailable.
 */
async function analyzeResumeWithGemini(fileName, text) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.6-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const truncatedText = (text || '').slice(0, 6000);

  const prompt = `
  You are an expert AI Resume Reviewer for SkillSync.
  Analyze the following resume (from file "${fileName}") against industry standards
  for a software engineering role.

  Resume content:
  """
  ${truncatedText}
  """

  Evaluate: structure & formatting, projects, technical skills, academic qualifications,
  certifications, keywords, and overall presentation quality.

  Provide a strict JSON response matching this EXACT structure:
  {
    "score": 85,
    "feedback": [
      "Contact & links: Strong — ...",
      "Technical skills: Improve — ..."
    ],
    "topFixes": [
      "1. ...",
      "2. ...",
      "3. ..."
    ],
    "sections": [
      { "name": "Summary", "status": "Strong", "comment": "..." },
      { "name": "Experience", "status": "Improve", "comment": "..." },
      { "name": "Skills", "status": "Strong", "comment": "..." },
      { "name": "Projects", "status": "Add", "comment": "..." },
      { "name": "Education", "status": "Strong", "comment": "..." }
    ]
  }

  Constraint: score must be an integer between 0 and 100.
  `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

module.exports = { generateRoadmapWithGemini, analyzeResumeWithGemini };
=======
module.exports = { generateRoadmapWithGemini };
>>>>>>> origin/main
