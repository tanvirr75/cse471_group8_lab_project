const express = require('express');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, university, department, targetRole, githubUsername, linkedinUrl, companyName, universityName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Prevent public admin registration
    const userRole = role === 'admin' ? 'student' : (role || 'student');

    // Do NOT hash manually, User model pre('save') hook handles it
    const newUser = new User({
      name,
      email,
      password, // Send plain password, Mongoose will hash it
      role: userRole,
      university,
      department,
      targetRole,
      githubUsername,
      linkedinUrl,
      companyName,
      universityName
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      userId: newUser._id, 
      email: newUser.email,
      role: newUser.role
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists (include password since select is false in model)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      userId: user._id,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;