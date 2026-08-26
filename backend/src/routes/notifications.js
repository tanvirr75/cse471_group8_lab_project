const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middlewares/authMiddleware');

// Initial default sample notifications matching the UI
const DEFAULT_NOTIFICATIONS = [
  {
    type: 'job_match',
    title: 'New job match — 92%',
    body: 'Backend Engineering Intern at Pathao matches your profile above your 80% threshold.',
    link: '/student/jobs',
    createdAt: new Date(Date.now() - 2 * 60 * 1000) // 2m ago
  },
  {
    type: 'interview',
    title: 'Interview invitation',
    body: 'Pathao invited you to interview for Backend Intern — Tomorrow at 2:00 PM.',
    link: '/student/applications',
    createdAt: new Date(Date.now() - 60 * 60 * 1000) // 1h ago
  },
  {
    type: 'score_update',
    title: 'Employability score updated',
    body: 'Your score increased by 6 points to 76 this week. Nice work!',
    link: '/student/portfolio',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1d ago
  },
  {
    type: 'roadmap',
    title: 'Roadmap step completed',
    body: 'You finished "Containerize a project with Docker". 4 steps remaining.',
    link: '/student/career-readiness',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2d ago
  },
  {
    type: 'industry_trend',
    title: 'Industry trend',
    body: 'Docker & Kubernetes skills are up 34% in backend job postings this quarter.',
    link: '/student/dashboard',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3d ago
  }
];

// GET /api/notifications - List all notifications for current user (auto-seeds if empty)
router.get('/', protect, async (req, res) => {
  try {
    let notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // If no notifications exist yet, auto-seed the 5 realistic mock notifications
    if (notifications.length === 0) {
      const seeded = DEFAULT_NOTIFICATIONS.map(n => ({
        ...n,
        userId: req.user._id
      }));
      notifications = await Notification.insertMany(seeded);
    }

    res.status(200).json(notifications);
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