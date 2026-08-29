const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const { getRecommendations, generateCareerRecommendations, getCareerRecommendations } = require("../controllers/recommendationController");

// Feature 11: Smart Job Recommendation System - students only
router.use(protect);
router.get("/", authorizeRoles("student"), getRecommendations);

// Feature 10: AI Career Recommendation System
router.get("/career", authorizeRoles("student"), getCareerRecommendations);
router.post("/career", authorizeRoles("student"), generateCareerRecommendations);

module.exports = router;
