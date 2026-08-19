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

exports.getRecruiterApplications = async (req, res) => {
  try {
    // Find jobs owned by this recruiter
    const jobs = await Job.find({ recruiterId: req.user.id }).select('_id');
    const jobIds = jobs.map(j => j._id);

    // Find applications for those jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("jobId")
      .populate("userId", "name email profilePicture targetRole skills employabilityScore")
      .sort({ matchPercentage: -1, createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.scheduleInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, platform, linkOrLocation, message } = req.body;

    const application = await Application.findById(id).populate("jobId");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify ownership
    if (application.jobId.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to manage this application" });
    }

    application.status = "interview";
    application.interviewDetails = { date, time, platform, linkOrLocation, message };
    await application.save();

    // Generate in-app Notification for the student
    const Notification = require("../models/Notification");
    await Notification.create({
      userId: application.userId,
      type: "interview",
      title: `Interview Scheduled: ${application.jobId.title}`,
      body: `You have been invited to an interview on ${date} at ${time} via ${platform}.`,
      relatedId: application._id.toString()
    });

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
