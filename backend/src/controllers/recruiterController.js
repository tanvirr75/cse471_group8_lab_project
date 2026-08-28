const User = require('../models/User');

// @desc    Toggle candidate shortlist status for a recruiter
// @route   POST /api/recruiters/shortlist/:candidateId
// @access  Private (Recruiter only)
exports.toggleShortlist = async (req, res) => {
  try {
    const { candidateId } = req.params;
    
    // Ensure the recruiter exists
    const recruiter = await User.findById(req.user.id);
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    // Ensure the candidate exists
    const candidate = await User.findById(candidateId);
    if (!candidate || candidate.role !== 'student') {
      return res.status(404).json({ message: 'Candidate not found or is not a student' });
    }

    const isShortlisted = recruiter.shortlistedCandidates.includes(candidateId);

    if (isShortlisted) {
      // Remove from shortlist
      recruiter.shortlistedCandidates = recruiter.shortlistedCandidates.filter(
        (id) => id.toString() !== candidateId
      );
    } else {
      // Add to shortlist
      recruiter.shortlistedCandidates.push(candidateId);
    }

    await recruiter.save();

    res.status(200).json({
      message: isShortlisted ? 'Removed from shortlist' : 'Added to shortlist',
      isShortlisted: !isShortlisted,
      shortlistedCandidates: recruiter.shortlistedCandidates
    });
  } catch (error) {
    console.error('Error toggling shortlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all shortlisted candidates for the logged in recruiter
// @route   GET /api/recruiters/shortlist
// @access  Private (Recruiter only)
exports.getShortlistedCandidates = async (req, res) => {
  try {
    const recruiter = await User.findById(req.user.id).populate({
      path: 'shortlistedCandidates',
      select: 'name email profilePicture targetRole skills employabilityScore githubUrl linkedinUrl resumeUrl university department',
    });

    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    res.status(200).json(recruiter.shortlistedCandidates);
  } catch (error) {
    console.error('Error fetching shortlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
