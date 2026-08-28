const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

exports.getAnalytics = async (req, res) => {
  try {
    // req.user contains the authenticated university user from the protect middleware
    // We expect the university user to have a 'companyName' or 'universityName' set
    // In our seed file, we used companyName for universities as well, but let's check both
    const universityUser = await User.findById(req.user.id);
    
    if (!universityUser) {
      return res.status(404).json({ message: 'University account not found' });
    }

    const uniName = universityUser.universityName || universityUser.companyName || universityUser.name;

    if (!uniName) {
       return res.status(400).json({ message: 'University name not configured for this account' });
    }

    // 1. Find all students belonging to this university
    // Case-insensitive regex match for flexibility
    const students = await User.find({ 
      role: 'student', 
      university: { $regex: new RegExp(`^${uniName}$`, 'i') } 
    }).select('_id department');

    const studentIds = students.map(s => s._id);

    // 2. Aggregate department distribution
    const departmentCounts = {};
    students.forEach(student => {
      const dept = student.department || 'Undeclared';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    const departmentBreakdown = Object.keys(departmentCounts).map(dept => ({
      name: dept,
      count: departmentCounts[dept]
    }));

    // Sort departments by count descending
    departmentBreakdown.sort((a, b) => b.count - a.count);

    // 3. Fetch user profiles for these students to get skills, scores, etc.
    const profiles = await UserProfile.find({ userId: { $in: studentIds } });

    let totalEmployability = 0;
    const skillCounts = {};
    let profilesWithScores = 0;

    profiles.forEach(profile => {
      // Calculate avg employability score
      if (profile.employabilityScore > 0) {
        totalEmployability += profile.employabilityScore;
        profilesWithScores++;
      }

      // Aggregate skills
      if (profile.skills && profile.skills.length > 0) {
        profile.skills.forEach(skill => {
          const s = skill.trim();
          skillCounts[s] = (skillCounts[s] || 0) + 1;
        });
      }
    });

    const avgEmployability = profilesWithScores > 0 
      ? Math.round(totalEmployability / profilesWithScores) 
      : 0;

    // Convert skills to array, sort, and take top 5
    const topSkills = Object.keys(skillCounts)
      .map(skill => ({ skill, count: skillCounts[skill] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      university: uniName,
      totalStudents: students.length,
      avgEmployability,
      departmentBreakdown,
      topSkills
    });

  } catch (err) {
    console.error('University Analytics Error:', err);
    res.status(500).json({ message: err.message });
  }
};
