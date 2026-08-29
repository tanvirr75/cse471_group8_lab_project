const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const students = await User.find({ role: 'student' });
  for (const student of students) {
    if (!student.skills || student.skills.length === 0) {
      student.skills = ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Tailwind CSS'];
    }
    if (!student.university) {
      student.university = 'BRAC University';
      student.department = 'Computer Science';
    }
    
    student.targetRole = student.targetRole || 'Software Engineer';
    
    await student.save();
    console.log(`Updated student ${student.email}`);
  }

  console.log('Done!');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
