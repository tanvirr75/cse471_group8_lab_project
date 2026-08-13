const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  connectGithubAccount,
  getConnectedGithubProfile,
} = require("../controllers/githubAccountController");

// Both routes need to know which student is calling, so they use the real
// JWT auth (authMiddleware.protect) - the same one already working for
// GET /api/auth/profile - not the devAuth stub, since that doesn't load a
// real User document and this feature writes to the User's own profile.
router.use(protect);

router.post("/connect", connectGithubAccount);
router.get("/profile", getConnectedGithubProfile);

module.exports = router;
