'use client';

import { useEffect, useState } from 'react';
import { getUniversityAnalytics } from '@/lib/api';

export default function UniversityDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUniversityAnalytics()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-4 border-fuchsia-500 rounded-full animate-spin animation-delay-150"></div>
            <div className="absolute inset-4 border-b-4 border-cyan-500 rounded-full animate-spin animation-delay-300"></div>
          </div>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 font-bold tracking-widest uppercase text-sm animate-pulse">Initializing Analytics Engine...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto bg-red-950/40 border border-red-500/20 p-8 rounded-2xl text-center backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-red-400 mb-3">Connection Lost</h2>
          <p className="text-red-300/70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        {/* Premium Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Live Telemetry
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tight">
              {data.university}
            </h1>
            <p className="text-lg text-slate-400 font-medium max-w-xl">
              Real-time employability insights and AI-driven student metrics.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 mb-1">Last Synced</p>
            <p className="font-mono text-indigo-300">Just now</p>
          </div>
        </header>

        {/* Glassmorphic KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/[0.07] hover:border-indigo-500/30 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Total Enrolled</h3>
              <div className="flex items-end gap-3">
                <p className="text-6xl font-black text-white">{data.totalStudents}</p>
                <span className="text-emerald-400 text-sm font-bold mb-2 flex items-center gap-1">
                  ↑ 12%
                </span>
              </div>
            </div>
          </div>
          
          <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/[0.07] hover:border-emerald-500/30 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Avg. Employability</h3>
              <div className="flex items-end gap-2">
                <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  {data.avgEmployability}
                </p>
                <span className="text-slate-500 font-bold mb-2 text-xl">/ 100</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/[0.07] hover:border-fuchsia-500/30 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Global Ranking</h3>
              <p className="text-6xl font-black text-white">#12</p>
              <p className="text-slate-400 mt-2 text-sm">Top 5% nationally</p>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Department Breakdown */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-8 relative z-10">Department Distribution</h2>
            
            {data.departmentBreakdown?.length > 0 ? (
              <div className="space-y-6 relative z-10">
                {data.departmentBreakdown.map((dept, idx) => {
                  const percentage = Math.round((dept.count / data.totalStudents) * 100);
                  const colors = ['bg-indigo-500', 'bg-fuchsia-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-amber-500'];
                  const barColor = colors[idx % colors.length];
                  
                  return (
                    <div key={idx} className="group cursor-pointer">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-slate-200 font-semibold group-hover:text-white transition-colors">{dept.name}</span>
                        <div className="text-right">
                          <span className="text-white font-bold block">{percentage}%</span>
                          <span className="text-slate-500 text-xs">{dept.count} Students</span>
                        </div>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full ${barColor} rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] shadow-${barColor}/50 transition-all duration-1000 ease-out group-hover:brightness-125`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 italic">No department data available.</p>
            )}
          </div>

          {/* Trending Skills Matrix */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative">
             <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-8 relative z-10">Trending Skill Matrix</h2>
            
            {data.topSkills?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {data.topSkills.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="group flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform shadow-lg">
                        {idx + 1}
                      </div>
                      <span className="font-bold text-slate-200 capitalize tracking-wide">{item.skill}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-indigo-400 font-bold">{item.count}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Students</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">Not enough skill data collected yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
