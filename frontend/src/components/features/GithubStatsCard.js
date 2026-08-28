"use client";
import { useEffect, useState } from "react";
import { getGithubAnalysis } from "../../lib/api";

// Feature 5: shows a small summary of one student's public GitHub repos -
// how many repos they have, and which languages they use most.
export default function GithubStatsCard({ username }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Re-fetch whenever the username changes. Once Member 3's auth is merged
  // the username will come from the logged-in profile instead of a prop.
  useEffect(() => {
    async function loadAnalysis() {
      try {
        setLoading(true);
        setError("");
        const result = await getGithubAnalysis(username);
        setData(result);
      } catch (err) {
        // The API helper throws with the backend's message, e.g. "user not
        // found" or "rate limit exceeded", so we can show it directly.
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAnalysis();
  }, [username]);

  if (loading) return <p>Loading GitHub stats...</p>;
  if (error) return <p>GitHub stats unavailable: {error}</p>;

  return (
    <div style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "20px" }}>
      <h2>My GitHub Snapshot</h2>
      <p>
        <strong>{data.username}</strong> - {data.totalRepos} public repositories
      </p>

      {data.languageBreakdown.length === 0 ? (
        <p>No languages detected in these repositories.</p>
      ) : (
        data.languageBreakdown.map((item) => (
          <div key={item.language} style={{ marginBottom: "6px" }}>
            <div>
              {item.language} - {item.count} repos ({item.percent}%)
            </div>

            {/* The bar is just a grey track with a coloured div inside it.
                The inner div's width is the percent value, so no charting
                library is needed. */}
            <div style={{ background: "#eee", width: "100%", height: "10px" }}>
              <div
                style={{
                  background: "#0070f3",
                  width: `${item.percent}%`,
                  height: "10px",
                }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
