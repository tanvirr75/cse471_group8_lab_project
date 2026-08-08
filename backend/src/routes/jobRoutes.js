const express = require("express");
const router = express.Router();
const { getJobs, getJobById, getMatches } = require("../controllers/jobController");

router.get("/matches", getMatches);
router.get("/", getJobs);
router.get("/:id", getJobById);

module.exports = router;
