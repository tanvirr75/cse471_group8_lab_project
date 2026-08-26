require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const seedApplications = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding Applications...');

    // 1. Get the recruiter
    const recruiter = await User.findOne({ email: 'recruiter@techcorp.com' });
    if (!recruiter) throw new Error("Recruiter not found. Run seedUsers.js first.");

    // 2. Get a student
    const student = await User.findOne({ email: 'student1@skillsync.com' });
    if (!student) throw new Error("Student not found. Run seedUsers.js first.");

    // Clear old jobs and applications to avoid duplicates
    await Job.deleteMany({});
    await Application.deleteMany({});

    // 3. Create a Job
    const job = await Job.create({
      title: 'Software Engineer Intern',
      company: 'TechCorp',
      location: 'New York, NY',
      type: 'Full-time',
      description: 'Looking for a bright intern to join our core backend team.',
      requirements: ['Node.js', 'React', 'MongoDB'],
      postedBy: recruiter._id
    });
    console.log('Created Job:', job.title);

    // 4. Create an Application
    const application = await Application.create({
      userId: student._id,
      jobId: job._id,
      status: 'under_review',
      matchPercentage: 92
    });
    console.log('Created Application for:', student.name);

    console.log('Successfully seeded Jobs and Applications!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding applications:', error);
    process.exit(1);
  }
};

seedApplications();
