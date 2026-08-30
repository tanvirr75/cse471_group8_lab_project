'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecruiterApplications, getShortlistedCandidates } from '@/lib/api';
import { timeAgo } from '@/utils/timeAgo';

export default function RecruiterDashboard() {
  const [applications, setApplications] = useState([]);
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
  const closingSoonCount = activeJobs.filter(j => j.status === 'closing_soon').length; // Simulated closing soon logic if missing field

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

          </div>
        </div>
      </div>
    </div>
  );
}
