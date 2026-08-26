const express = require('express');
const router = express.Router();
const { toggleShortlist, getShortlistedCandidates } = require('../controllers/recruiterController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// All routes here are strictly for recruiters
router.use(protect);
router.use(authorizeRoles('recruiter'));

router.get('/shortlist', getShortlistedCandidates);
router.post('/shortlist/:candidateId', toggleShortlist);

module.exports = router;
