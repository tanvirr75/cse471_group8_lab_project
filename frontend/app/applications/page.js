"use client";
import { useEffect, useState } from "react";
import { getMyApplications } from "@/lib/api";
import { getAvatarColor } from "@/utils/avatarColor";
import { timeAgo } from "@/utils/timeAgo";

// The mockup only has 4 kanban columns, so "under_review" is grouped into
// "Applied" below - both mean "submitted, no interview yet".
const COLUMNS = [
  { key: "applied", label: "Applied" },
  { key: "interview", label: "Interview" },
  { key: "accepted", label: "Offer/Accepted" },
  { key: "rejected", label: "Rejected" },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getMyApplications().then(setApplications);
  }, []);

  const total = applications.length;
  const interviewing = applications.filter((app) => app.status === "interview").length;
  const offers = applications.filter((app) => app.status === "accepted").length;

  // Response Rate = share of applications that have moved past the initial
  // "applied" status (under_review, interview, rejected, or accepted) - i.e.
  // the company has responded in some way. Rounded to the nearest percent.
  const responded = applications.filter((app) => app.status !== "applied").length;
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

  function applicationsForColumn(key) {
    if (key === "applied") {
      return applications.filter((app) => app.status === "applied" || app.status === "under_review");
    }
    return applications.filter((app) => app.status === key);
  }

  const stats = [
    { label: "Total Applied", value: total },
    { label: "Interviewing", value: interviewing },
    { label: "Offers", value: offers },
    { label: "Response Rate", value: `${responseRate}%` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold tracking-wide text-primary">MY APPLICATIONS</span>
        <h1 className="mt-1 text-2xl font-bold text-text-light">Application tracker</h1>
        <p className="mt-1 text-sm text-text-muted">
          Track every job you&apos;ve applied to and its current status.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border-dark bg-surface-dark p-4">
            <p className="text-xs text-text-muted">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-text-light">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((column) => {
          const items = applicationsForColumn(column.key);
          return (
            <div key={column.key} className="rounded-lg border border-border-dark bg-surface-dark p-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-text-light">{column.label}</h2>
                <span className="rounded-full bg-background-dark px-2 py-0.5 text-xs text-text-muted">
                  {items.length}
                </span>
              </div>
              <div className="space-y-2">
                {items.map((app) => (
                  <div key={app._id} className="rounded-md border border-border-dark bg-background-dark p-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-7 w-7 shrink-0 rounded-md flex items-center justify-center text-xs font-semibold text-white ${getAvatarColor(app.jobId?.company)}`}
                      >
                        {app.jobId?.company?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-light truncate">{app.jobId?.title}</p>
                        <p className="text-xs text-text-muted truncate">{app.jobId?.company}</p>
                      </div>
                    </div>
                    
                    {app.status === 'interview' && app.interviewDetails && (
                      <div className="mt-3 bg-surface-dark border border-primary/30 rounded p-2 text-xs">
                        <div className="text-primary font-bold mb-1 flex items-center gap-1">
                          📅 Interview Scheduled
                        </div>
                        <p className="text-text-light"><span className="text-text-muted">When:</span> {app.interviewDetails.date} at {app.interviewDetails.time}</p>
                        <p className="text-text-light"><span className="text-text-muted">Where:</span> {app.interviewDetails.platform}</p>
                        <a href={app.interviewDetails.linkOrLocation} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block mt-1">
                          {app.interviewDetails.linkOrLocation}
                        </a>
                        {app.interviewDetails.message && (
                          <p className="mt-2 text-text-muted italic border-t border-border-dark pt-1">
                            "{app.interviewDetails.message}"
                          </p>
                        )}
                      </div>
                    )}

                    <span className="mt-2 inline-block rounded-full bg-surface-dark px-2 py-0.5 text-[11px] text-text-muted">
                      {timeAgo(app.appliedAt)}
                    </span>
                  </div>
                ))}
                {items.length === 0 && <p className="text-xs text-text-muted">No applications</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
