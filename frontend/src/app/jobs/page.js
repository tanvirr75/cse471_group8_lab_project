"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMatches } from "../../lib/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatches().then((data) => {
      setJobs(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading jobs...</p>;

  return (
    <main>
      <h1>Job Matches</h1>
      <ul>
        {jobs.map((job) => (
          <li key={job._id}>
            <Link href={`/jobs/${job._id}`}>
              {job.title} - {job.company} ({job.matchPercent}% match)
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
