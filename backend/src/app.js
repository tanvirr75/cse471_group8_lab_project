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
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/portfolio', require('./routes/portfolio'));

// Basic route
app.get('/', (req, res) => {
  res.send('SkillSync API is running...');
});

// Add routes here later

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;