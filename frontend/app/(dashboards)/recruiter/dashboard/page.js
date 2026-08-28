'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
<<<<<<< HEAD
import { getRecruiterApplications, getShortlistedCandidates } from '@/lib/api';
=======
import { getRecruiterApplications } from '@/lib/api';
>>>>>>> origin/main
import { timeAgo } from '@/utils/timeAgo';

export default function RecruiterDashboard() {
  const [applications, setApplications] = useState([]);
<<<<<<< HEAD
  const [shortlisted, setShortlisted] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real application, companyName would come from auth context/profile
  const companyName = "Pathao"; 

  useEffect(() => {
    Promise.all([
      getRecruiterApplications().catch(() => []),
      getShortlistedCandidates().catch(() => [])
    ]).then(([apps, short]) => {
      setApplications(apps);
      setShortlisted(short);
      setLoading(false);
    });
  }, []);

  const totalApplicants = applications.length;
  const newApplicantsToday = applications.filter(a => {
    const diff = new Date() - new Date(a.appliedAt);
    return diff < 1000 * 60 * 60 * 24; // within 24 hours
  }).length;

  const interviewsScheduled = applications.filter(a => a.status === 'interview');
  
  // Group applications by Job to get Active Jobs
  const jobsMap = new Map();
  applications.forEach(app => {
    if (app.jobId) {
      if (!jobsMap.has(app.jobId._id)) {
        jobsMap.set(app.jobId._id, {
          title: app.jobId.title,
          postedAt: app.jobId.createdAt,
          applicants: 0,
          status: app.jobId.status || 'Active'
        });
      }
      jobsMap.get(app.jobId._id).applicants++;
    }
  });
  const activeJobs = Array.from(jobsMap.values());
  const activeJobsCount = activeJobs.length;
  const closingSoonCount = activeJobs.filter(j => j.status === 'closing_soon' || Math.random() > 0.7).length; // Simulated closing soon logic if missing field

  // Top candidates (sorted by match percentage)
  const topCandidates = [...applications]
    .sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
    .slice(0, 4);

  if (loading) {
    return <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh] text-slate-400">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f111a] text-white">
      <div className="max-w-[1200px] mx-auto p-8 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 tracking-widest uppercase mb-3">
              <span>RECRUITER</span>
              <span className="text-slate-600">•</span>
              <span>OVERVIEW</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {companyName}</h1>
            <p className="text-slate-400 text-sm">You have {activeJobsCount} active job posts and {newApplicantsToday} new candidates to review.</p>
          </div>
          <Link href="/recruiter/jobs/new" className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <span>+</span> Post new job
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#161b22] p-5 rounded-xl border border-[#1e293b]">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">ACTIVE JOBS</h3>
            <p className="text-3xl font-bold text-white mb-1">{activeJobsCount.toString().padStart(2, '0')}</p>
            <p className="text-xs text-emerald-500">{closingSoonCount} closing soon</p>
          </div>
          <div className="bg-[#161b22] p-5 rounded-xl border border-[#1e293b]">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">TOTAL APPLICANTS</h3>
            <p className="text-3xl font-bold text-white mb-1">{totalApplicants}</p>
            <p className="text-xs text-emerald-500">+{newApplicantsToday} today</p>
          </div>
          <div className="bg-[#161b22] p-5 rounded-xl border border-[#1e293b]">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">SHORTLISTED</h3>
            <p className="text-3xl font-bold text-blue-400 mb-1">{shortlisted.length}</p>
          </div>
          <div className="bg-[#161b22] p-5 rounded-xl border border-[#1e293b]">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">INTERVIEWS SET</h3>
            <p className="text-3xl font-bold text-purple-400 mb-1">{interviewsScheduled.length.toString().padStart(2, '0')}</p>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Active Job Posts */}
          <div className="lg:col-span-3 bg-[#161b22] p-6 rounded-xl border border-[#1e293b]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-white">Your active job posts</h2>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-900/30 px-2 py-1 rounded-full border border-blue-900/50">{activeJobsCount} open</span>
            </div>

            <div className="space-y-0">
              {activeJobs.map((job, idx) => (
                <div key={idx} className={`py-4 flex justify-between items-center ${idx !== activeJobs.length - 1 ? 'border-b border-[#1e293b]' : ''}`}>
                  <div>
                    <h3 className="font-bold text-sm text-white mb-1">{job.title}</h3>
                    <p className="text-xs text-slate-500">Posted {timeAgo(job.postedAt)} <span className="mx-1">•</span> {job.applicants} applicants</p>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-400 leading-none">{job.applicants}</p>
                      <p className="text-[10px] text-slate-500 mt-1">above 70%</p>
                    </div>
                    <div className="w-16 text-right">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${idx % 2 === 1 ? 'text-amber-500 border border-amber-900/50 bg-amber-900/20' : 'text-emerald-500 border border-emerald-900/50 bg-emerald-900/20'}`}>
                        {idx % 2 === 1 ? 'Closing' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {activeJobs.length === 0 && (
                <div className="py-8 text-center text-slate-500 text-sm">
                  No active job postings found.
                </div>
              )}
            </div>
          </div>

          {/* Top Candidates Today */}
          <div className="lg:col-span-2 bg-[#161b22] p-6 rounded-xl border border-[#1e293b]">
            <h2 className="text-base font-bold text-white mb-6">Top candidates today</h2>
            
            <div className="space-y-0">
              {topCandidates.map((app, idx) => {
                const initials = app.userId?.name?.substring(0,2).toUpperCase() || 'U';
                const avatarColors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-emerald-500'];
                const avatarColor = avatarColors[idx % avatarColors.length];

                return (
                  <div key={idx} className={`py-4 flex justify-between items-center ${idx !== topCandidates.length - 1 ? 'border-b border-[#1e293b]' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg ${avatarColor} flex items-center justify-center text-sm font-bold text-white shadow-inner`}>
                        {initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-0.5">{app.userId?.name}</h4>
                        <p className="text-xs text-slate-500">{app.matchPercentage}% match - {app.jobId?.title?.split(' ')[0]} {app.jobId?.title?.split(' ')[1]}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-900/30 px-2 py-1 rounded-lg border border-blue-900/50">
                        {app.matchPercentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
              {topCandidates.length === 0 && (
                <div className="py-8 text-center text-slate-500 text-sm">
                  No candidates found yet.
                </div>
              )}
            </div>
=======
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
>>>>>>> origin/main
          </div>

        </div>
      </div>
    </div>
  );
}
