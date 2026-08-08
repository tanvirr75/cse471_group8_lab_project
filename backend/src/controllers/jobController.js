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
    const jobs = await Job.find().sort({ createdAt: -1 });

    const withScores = jobs.map((job) => {
      const placeholderScore = Math.floor(Math.random() * 41) + 50;
      return { ...job.toObject(), matchPercent: placeholderScore };
    });

    withScores.sort((a, b) => b.matchPercent - a.matchPercent);
    res.json(withScores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
