require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    // Connect to DB using the same logic as config/db.js
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing users to prevent duplicates during seeding (optional but safe for a fresh seed)
    await User.deleteMany({});
    console.log('Existing users cleared.');

    const users = [
      {
        name: 'Admin User',
        email: 'admin@skillsync.com',
        password: 'password123',
        role: 'admin',
        isVerified: true
      },
      {
        name: 'Tech University',
        email: 'career@techuniversity.edu',
        password: 'password123',
        role: 'university',
        isVerified: true
      },
      {
        name: 'Tech Recruiter',
        email: 'recruiter@techcorp.com',
        password: 'password123',
        role: 'recruiter',
        isVerified: true
      },
      {
        name: 'Student User',
        email: 'student@skillsync.com',
        password: 'password123',
        role: 'student',
        isVerified: true
      }
    ];

    // Note: The pre('save') hook in User model will automatically hash passwords
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
    }

    console.log('Database seeded successfully with roles: admin, university, recruiter, student!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();
