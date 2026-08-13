"use client";
import { useEffect, useState } from "react";
import { getMyApplications } from "../../lib/api";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getMyApplications().then(setApplications);
  }, []);

  return (
    <main>
      <h1>My Applications</h1>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Status</th>
            <th>Applied At</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td>{app.jobId?.title}</td>
              <td>{app.jobId?.company}</td>
              <td>{app.status}</td>
              <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
