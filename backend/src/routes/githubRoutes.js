const express = require("express");
const router = express.Router();
const { getGithubAnalysis } = require("../controllers/githubController");

router.get("/:username/analysis", getGithubAnalysis);

module.exports = router;
