"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMatches } from "@/lib/api";
import Button from "@/components/common/Button";
import FilterDropdown from "@/components/common/FilterDropdown";
import { getAvatarColor } from "@/utils/avatarColor";

// Option values match the Job model's enums exactly, so they can be sent to
// the API as-is. Both lists are fed to FilterDropdown, our own dropdown
// component (see that file for why it is not a native <select>).
const ROLE_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];
const WORKPLACES = ["Remote", "On-site", "Hybrid"];

// Sort needs {value, label} pairs: the stored value is a short key the sorting
// code below checks for, while the user sees a friendlier label.
const SORT_OPTIONS = [
  { value: "match", label: "Best Match" },
  { value: "newest", label: "Newest" },
  { value: "company", label: "Company A-Z" },
];

// Shared look for every control in the filter row (same height/padding as Button).
const filterClass =
  "h-10 rounded-md border border-border-dark bg-transparent px-3 text-sm font-medium text-text-muted hover:text-text-light focus:outline-none focus:ring-2 focus:ring-slate-400";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // One piece of state per filter. Empty string means "All".
  const [type, setType] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("match");

  // Re-fetch whenever a server-side filter changes. Sort is not in this list
  // because it is handled on the client (see below).
  useEffect(() => {
    setLoading(true);

    // Only send filters that are actually set, so "All" means no param at all.
    const params = {};
    if (type) params.type = type;
    if (workplace) params.workplace = workplace;
    if (location) params.location = location;

    getMatches(params).then((data) => {
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
  }, [type, workplace, location]);

  // Sorting: "Best Match" is done on the server because matchPercent is
  // calculated there from the user's profile and isn't stored on the Job.
  // "Newest" and "Company A-Z" only use createdAt/company, which are already
  // in the data we just fetched, so we sort in JS instead of re-hitting the API.
  const visibleJobs = [...jobs];
  if (sort === "newest") {
    visibleJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === "company") {
    visibleJobs.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
  }

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

      {/* Role type / Workplace / Location are sent to /api/jobs/matches as query
          params; Sort is applied client-side. */}
      <div className="flex flex-wrap gap-3">
        <FilterDropdown
          label="Role type"
          value={type}
          options={ROLE_TYPES}
          onChange={setType}
        />

        <FilterDropdown
          label="Workplace"
          value={workplace}
          options={WORKPLACES}
          onChange={setWorkplace}
        />

        {/* Location is a text input, not a dropdown, because the Job model
            stores it as free text ("Dhaka, Bangladesh") rather than an enum. */}
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location: All"
          className={`${filterClass} w-44 placeholder:text-text-muted`}
        />

        <FilterDropdown
          label="Sort"
          value={sort}
          options={SORT_OPTIONS}
          onChange={setSort}
        />
      </div>

      {loading ? (
        <p className="text-sm text-text-muted">Loading jobs...</p>
      ) : visibleJobs.length === 0 ? (
        /* Filters can match nothing, so say so instead of showing a blank grid. */
        <p className="text-sm text-text-muted">No jobs match these filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleJobs.map((job) => (
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
