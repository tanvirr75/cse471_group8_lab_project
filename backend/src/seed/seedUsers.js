require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

const DEPARTMENTS = ['Computer Science', 'Software Engineering', 'Electrical Engineering', 'Data Science', 'Business Administration'];
const SKILLS_POOL = ['React', 'Node.js', 'Python', 'Java', 'Docker', 'Machine Learning', 'AWS', 'SQL', 'TypeScript', 'Figma', 'C++', 'Go'];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItems = (arr, num) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    await User.deleteMany({});
    await UserProfile.deleteMany({});
    console.log('Existing users and profiles cleared.');

    // Base Users
    const baseUsers = [
      { name: 'Admin User', email: 'admin@skillsync.com', password: 'password123', role: 'admin', isVerified: true },
      { name: 'Tech University', email: 'career@techuniversity.edu', password: 'password123', role: 'university', isVerified: true, universityName: 'Tech University' },
      { name: 'Tech Recruiter', email: 'recruiter@techcorp.com', password: 'password123', role: 'recruiter', isVerified: true, companyName: 'TechCorp' },
    ];

    for (const userData of baseUsers) {
      const u = new User(userData);
      await u.save();
    }

    // Generate 25 diverse students for Tech University
    console.log('Generating 25 mock students for Tech University analytics...');
    for (let i = 1; i <= 25; i++) {
      const student = new User({
        name: `Student ${i}`,
        email: `student${i}@skillsync.com`,
        password: 'password123',
        role: 'student',
        isVerified: true,
        university: 'Tech University',
        department: DEPARTMENTS[getRandomInt(0, DEPARTMENTS.length - 1)]
      });
      await student.save();

      // Generate corresponding UserProfile with mock analytics data
      const profile = new UserProfile({
        userId: student._id,
        university: 'Tech University',
        department: student.department,
        employabilityScore: getRandomInt(60, 98),
        skills: getRandomItems(SKILLS_POOL, getRandomInt(3, 7))
      });
      await profile.save();
    }

    console.log('Database seeded successfully with rich analytics data!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();
