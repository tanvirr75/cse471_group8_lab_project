const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const resumeRoutes = require('./routes/resumeRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillsync')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Register Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/readiness', roadmapRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SkillSync Backend running on port ${PORT}`);
});