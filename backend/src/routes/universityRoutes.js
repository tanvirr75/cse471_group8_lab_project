const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/universityController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// GET /api/university/analytics
// Protected: Only accessible by users with role 'university'
router.get('/analytics', protect, authorizeRoles('university'), getAnalytics);

module.exports = router;
