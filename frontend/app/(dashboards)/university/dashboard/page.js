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
    return <div className="min-h-screen bg-[#0f111a] p-8 flex items-center justify-center text-slate-500">Loading university analytics...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f111a] p-8 flex items-center justify-center">
        <div className="bg-[#161b22] border border-red-500/20 p-8 rounded-xl text-center shadow-lg">
          <h2 className="text-xl font-bold text-red-500 mb-3">Connection Lost</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f111a] text-white p-8">
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 tracking-widest uppercase mb-3">
              <span>UNIVERSITY</span>
              <span className="text-slate-600">•</span>
              <span>ANALYTICS</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{data.university}</h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Real-time employability insights and AI-driven student metrics.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">Last Synced</p>
            <p className="text-sm font-bold text-blue-400">Just now</p>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#161b22] border border-[#1e293b] p-6 rounded-xl shadow-lg flex flex-col justify-between">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Total Enrolled</h3>
            <div className="flex items-end gap-3">
              <p className="text-4xl font-bold text-white">{data.totalStudents}</p>
              <span className="text-emerald-500 text-sm font-bold mb-1">↑ 12%</span>
            </div>
          </div>
          
          <div className="bg-[#161b22] border border-[#1e293b] p-6 rounded-xl shadow-lg flex flex-col justify-between">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Avg. Employability</h3>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-cyan-500">{data.avgEmployability}</p>
              <span className="text-slate-500 font-bold mb-1 text-lg">/ 100</span>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#1e293b] p-6 rounded-xl shadow-lg flex flex-col justify-between">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Global Ranking</h3>
            <div>
              <p className="text-4xl font-bold text-white mb-1">#12</p>
              <p className="text-slate-500 text-xs">Top 5% nationally</p>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Department Breakdown */}
          <div className="bg-[#161b22] border border-[#1e293b] p-8 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6">Department Distribution</h2>
            
            {data.departmentBreakdown?.length > 0 ? (
              <div className="space-y-6">
                {data.departmentBreakdown.map((dept, idx) => {
                  const percentage = Math.round((dept.count / data.totalStudents) * 100);
                  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-amber-500'];
                  const barColor = colors[idx % colors.length];
                  
                  return (
                    <div key={idx} className="group">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-slate-300">{dept.name}</span>
                        <div className="text-right">
                          <span className="text-sm font-bold text-white">{percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-[#0f111a] border border-[#1e293b] rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full ${barColor} rounded-full`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 text-right">{dept.count} Students</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 italic text-sm">No department data available.</p>
            )}
          </div>

          {/* Trending Skills Matrix */}
          <div className="bg-[#161b22] border border-[#1e293b] p-8 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6">Trending Skill Matrix</h2>
            
            {data.topSkills?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.topSkills.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-4 bg-[#0f111a] rounded-lg border border-[#1e293b] hover:bg-[#1e293b]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#1e293b] text-slate-400 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-bold text-slate-300 capitalize">{item.skill}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm font-bold text-blue-400">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic text-sm">Not enough skill data collected yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
