"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getRecommendations, getMyApplications } from "@/lib/api";
import Button from "@/components/common/Button";
import FilterDropdown from "@/components/common/FilterDropdown";
import { getAvatarColor } from "@/utils/avatarColor";

// Feature 11: Smart Job Recommendation System.
// Unlike /jobs (which scores on every request), this page reads persisted
// recommendations from the engine and polls periodically so newly published
// postings show up automatically while the student keeps the tab open.

const POLL_INTERVAL_MS = 60_000;
const LAST_VISIT_KEY = "recs_last_visit";

const SORT_OPTIONS = [
  { value: "match", label: "Best Match" },
  { value: "newest", label: "Newest" },
  { value: "company", label: "Company A-Z" },
];

// Ring geometry for the circular match indicator
const RING_RADIUS = 26;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Score tiers drive both the ring colour and the chip accents
const tierFor = (pct) => (pct >= 80 ? "high" : pct >= 60 ? "medium" : "low");

const TIER_STROKE = {
  high: "stroke-emerald-400",
  medium: "stroke-amber-400",
  low: "stroke-slate-500",
};

// Shared look for dark-theme secondary controls (same recipe as the filter
// row on /jobs - the shared Button's "outline" variant is light-themed).
const ghostButtonClass =
  "h-10 rounded-md border border-border-dark bg-transparent px-4 text-sm font-medium text-text-muted hover:text-text-light transition-colors disabled:opacity-50 disabled:pointer-events-none";

