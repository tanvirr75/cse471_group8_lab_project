// Next.js (via next.config.mjs) will automatically proxy these requests locally.
// In production, we can provide the full URL via the environment variable.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const DEV_USER_ID = "64f1a2b3c4d5e6f7a8b9c0d1"; // Kept for backwards compatibility with other features

// Helper to get auth headers
const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Use real userId if logged in, otherwise fallback to DEV_USER_ID so other pages don't break
  headers["x-user-id"] = userId || DEV_USER_ID;

  return headers;
};

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Registration failed");
  return result;
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Login failed");
  return result;
}

export async function getJobs(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/api/jobs?${query}`);
  return res.json();
}

export async function getMatches(params = {}) {
  // Same query-string pattern as getJobs, so the matches page can filter too.
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/api/jobs/matches?${query}`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function getJobById(id) {
  const res = await fetch(`${API_URL}/api/jobs/${id}`);
  return res.json();
}

export async function createJob(jobData) {
  const res = await fetch(`${API_URL}/api/jobs`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(jobData),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create job");
  return result;
}

export async function applyToJob(jobId) {
  const res = await fetch(`${API_URL}/api/applications`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ jobId }),
  });
  return res.json();
}

// Feature 5: language / repository analysis for one GitHub username.
// Unlike the helpers above we check res.ok here, because this endpoint can
// legitimately fail (unknown username, GitHub rate limit) and the card needs
// to show that message to the user.
export async function getGithubAnalysis(username) {
  const res = await fetch(`${API_URL}/api/github/${username}/analysis`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Could not load GitHub analysis");
  }
  return data;
}

export async function getMyApplications() {
  const res = await fetch(`${API_URL}/api/applications`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function updateApplicationStatus(id, status) {
  const res = await fetch(`${API_URL}/api/applications/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function getUniversityAnalytics() {
  const res = await fetch(`${API_URL}/api/university/analytics`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to load university analytics");
  }
  return data;
}
export async function getRecruiterApplications() {
  const res = await fetch(`${API_URL}/api/applications/recruiter`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to load recruiter applications");
  return data;
}

export async function scheduleInterview(applicationId, interviewData) {
  const res = await fetch(
    `${API_URL}/api/applications/${applicationId}/interview`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(interviewData),
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to schedule interview");
  return data;
}

// Feature 11: persisted recommendations from the smart recommendation engine.
export async function getCareerRecommendations() {
  const res = await fetch(`${API_URL}/api/recommendations/career`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load career recommendations");
  return data;
}

export async function generateCareerRecommendations() {
  const res = await fetch(`${API_URL}/api/recommendations/career`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to generate career recommendations");
  return data;
}
// Pass { refresh: "true" } to force a re-score of every open job.
export async function getRecommendations(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(
    `${API_URL}/api/recommendations${query ? `?${query}` : ""}`,
    { headers: getAuthHeaders() },
  );
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to load recommendations");
  return data;
}

export async function getTechNews() {
  const res = await fetch(`${API_URL}/api/news`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load news");
  return data;
}
// Feature 13: Recruiter Candidate Shortlisting
export async function toggleShortlist(candidateId) {
  const res = await fetch(`${API_URL}/api/recruiters/shortlist/${candidateId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to toggle shortlist");
  return data;
}

export async function getShortlistedCandidates() {
  const res = await fetch(`${API_URL}/api/recruiters/shortlist`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch shortlist");
  return data;
}

export async function getApplicationById(id) {
  const res = await fetch(`${API_URL}/api/applications/${id}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch application");
  return data;
}

// Notifications API
export async function getNotifications() {
  const res = await fetch(`${API_URL}/api/notifications`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load notifications");
  return data;
}

export async function markAllNotificationsAsRead() {
  const res = await fetch(`${API_URL}/api/notifications/read-all`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update notifications");
  return data;
}

// Profile API
export async function getProfile() {
  const res = await fetch(`${API_URL}/api/profile`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load profile");
  return data;
}

export async function updateProfile(profileData) {
  const res = await fetch(`${API_URL}/api/profile/update`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update profile");
  return data;
}

// Feature 1: GitHub Account Integration
export async function connectGithubAccount(username) {
  const res = await fetch(`${API_URL}/api/github-account/connect`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ username }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to connect GitHub account");
  return data;
}

export async function getConnectedGithubProfile() {
  const res = await fetch(`${API_URL}/api/github-account/profile`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load GitHub profile");
  return data;
}
