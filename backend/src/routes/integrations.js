const express = require('express');
const router = express.Router();

router.post('/github', (req, res) => res.json({ msg: 'GitHub' }));

module.exports = router;