export default function RecommendationsPage() {
  const [recs, setRecs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("match");
  const [newSince, setNewSince] = useState(null);

  // Guards the "last visit" timestamp so the 60s poll doesn't keep pushing it
  // forward (which would un-mark jobs as NEW before the student sees them).
  const visitRecorded = useRef(false);

  const load = useCallback(async (forceRefresh = false) => {
    try {
      // Load applications in parallel so cards can show an "Applied" state.
      const [data, apps] = await Promise.all([
        getRecommendations(forceRefresh ? { refresh: "true" } : {}),
        getMyApplications().catch(() => []),
      ]);

      setError("");
      setRecs(data);
      setAppliedJobIds(
        new Set(apps.map((a) => String(a.jobId?._id || a.jobId))),
      );

      // First successful load of the session: remember which jobs already
      // existed as of the previous visit, then stamp this visit.
      if (!visitRecorded.current && typeof window !== "undefined") {
        const previous = localStorage.getItem(LAST_VISIT_KEY);
        if (previous) setNewSince(new Date(previous));
        localStorage.setItem(LAST_VISIT_KEY, new Date().toISOString());
        visitRecorded.current = true;
      }
    } catch (err) {
      setError(err.message || "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // First fetch runs on a timeout so nothing sets state synchronously inside
    // the effect body (react-hooks/set-state-in-effect); afterwards the
    // continuous-comparison poll re-checks for newly scored postings every minute.
    const initialLoad = setTimeout(() => load(), 0);
    const timer = setInterval(() => load(), POLL_INTERVAL_MS);

    return () => {
      clearTimeout(initialLoad);
      clearInterval(timer);
    };
  }, [load]);

  const isNew = (job) => newSince && new Date(job.createdAt) > newSince;

  // Sorting mirrors the /jobs page: match order comes from the API, the other
  // two only need fields we already have client-side.
  const visibleRecs = [...recs];
  if (sort === "newest") {
    visibleRecs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === "company") {
    visibleRecs.sort((a, b) =>
      (a.company || "").localeCompare(b.company || ""),
    );
  }

  const highMatches = recs.filter((r) => r.matchPercent >= 80).length;
  const newCount = newSince ? recs.filter(isNew).length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="text-xs font-semibold tracking-wide text-primary">
            SMART RECOMMENDATIONS
          </span>
          <h1 className="mt-1 text-2xl font-bold text-text-light">
            Recommended for you
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Ranked by your skills, GitHub projects, AI career analysis,
            academics and employability. New postings are scored automatically -
            refreshes every minute.
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={loading}
          className={ghostButtonClass}
        >
          Refresh now
        </button>
      </div>

      {/* Stats row */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-4 max-w-lg">
          <div className="rounded-lg border border-border-dark bg-surface-dark p-4">
            <p className="text-2xl font-bold text-text-light">{recs.length}</p>
            <p className="text-xs text-text-muted">Open matches</p>
          </div>
          <div className="rounded-lg border border-border-dark bg-surface-dark p-4">
            <p className="text-2xl font-bold text-emerald-400">{highMatches}</p>
            <p className="text-xs text-text-muted">80%+ matches</p>
          </div>
          <div className="rounded-lg border border-border-dark bg-surface-dark p-4">
            <p className="text-2xl font-bold text-primary">{newCount}</p>
            <p className="text-xs text-text-muted">New since last visit</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <FilterDropdown
          label="Sort"
          value={sort}
          options={SORT_OPTIONS}
          onChange={setSort}
        />
      </div>

      {loading ? (
        <p className="text-sm text-text-muted">
          Scoring jobs against your profile...
        </p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : visibleRecs.length === 0 ? (
        <p className="text-sm text-text-muted">
          No open roles to recommend yet. Check back soon - new postings are
          scored automatically.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleRecs.map((job) => {
            const applied = appliedJobIds.has(String(job._id));
            const tier = tierFor(job.matchPercent);

            return (
              <div
                key={job.recommendationId}
                className="flex flex-col gap-3 rounded-lg border border-border-dark bg-surface-dark p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 shrink-0 rounded-md flex items-center justify-center text-sm font-semibold text-white ${getAvatarColor(job.company)}`}
                  >
                    {job.company?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-text-light leading-tight truncate">
                      {job.title}
                    </h2>
                    <p className="text-xs text-text-muted truncate">
                      {job.company} · {job.location || job.workplace}
                    </p>
                  </div>

                  {/* Circular match percentage */}
                  <div className="relative h-14 w-14 shrink-0">
                    <svg viewBox="0 0 64 64" className="h-14 w-14 -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r={RING_RADIUS}
                        fill="none"
                        strokeWidth="6"
                        className="stroke-background-dark"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r={RING_RADIUS}
                        fill="none"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={RING_CIRCUMFERENCE}
                        strokeDashoffset={
                          RING_CIRCUMFERENCE * (1 - job.matchPercent / 100)
                        }
                        className={`${TIER_STROKE[tier]} transition-[stroke-dashoffset] duration-700`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text-light">
                      {job.matchPercent}%
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {[job.workplace, job.type].filter(Boolean).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-background-dark px-2 py-0.5 text-xs text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                  {isNew(job) && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                      NEW
                    </span>
                  )}
                  {applied && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                      APPLIED
                    </span>
                  )}
                </div>

                {/* Why this job was recommended */}
                {(job.reasons?.length > 0 || job.missingSkills?.length > 0) && (
                  <div className="space-y-1.5">
                    {job.reasons?.slice(0, 2).map((reason) => (
                      <p key={reason} className="text-xs text-text-muted">
                        <span className="text-emerald-400">✓</span> {reason}
                      </p>
                    ))}
                    {job.missingSkills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {job.matchedSkills?.map((skill) => (
                          <span
                            key={skill}
                            className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[11px] text-emerald-300"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.missingSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded bg-background-dark px-1.5 py-0.5 text-[11px] text-text-muted"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Deep-link into the existing job detail page, passing the
                    score through like /jobs does for its "YOUR MATCH" panel. */}
                {applied ? (
                  <Link
                    href={`/jobs/${job._id}?match=${job.matchPercent}`}
                    className={`mt-auto flex w-full items-center justify-center ${ghostButtonClass}`}
                  >
                    View application status
                  </Link>
                ) : (
                  <Link
                    href={`/jobs/${job._id}?match=${job.matchPercent}`}
                    className="mt-auto"
                  >
                    <Button className="w-full">View &amp; Apply</Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
