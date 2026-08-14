const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const resumeRoutes = require('./routes/resumeRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes from main
app.use('/api/auth', require('./routes/auth'));
app.use('/api/integrations', require('./routes/integrations'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/notifications', require('./routes/notifications'));

// Routes from feature branch
app.use('/api/resume', resumeRoutes);
app.use('/api/readiness', roadmapRoutes);

app.get('/', (req, res) => res.send('SkillSync Backend is running!'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 SkillSync Backend running on http://localhost:${PORT}`));

console.log("MONGO_URI from ENV:", process.env.MONGO_URI || process.env.MONGODB_URI);

const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillsync';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err.message));
