// Feature 5: Programming Language & Repository Analysis
// Reads a student's public GitHub repositories and summarises which
// programming languages they use most. The result is meant to be consumed
// later by the Employability Score feature (Member 2).

const GITHUB_API = "https://api.github.com";

exports.getGithubAnalysis = async (req, res) => {
  try {
    const { username } = req.params;

    // GitHub rejects requests that do not identify the caller, so a
    // User-Agent header is required. The token is optional: without it we get
    // 60 requests/hour, with it 5000/hour. It is read from .env if present.
    const headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": "SkillSync-App",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // per_page=100 is GitHub's maximum. We deliberately do not paginate:
    // for a student account 100 repos is far more than enough.
    const url = `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`;
    const response = await fetch(url, { headers });

    // The username does not exist on GitHub.
    if (response.status === 404) {
      return res.status(404).json({ message: `GitHub user "${username}" not found` });
    }

    // GitHub returns 403 (or 429) when the hourly rate limit is used up.
    // We detect this using the x-ratelimit-remaining header and pass a clear
    // message back to the frontend instead of a generic failure.
    if (response.status === 403 || response.status === 429) {
      const remaining = response.headers.get("x-ratelimit-remaining");
      if (remaining === "0") {
        return res.status(429).json({
          message: "GitHub API rate limit exceeded. Please try again later.",
        });
      }
      return res.status(403).json({ message: "GitHub API refused the request" });
    }

    // Any other unexpected status from GitHub.
    if (!response.ok) {
      return res.status(500).json({
        message: `GitHub API error (status ${response.status})`,
      });
    }

    const repos = await response.json();

    // Count how many repos use each language.
    // NOTE: the /users/:username/repos list endpoint gives ONE primary language
    // per repo (the language with the most bytes). It is not the full
    // per-language byte breakdown available at /repos/:owner/:repo/languages.
    // This is a deliberate simplification: the detailed version would need one
    // extra API call per repository, which would quickly hit the rate limit.
    const counts = {};
    let reposWithLanguage = 0;

    for (const repo of repos) {
      // Empty repos, or repos with only config/markdown files, have language null.
      if (!repo.language) continue;

      if (counts[repo.language]) {
        counts[repo.language] = counts[repo.language] + 1;
      } else {
        counts[repo.language] = 1;
      }
      reposWithLanguage = reposWithLanguage + 1;
    }

    // Turn the counts object into the array shape the frontend expects.
    // Percent is out of the repos that actually have a language, so the
    // percentages add up to ~100 (rounding can make it 99 or 101).
    const languageBreakdown = [];
    for (const language in counts) {
      const count = counts[language];
      const percent = Math.round((count / reposWithLanguage) * 100);
      languageBreakdown.push({ language, count, percent });
    }

    // Most used language first.
    languageBreakdown.sort((a, b) => b.count - a.count);

    res.json({
      username,
      totalRepos: repos.length,
      languageBreakdown,
      lastUpdated: new Date(),
    });
  } catch (err) {
    // Network failure, GitHub unreachable, bad JSON, etc.
    res.status(500).json({ message: err.message });
  }
};
