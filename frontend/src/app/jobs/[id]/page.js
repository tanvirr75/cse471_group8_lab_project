"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getJobById, applyToJob } from "../../../lib/api";

export default function JobDetailPage() {
  const { id } = useParams();
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

  if (!job) return <p>Loading...</p>;

  return (
    <main>
      <h1>{job.title}</h1>
      <p>{job.company} - {job.location}</p>
      <p>{job.type} / {job.workplace}</p>
      <p>Skills: {job.skills?.join(", ")}</p>
      <p>{job.description}</p>
      <button onClick={handleApply}>Apply</button>
      {message && <p>{message}</p>}
    </main>
  );
}
