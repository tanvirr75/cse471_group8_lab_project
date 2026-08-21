const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const {
  applyToJob,
  getMyApplications,
  updateApplicationStatus,
  getRecruiterApplications,
  scheduleInterview
} = require("../controllers/applicationController");

// Protect all application routes
router.use(protect);

// Student routes
router.post("/", authorizeRoles("student"), applyToJob);
router.get("/", authorizeRoles("student"), getMyApplications);
// Student withdrawing or updating their own status? Typically students can't update to "interview", only recruiters.
// For now, keeping patch for both but restrict scheduleInterview strictly to recruiter
router.patch("/:id", updateApplicationStatus);

// Recruiter routes
router.get("/recruiter", authorizeRoles("recruiter"), getRecruiterApplications);
router.post("/:id/interview", authorizeRoles("recruiter"), scheduleInterview);

module.exports = router;
