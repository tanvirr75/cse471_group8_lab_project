const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Feature 6: AI Skill Gap Detection & Personalized Learning Roadmap
 */
async function generateRoadmapWithGemini(targetRole, currentSkills) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
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

module.exports = { generateRoadmapWithGemini };