const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getTechNews } = require('../controllers/newsController');

// GET /api/news
router.get('/', protect, getTechNews);

module.exports = router;
