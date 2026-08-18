const express = require('express');
const router = express.Router();
router.post('/upload', (req, res) => res.json({ msg: 'Resume upload' }));
module.exports = router;
