'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecruiterApplications, getShortlistedCandidates } from '@/lib/api';

export default function RecruiterDashboard() {
  const [applications, setApplications] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const interviewsScheduled = applications.filter(a => a.status === 'interview');
  const uniqueJobs = new Set(applications.map(a => a.jobId?._id)).size;

  if (loading) {
    return <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh] text-slate-400">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-white pb-10 px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-1">Recruiter • Pipeline Overview</p>
          <h1 className="text-3xl font-bold mt-1">Welcome back to SkillSync</h1>
          <p className="text-slate-300 text-sm mt-2 max-w-xl leading-relaxed">
            Manage your job postings, track applicant pipelines, and schedule interviews efficiently.
          </p>
        </div>
        <Link href="/recruiter/jobs/new" className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-lg shadow-blue-500/20 whitespace-nowrap inline-block text-center flex items-center gap-2">
          <span>+</span> Post a New Job
        </Link>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#121a2f] p-5 rounded-xl border border-[#1e293b] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Postings</h3>
            <p className="text-3xl font-bold mt-2 text-white">{uniqueJobs}</p>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">Live listings</p>
        </div>

        <div className="bg-[#121a2f] p-5 rounded-xl border border-[#1e293b] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Applicants</h3>
            <p className="text-3xl font-bold mt-2 text-blue-400">{totalApplicants}</p>
          </div>
          <p className="text-xs text-slate-500 mt-1">Awaiting review</p>
        </div>

        <div className="bg-[#121a2f] p-5 rounded-xl border border-[#1e293b] shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl"></div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest relative z-10">Interviews Scheduled</h3>
            <p className="text-3xl font-bold mt-2 text-emerald-400 relative z-10">{interviewsScheduled.length}</p>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1 relative z-10">Upcoming</p>
        </div>

        <div className="bg-[#121a2f] p-5 rounded-xl border border-[#1e293b] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saved Candidates</h3>
            <p className="text-3xl font-bold mt-2 text-amber-400">{shortlisted.length}</p>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">Talent pool (Feature 13)</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Quick Actions & Interviews */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-[#121a2f] p-6 rounded-xl border border-[#1e293b] shadow-sm">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/recruiter/applications" className="block bg-[#0b1120] p-4 rounded-xl border border-[#1e293b] hover:border-blue-500 transition-colors group">
                <h3 className="font-bold text-sm text-white group-hover:text-blue-400">Review Applications</h3>
                <p className="text-xs text-slate-400 mt-1">Screen candidates & AI match scores.</p>
              </Link>
              <Link href="/recruiter/shortlist" className="block bg-[#0b1120] p-4 rounded-xl border border-[#1e293b] hover:border-amber-500 transition-colors group">
                <h3 className="font-bold text-sm text-white group-hover:text-amber-400">Shortlisted Candidates</h3>
                <p className="text-xs text-slate-400 mt-1">Access your saved talent pool.</p>
              </Link>
              <Link href="/recruiter/jobs/new" className="block bg-[#0b1120] p-4 rounded-xl border border-[#1e293b] hover:border-emerald-500 transition-colors group">
                <h3 className="font-bold text-sm text-white group-hover:text-emerald-400">Post a Job</h3>
                <p className="text-xs text-slate-400 mt-1">Create a new opportunity.</p>
              </Link>
            </div>
          </div>

          {/* Feature 14: Upcoming Interviews */}
          <div className="bg-[#121a2f] p-6 rounded-xl border border-[#1e293b] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Upcoming Interviews</h2>
              <span className="text-[10px] font-bold text-slate-400 bg-[#1e293b] px-2 py-1 rounded border border-[#334155]">{interviewsScheduled.length} scheduled</span>
            </div>
            
            {interviewsScheduled.length > 0 ? (
              <div className="space-y-3">
                {interviewsScheduled.slice(0, 3).map((app, idx) => (
                  <div key={idx} className="bg-[#0b1120] p-3 rounded-xl border border-[#1e293b]">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold">{app.userId?.name}</h4>
                        <p className="text-xs text-slate-400">{app.jobId?.title}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full block mb-1">
                          {app.interviewDetails?.date || 'TBD'}
                        </span>
                        <span className="text-[10px] text-slate-500 block">{app.interviewDetails?.time || 'TBD'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center border border-dashed border-[#1e293b] rounded-lg bg-[#0b1120]">
                <p className="text-slate-400 text-sm">No interviews scheduled.</p>
                <p className="text-slate-500 text-xs mt-1">Review applications to schedule.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Applicants */}
        <div className="lg:col-span-2 bg-[#121a2f] p-6 rounded-xl border border-[#1e293b] shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Recent Applicants</h2>
            <Link href="/recruiter/applications" className="text-sm text-blue-400 hover:underline">View All</Link>
          </div>
          
          <div className="flex-1">
            {applications.length > 0 ? (
              <div className="space-y-3">
                {applications.slice(0, 8).map((app, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-[#0b1120] rounded-xl border border-[#1e293b] hover:border-slate-600 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center border border-[#334155] text-blue-400 font-bold uppercase">
                        {app.userId?.name?.[0] || 'U'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{app.userId?.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Applied for: <span className="text-slate-300">{app.jobId?.title}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded border border-emerald-900">
                        {app.matchPercentage}% Match
                      </span>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider
                        ${app.status === 'interview' ? 'bg-blue-900/40 text-blue-400' : 
                          app.status === 'applied' ? 'bg-[#1e293b] text-slate-300' : 
                          'bg-amber-900/30 text-amber-500'}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-10">
                <span className="text-4xl mb-3">📭</span>
                <p>No recent applications.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
