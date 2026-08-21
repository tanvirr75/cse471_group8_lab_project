'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecruiterApplications } from '@/lib/api';
import { timeAgo } from '@/utils/timeAgo';

export default function RecruiterDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecruiterApplications()
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalApplicants = applications.length;
  const interviewsScheduled = applications.filter(a => a.status === 'interview').length;
  const uniqueJobs = new Set(applications.map(a => a.jobId?._id)).size;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Recruiter Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back! Here's a quick overview of your recruitment pipeline.</p>
          </div>
          <Link href="/recruiter/applications" className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md">
            Go to Candidate Screening
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Active Job Postings (with applicants)</h3>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{loading ? '-' : uniqueJobs}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Total Applicants</h3>
            <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">{loading ? '-' : totalApplicants}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm relative z-10">Interviews Scheduled</h3>
            <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 relative z-10">{loading ? '-' : interviewsScheduled}</p>
          </div>
        </div>

        {/* Recent Activity / Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link href="/recruiter/applications" className="block group p-5 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/5 transition-all bg-slate-50 dark:bg-slate-950">
                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-2">
                  <span>Candidate Screening</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </h3>
                <p className="text-sm text-slate-500 mt-1">Review AI-matched candidates, filter by skills, and send interview invitations seamlessly.</p>
              </Link>
              <div className="block p-5 border border-slate-100 dark:border-slate-800 rounded-xl opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-950">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Job Postings (Coming Soon)</span>
                </h3>
                <p className="text-sm text-slate-500 mt-1">Create new job opportunities and manage your existing company listings.</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Applicants</h2>
              <Link href="/recruiter/applications" className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-slate-400">Loading...</div>
            ) : applications.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-center flex-col gap-2">
                <span className="text-2xl">📭</span>
                <p>No recent applications.</p>
              </div>
            ) : (
              <div className="space-y-3 flex-1">
                {applications.slice(0, 4).map(app => (
                  <div key={app._id} className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">{app.userId?.name}</p>
                      <p className="text-xs text-slate-500 truncate">Applied for: {app.jobId?.title}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full mb-1">
                        {app.matchPercentage}% Match
                      </span>
                      <span className="text-[10px] text-slate-400">{timeAgo(app.appliedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
