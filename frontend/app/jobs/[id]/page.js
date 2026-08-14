"use client";
import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getJobById, applyToJob } from "../../../lib/api";
import Button from "../../../components/common/Button";
import { getAvatarColor } from "../../../utils/avatarColor";

// useSearchParams() requires a Suspense boundary for static prerendering,
// so the page body lives in an inner component wrapped below.
export default function JobDetailPage() {
  return (
    <Suspense fallback={<p className="text-sm text-text-muted">Loading...</p>}>
      <JobDetailContent />
    </Suspense>
  );
}

function JobDetailContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  // matchPercent is only computed on the fly by /api/jobs/matches and isn't
  // stored on the Job itself, so the matches page passes it through the URL
  // for this "YOUR MATCH" panel to read back.
  const matchPercent = searchParams.get("match");

  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getJobById(id).then(setJob);
  }, [id]);

  async function handleApply() {
    const result = await applyToJob(id);
    if (result._id) {
      setMessage("Applied successfully!");
    } else {
      setMessage(result.message || "Something went wrong");
    }
  }

  if (!job) return <p className="text-sm text-text-muted">Loading...</p>;

  const tags = [job.workplace, job.type, job.location].filter(Boolean);

  return (
    <div className="space-y-4">
      <Link href="/jobs" className="text-sm text-text-muted hover:text-text-light transition-colors">
        ← Back to matches
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-text-light">{job.title}</h1>
        <p className="mt-1 text-sm text-text-muted">
          {job.company} · {job.location} · via {job.source || "internal"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-border-dark bg-surface-dark p-4 flex items-center gap-3">
            <div
              className={`h-12 w-12 shrink-0 rounded-md flex items-center justify-center text-base font-semibold text-white ${getAvatarColor(job.company)}`}
            >
              {job.company?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-text-light">{job.company}</p>
              {/* No industry/size data is returned by the API (companyId
                  isn't populated), so it's left out rather than fabricated. */}
              <div className="mt-1 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-background-dark px-2 py-0.5 text-xs text-text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border-dark bg-surface-dark p-4">
            <h2 className="font-bold text-text-light mb-2">About the role</h2>
            <p className="text-sm text-text-muted whitespace-pre-line">
              {job.description || "No description provided."}
            </p>
          </div>

          <div className="rounded-lg border border-border-dark bg-surface-dark p-4">
            {/* Job model has no separate "requirements" field, so the
                required skills are listed here instead, labeled clearly. */}
            <h2 className="font-bold text-text-light mb-2">Requirements (Skills)</h2>
            {job.skills?.length ? (
              <ul className="list-disc list-inside space-y-1 text-sm text-text-muted">
                {job.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-muted">No specific skills listed.</p>
            )}
          </div>
        </div>

        {/* Sticky match/apply panel */}
        <div className="lg:sticky lg:top-20 h-fit rounded-lg border border-border-dark bg-surface-dark p-4 space-y-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">
              {matchPercent !== null ? `${matchPercent}%` : "—"}
            </p>
            <p className="text-xs font-medium tracking-wide text-text-muted">YOUR MATCH</p>
            <div className="mt-2 h-1.5 rounded-full bg-background-dark">
              <div
                className="h-1.5 rounded-full bg-primary"
                style={{ width: `${matchPercent ?? 0}%` }}
              />
            </div>
          </div>

          {/* "Why you match" per-skill breakdown skipped - the backend only
              returns an overall matchPercent from getMatches(), not a
              per-skill breakdown. Would need a new API field to add this. */}

          <Button onClick={handleApply} className="w-full">
            Apply now
          </Button>
          <Button
            variant="outline"
            className="w-full !border-border-dark !bg-transparent !text-text-light hover:!bg-background-dark"
          >
            Save for later
          </Button>

          {message && <p className="text-sm text-text-muted text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
}
