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

  if (loading) return <p className="text-sm text-slate-400">Loading GitHub stats...</p>;
  if (error) return <p className="text-sm text-red-500">GitHub stats unavailable: {error}</p>;

  return (
    <div className="bg-[#161b22] border border-[#1e293b] rounded-xl p-8 space-y-6 shadow-lg">
      <h2 className="text-lg font-bold border-b border-[#1e293b] pb-2">My GitHub Snapshot</h2>
      <p className="text-sm text-slate-400">
        <strong className="text-white">{data.username}</strong> - {data.totalRepos} public repositories
      </p>

      {data.languageBreakdown.length === 0 ? (
        <p className="text-sm text-slate-400">No languages detected in these repositories.</p>
      ) : (
        <div className="space-y-4">
          {data.languageBreakdown.map((item) => (
            <div key={item.language} className="space-y-2">
              <div className="text-sm text-slate-400">
                {item.language} - {item.count} repos ({item.percent}%)
              </div>

              {/* The bar is just a track with a coloured div inside it.
                  The inner div's width is the percent value, so no charting
                  library is needed. */}
              <div className="w-full h-2.5 bg-[#0f111a] border border-[#1e293b] rounded-full overflow-hidden">
                <div
                  className="h-2.5 bg-blue-500 rounded-full"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
