const Application = require("../models/Application");
const Job = require("../models/Job");

exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ message: "jobId is required" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existing = await Application.findOne({ userId: req.user.id, jobId });
    if (existing) return res.status(409).json({ message: "Already applied to this job" });

    const application = await Application.create({ userId: req.user.id, jobId });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate("jobId")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["applied", "under_review", "interview", "rejected", "accepted"];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status },
      { new: true }
    );
    if (!application) return res.status(404).json({ message: "Application not found" });

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
