"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMatches } from "@/lib/api";
import Button from "@/components/common/Button";
import { getAvatarColor } from "@/utils/avatarColor";

const FILTERS = ["Role type", "Workplace", "Location", "Sort"];

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatches().then((data) => {
      setJobs(data);
      setLoading(false);
      
      // Feature 12: Notify if any job match clears 80%
      if (data.length > 0 && data[0].matchPercent >= 80) {
        // Find how many jobs matched > 80%
        const highMatches = data.filter(job => job.matchPercent >= 80).length;
        // Check if we already notified this session to avoid spam
        if (!sessionStorage.getItem('notified_high_matches')) {
          alert(`Great news! You have ${highMatches} job(s) with an 80%+ match rate. Check them out!`);
          sessionStorage.setItem('notified_high_matches', 'true');
        }
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="text-xs font-semibold tracking-wide text-primary">
            SMART RECOMMENDATIONS
          </span>
          <h1 className="mt-1 text-2xl font-bold text-text-light">Jobs matched to you</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Ranked by compatibility with your skills, GitHub, and career readiness. You&apos;re
            notified when a new role clears 80%.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-border-dark bg-surface-dark px-3 py-1 text-xs font-medium text-text-muted">
          Notify me above 80%
        </span>
      </div>

      {/* Filter bar is visual only - /api/jobs/matches (used above) doesn't
          accept query filters yet, unlike plain /api/jobs. */}
      <div className="flex flex-wrap gap-3">
        {FILTERS.map((label) => (
          <Button
            key={label}
            type="button"
            variant="outline"
            className="!border-border-dark !bg-transparent !text-text-muted hover:!text-text-light hover:!bg-surface-dark"
          >
            {label} All ▾
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-text-muted">Loading jobs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="flex flex-col gap-3 rounded-lg border border-border-dark bg-surface-dark p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 shrink-0 rounded-md flex items-center justify-center text-sm font-semibold text-white ${getAvatarColor(job.company)}`}
                >
                  {job.company?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-text-light leading-tight truncate">{job.title}</h2>
                  <p className="text-xs text-text-muted truncate">
                    {job.company} · via {job.source || "internal"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[job.workplace, job.type, job.location].filter(Boolean).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-background-dark px-2 py-0.5 text-xs text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-background-dark">
                  <div
                    className="h-1.5 rounded-full bg-primary"
                    style={{ width: `${job.matchPercent}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-text-light">{job.matchPercent}%</span>
              </div>

              {/* matchPercent is only computed on the fly by /api/jobs/matches
                  and isn't stored on the Job itself, so it's passed through
                  the URL for the detail page's "YOUR MATCH" panel to read. */}
              <Link href={`/jobs/${job._id}?match=${job.matchPercent}`} className="mt-auto">
                <Button className="w-full">View & Apply</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
