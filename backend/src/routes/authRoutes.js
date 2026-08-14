const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  console.log("Register hit successfully!");
  res.status(200).json({ message: "Finally reached the route!" });
});

module.exports = router;const express = require('express');
const bcrypt = require('bcryptjs'); 
const User = require('../models/User'); 
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();


    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: newUser._id, 
      email: newUser.email 
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

module.exports = router;