require("dotenv").config();
const mongoose = require("mongoose");
const Job = require("../src/models/Job");

const sampleJobs = [
  {
    title: "Junior Frontend Developer",
    company: "Brainwave Tech",
    type: "Full-time",
    workplace: "Remote",
    location: "Dhaka, Bangladesh",
    skills: ["React", "Next.js", "Tailwind CSS"],
    description: "Build and maintain UI components for our SaaS product.",
    deadline: new Date("2026-09-30"),
  },
  {
    title: "MERN Stack Developer",
    company: "Pixel Forge",
    type: "Full-time",
    workplace: "Hybrid",
    location: "Dhaka, Bangladesh",
    skills: ["MongoDB", "Express", "React", "Node.js"],
    description: "Work on both frontend and backend features for our web app.",
    deadline: new Date("2026-10-15"),
  },
  {
    title: "Software Engineering Intern",
    company: "NovaSoft",
    type: "Internship",
    workplace: "On-site",
    location: "Dhaka, Bangladesh",
    skills: ["JavaScript", "Git", "REST APIs"],
    description: "3-month internship with mentorship from senior engineers.",
    deadline: new Date("2026-09-01"),
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Job.deleteMany({});
  await Job.insertMany(sampleJobs);
  console.log("Jobs seeded successfully");
  process.exit();
}

seed();
