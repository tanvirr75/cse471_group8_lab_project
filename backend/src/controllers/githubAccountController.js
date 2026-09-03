// Feature 1: GitHub Account Integration.
// Lets a logged-in student save their own GitHub username to their SkillSync
// profile, then re-fetch that saved profile's public info later. This is
// different from Feature 5 (githubController.js), which looks up ANY public
// username on demand without saving anything to the database.

const User = require("../models/User");

const GITHUB_API = "https://api.github.com";

// Same header requirement as Feature 5: GitHub rejects requests with no
// User-Agent, and an optional token raises the rate limit from 60/hr to
// 5000/hr. Read from .env if present.
function githubHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "SkillSync-App",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

// Same 404 / rate-limit / generic-error handling as Feature 5, shared here
// because both functions below call the same GitHub endpoint. Returns null
// when the response is fine, or a { status, body } pair to send back if not.
async function githubErrorFor(response, username) {
  if (response.status === 404) {
    return { status: 404, body: { message: `GitHub user "${username}" not found` } };
  }

  if (response.status === 403 || response.status === 429) {
    const remaining = response.headers.get("x-ratelimit-remaining");
    if (remaining === "0") {
      return {
        status: 429,
        body: { message: "GitHub API rate limit exceeded. Please try again later." },
      };
    }
    return { status: 403, body: { message: "GitHub API refused the request" } };
  }

  if (!response.ok) {
    return { status: 500, body: { message: `GitHub API error (status ${response.status})` } };
  }

  return null;
}

// POST /api/github-account/connect
exports.connectGithubAccount = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "username is required" });
    }

    // Confirm the username actually exists on GitHub before saving it.
    const response = await fetch(`${GITHUB_API}/users/${username}`, {
      headers: githubHeaders(),
    });

    const error = await githubErrorFor(response, username);
    if (error) return res.status(error.status).json(error.body);

    await User.findByIdAndUpdate(req.user.id, { githubUsername: username });

    res.json({ message: "GitHub account connected", githubUsername: username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/github-account/profile
exports.getConnectedGithubProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.githubUsername) {
      return res.status(404).json({ message: "No GitHub account connected yet" });
    }

    const response = await fetch(`${GITHUB_API}/users/${user.githubUsername}`, {
      headers: githubHeaders(),
    });

    const error = await githubErrorFor(response, user.githubUsername);
    if (error) return res.status(error.status).json(error.body);

    const profile = await response.json();

    // Only return the public fields the frontend actually needs.
    res.json({
      login: profile.login,
      name: profile.name,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      public_repos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      html_url: profile.html_url,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
