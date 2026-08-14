const express = require('express');
const router = express.Router();
router.get('/:userId', (req, res) => res.json({ msg: 'Portfolio' }));
module.exports = router;
