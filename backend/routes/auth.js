const express = require('express');
const router = express.Router();
router.post('/register', (req, res) => res.json({ msg: 'Register' }));
router.post('/login', (req, res) => res.json({ msg: 'Login' }));
module.exports = router;
