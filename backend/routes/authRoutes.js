const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  console.log("Register hit successfully!");
  res.status(200).json({ message: "Finally reached the route!" });
});

module.exports = router;