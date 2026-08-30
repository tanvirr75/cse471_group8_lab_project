'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getJobs } from '@/lib/api';

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      const res = await getJobs();
      setJobs(Array.isArray(res) ? res : res.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-white p-8">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 tracking-widest uppercase mb-3">
              <span>RECRUITER</span>
              <span className="text-slate-600">•</span>
              <span>JOB POSTS</span>
            </div>
            <h1 className="text-3xl font-bold">My Job Posts</h1>
          </div>
          <Link href="/recruiter/jobs/new" className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <span>+</span> Post new job
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-500">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
              You haven&apos;t posted any jobs yet.
            </div>
          ) : (
            jobs.map(job => (
              <div key={job._id} className="bg-[#161b22] border border-[#1e293b] p-6 rounded-xl space-y-4">
                <h3 className="font-bold text-lg">{job.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2">{job.description}</p>
                <div className="pt-4 border-t border-[#1e293b] flex justify-between text-sm">
                  <span className="text-blue-400 font-bold">{job.applicants || 0} applicants</span>
                  <span className="text-emerald-500">Active</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
