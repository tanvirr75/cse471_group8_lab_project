const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middlewares/authMiddleware');

// GET /api/notifications - List all real notifications for current user
// Only returns notifications actually created via POST — no auto-seeding
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications); // returns [] if none exist yet
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/notifications or POST /api/notifications/create - Create a notification (callable by any feature/member)
router.post(['/', '/create'], protect, async (req, res) => {
  try {
    const { targetUserId, type, title, body, link } = req.body;
    const recipientId = targetUserId || req.user._id;

    const newNotif = new Notification({
      userId: recipientId,
      type: type || 'general',
      title,
      body,
      link: link || ''
    });

    await newNotif.save();
    res.status(201).json({ message: "Notification created!", data: newNotif });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id }, { $set: { read: true } });
    const updated = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ message: "All notifications marked as read", data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/notifications/:id/read - Mark single notification as read
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { read: true } },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: "Notification not found" });
    res.status(200).json(notif);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Notification not found" });
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;