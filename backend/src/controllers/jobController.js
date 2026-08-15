const Job = require("../models/Job");

exports.getJobs = async (req, res) => {
  try {
    const { type, workplace, skill, search } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (workplace) filter.workplace = workplace;
    if (skill) filter.skills = { $in: [skill] };
    if (search) filter.title = { $regex: search, $options: "i" };

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMatches = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User ID required for matches" });
    }

    const UserProfile = require("../models/UserProfile");
    const userProfile = await UserProfile.findOne({ userId });
    
    const jobs = await Job.find({ status: 'open' }).sort({ createdAt: -1 });

    if (!userProfile) {
      // Fallback if no profile
      const fallbackJobs = jobs.map(job => ({ ...job.toObject(), matchPercent: 50 }));
      return res.json(fallbackJobs);
    }

    // 1. Extract user data for matching
    const userSkills = (userProfile.skills || []).map(s => s.toLowerCase());
    const userInterests = (userProfile.careerInterests || []).map(i => i.toLowerCase());
    const employabilityBase = userProfile.employabilityScore || 0;

    const withScores = jobs.map((job) => {
      let score = 0;
      let maxScore = 100;

      // --- Skill Match (up to 60 points) ---
      const jobSkills = (job.skills || []).map(s => s.toLowerCase());
      if (jobSkills.length > 0 && userSkills.length > 0) {
        const matchingSkills = jobSkills.filter(skill => userSkills.includes(skill));
        // Calculate percentage of job skills met
        const skillScore = (matchingSkills.length / jobSkills.length) * 60;
        score += skillScore;
      } else if (jobSkills.length === 0) {
        // If job has no specific skills listed, give a neutral base
        score += 30; 
      }

      // --- Career Interest Match (up to 30 points) ---
      // Check if job title matches any of the user's career interests
      const jobTitle = (job.title || "").toLowerCase();
      let interestScore = 0;
      if (userInterests.length > 0) {
        const matchesInterest = userInterests.some(interest => jobTitle.includes(interest) || interest.includes(jobTitle));
        if (matchesInterest) {
          interestScore = 30;
        }
      } else {
        interestScore = 15; // Neutral
      }
      score += interestScore;

      // --- Employability Score Modifier (up to 10 points) ---
      // Add a slight boost based on overall employability
      const employabilityBoost = (employabilityBase / 100) * 10;
      score += employabilityBoost;

      // Ensure score stays within 0-100 range and round it
      const finalScore = Math.min(Math.round(score), 100);

      return { ...job.toObject(), matchPercent: finalScore };
    });

    // Sort by match percentage descending
    withScores.sort((a, b) => b.matchPercent - a.matchPercent);
    res.json(withScores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
