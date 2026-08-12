"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMatches } from "../../lib/api";
import GithubStatsCard from "../../components/features/GithubStatsCard";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatches().then((data) => {
      setJobs(data);
      setLoading(false);
    });
  }, []);

  return (
    <main>
      {/* Placeholder username for now - this will come from the logged-in
          user's profile once Member 3's auth/profile system is merged. */}
      <GithubStatsCard username="akib-naimul" />

      <h1>Job Matches</h1>
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job._id}>
              <Link href={`/jobs/${job._id}`}>
                {job.title} - {job.company} ({job.matchPercent}% match)
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
