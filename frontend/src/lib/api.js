const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const DEV_USER_ID = "64f1a2b3c4d5e6f7a8b9c0d1";

export async function getJobs(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/api/jobs?${query}`);
  return res.json();
}

export async function getMatches() {
  const res = await fetch(`${API_URL}/api/jobs/matches`);
  return res.json();
}

export async function getJobById(id) {
  const res = await fetch(`${API_URL}/api/jobs/${id}`);
  return res.json();
}

export async function applyToJob(jobId) {
  const res = await fetch(`${API_URL}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-user-id": DEV_USER_ID },
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
    headers: { "x-user-id": DEV_USER_ID },
  });
  return res.json();
}

export async function updateApplicationStatus(id, status) {
  const res = await fetch(`${API_URL}/api/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "x-user-id": DEV_USER_ID },
    body: JSON.stringify({ status }),
  });
  return res.json();
}
