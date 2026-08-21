const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middlewares/authMiddleware');

// log in user notifications
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Notification
router.post('/create', protect, async (req, res) => {
  try {
    const { type, title, body } = req.body;
    const newNotif = new Notification({ userId: req.user._id, type, title, body });
    await newNotif.save();
    res.status(201).json({ message: "Notification created!", data: newNotif });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;