const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('SkillSync API is running...');
});

// Add routes here later
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const githubRoutes = require('./routes/githubRoutes');
const githubAccountRoutes = require('./routes/githubAccountRoutes');

app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/github', githubRoutes);
// Feature 1 - different prefix from '/api/github' (Feature 5) so the two
// GitHub features don't collide.
app.use('/api/github-account', githubAccountRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;
