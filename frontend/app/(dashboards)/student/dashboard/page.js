'use client';

import { useEffect, useState } from 'react';

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // In a real app, this would fetch from an API
  useEffect(() => {
    // Simulate fetching user dashboard data
    setTimeout(() => {
      setUserData({
        name: 'Student', // Fallback name
        stats: { jobMatches: 0, applications: 0, interviewing: 0, repos: 0, profileStrength: 0 },
        employability: 0,
        scoreFactors: [
          { label: 'Technical skills', score: 0, color: 'bg-blue-500', width: '0%' },
          { label: 'GitHub activity', score: 0, color: 'bg-blue-500', width: '0%' },
          { label: 'Project quality', score: 0, color: 'bg-blue-500', width: '0%' },
          { label: 'Resume quality', score: 0, color: 'bg-blue-500', width: '0%' },
          { label: 'Certifications', score: 0, color: 'bg-amber-500', width: '0%' },
          { label: 'Career readiness', score: 0, color: 'bg-blue-500', width: '0%' },
        ],
        recommendation: null,
        activeApplications: []
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh] text-slate-400">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-white pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-1">Student • Career Overview</p>
          <h1 className="text-3xl font-bold mt-1">Good evening, {userData?.name}</h1>
          <p className="text-slate-300 text-sm mt-2 max-w-xl leading-relaxed">
            Welcome to your career dashboard. Complete onboarding to see personalized insights.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-lg shadow-blue-500/20 whitespace-nowrap">
          + Run new analysis
        </button>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#121a2f] p-5 rounded-xl border border-[#1e293b] shadow-sm">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Job Matches ≥80%</h3>
          <p className="text-3xl font-bold mt-2">{userData?.stats.jobMatches}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Updates weekly</p>
        </div>
        <div className="bg-[#121a2f] p-5 rounded-xl border border-[#1e293b] shadow-sm">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Applications</h3>
          <p className="text-3xl font-bold mt-2">{userData?.stats.applications}</p>
          <p className="text-xs text-slate-500 mt-1">{userData?.stats.interviewing} interviewing</p>
        </div>
        <div className="bg-[#121a2f] p-5 rounded-xl border border-[#1e293b] shadow-sm">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">GitHub Repos</h3>
          <p className="text-3xl font-bold mt-2">{userData?.stats.repos}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Connect to track</p>
        </div>
        <div className="bg-[#121a2f] p-5 rounded-xl border border-[#1e293b] shadow-sm">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Profile Strength</h3>
          <p className="text-3xl font-bold mt-2">{userData?.stats.profileStrength}<span className="text-lg text-slate-400 font-normal">%</span></p>
          <p className="text-xs text-slate-500 font-medium mt-1">Incomplete</p>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Employability Score */}
        <div className="md:col-span-2 bg-[#121a2f] p-6 rounded-xl border border-[#1e293b] shadow-sm flex flex-col items-center justify-center">
          <div className="relative w-40 h-40">
            <div className="w-40 h-40 rounded-full bg-[#0b1120] flex items-center justify-center border-[12px] border-slate-700 shadow-inner">
              <div className="text-center mt-2">
                <div className="text-5xl font-black text-white leading-none">{userData?.employability}</div>
                <div className="text-[9px] font-bold text-slate-500 tracking-widest mt-1">EMPLOYABILITY</div>
              </div>
            </div>
          </div>
          <p className="text-slate-500 text-sm font-bold mt-6">No data yet</p>
          <p className="text-slate-500 text-xs mt-1">Upload resume to calculate</p>
        </div>

        {/* What builds your score */}
        <div className="md:col-span-3 bg-[#121a2f] p-6 rounded-xl border border-[#1e293b] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">What builds your score</h2>
            <span className="text-xs text-slate-500">6 weighted factors</span>
          </div>
          <div className="space-y-4">
            {userData?.scoreFactors.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="w-32 text-sm text-slate-400 shrink-0">{item.label}</span>
                <div className="flex-1 h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }}></div>
                </div>
                <span className="w-6 text-right text-sm font-bold text-slate-500">{item.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI Career Recommendation */}
        <div className="bg-[#121a2f] p-6 rounded-xl border border-[#1e293b] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs">✨</div>
                <h3 className="font-bold">AI Career Recommendation</h3>
              </div>
              <span className="text-[10px] font-bold text-blue-300 bg-blue-900/30 px-2 py-1 rounded border border-blue-800">Gemini</span>
            </div>
            {userData?.recommendation ? (
              <p className="text-sm text-slate-300 leading-relaxed">{userData.recommendation.text}</p>
            ) : (
              <div className="py-4 text-center border border-dashed border-[#1e293b] rounded-lg bg-[#0b1120]">
                <p className="text-slate-400 text-sm">Not enough data for AI recommendations.</p>
                <p className="text-slate-500 text-xs mt-1">Connect GitHub and upload resume.</p>
              </div>
            )}
          </div>
          {userData?.recommendation && (
            <div className="flex gap-8 mt-6">
              {userData.recommendation.roles.map((role, idx) => (
                <div key={idx}>
                  <p className={`text-2xl font-bold ${idx === 0 ? 'text-blue-400' : 'text-slate-300'}`}>{role.percentage}%</p>
                  <p className="text-xs text-slate-400 mt-1">{role.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Applications */}
        <div className="bg-[#121a2f] p-6 rounded-xl border border-[#1e293b] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Active applications</h3>
            <span className="text-[10px] font-bold text-slate-400 bg-[#1e293b] px-2 py-1 rounded border border-[#334155]">{userData?.activeApplications.length} open</span>
          </div>
          <div className="space-y-3">
            {userData?.activeApplications.length > 0 ? (
              userData.activeApplications.map((app, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-[#0b1120] rounded-xl border border-[#1e293b]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center border border-[#334155]">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{app.role} <span className="text-slate-500 mx-1">•</span> <span className="font-normal text-slate-300">{app.company}</span></h4>
                      <p className="text-xs text-slate-500 mt-0.5">{app.time}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${app.statusColor}`}>
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center">
                <p className="text-slate-400 text-sm">You haven't applied to any jobs yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
