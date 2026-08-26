const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const notificationsRoutes = require('./routes/notifications');
const resumeRoutes = require('./routes/resume');
const profileRoutes = require('./routes/profileRoutes');
const portfolioRoutes = require('./routes/portfolio');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const githubRoutes = require('./routes/githubRoutes');
const integrationsRoutes = require('./routes/integrations');
const roadmapRoutes = require('./routes/RoadmapRoutes');
const universityRoutes = require('./routes/universityRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const newsRoutes = require('./routes/newsRoutes');

// App Routes
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api/readiness', roadmapRoutes);
app.use('/api/university', universityRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/news', newsRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("SkillSync API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

module.exports = app;