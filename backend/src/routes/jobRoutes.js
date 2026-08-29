const express = require("express");
const router = express.Router();
const { getJobs, getJobById, getMatches, createJob } = require("../controllers/jobController");
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

router.get("/matches", getMatches);
router.post("/", protect, authorizeRoles("recruiter"), createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);

module.exports = router;
