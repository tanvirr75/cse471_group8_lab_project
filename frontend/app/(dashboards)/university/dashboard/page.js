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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
          <p className="text-slate-500 font-medium tracking-wide">Crunching Analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
        <div className="max-w-2xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-xl text-center">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Access Denied</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Segment */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="text-sm font-bold tracking-widest text-primary uppercase mb-1 block">Live Overview</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              {data.university} Analytics
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Real-time employability metrics for your students
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wide">Registered Students</h3>
            <p className="text-5xl font-black text-slate-800 dark:text-slate-100">{data.totalStudents}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-colors">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wide">Avg. Employability Score</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-5xl font-black text-emerald-600 dark:text-emerald-400">{data.avgEmployability}</p>
              <span className="text-slate-400 font-bold">/ 100</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-colors">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wide">Verification Status</h3>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-2">All Accounts Synced</p>
            <p className="text-sm text-slate-500 mt-1">Pending approvals: 0</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Department Breakdown */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Student Distribution by Department</h2>
            {data.departmentBreakdown?.length > 0 ? (
              <div className="space-y-5">
                {data.departmentBreakdown.map((dept, idx) => {
                  const percentage = Math.round((dept.count / data.totalStudents) * 100);
                  return (
                    <div key={idx} className="group">
                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span className="text-slate-700 dark:text-slate-200">{dept.name}</span>
                        <span className="text-slate-500">{dept.count} Students ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-primary h-2.5 rounded-full group-hover:bg-blue-500 transition-all duration-500" 
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

          {/* Top Skills */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Trending Skills Among Students</h2>
            {data.topSkills?.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {data.topSkills.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 w-full hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        #{idx + 1}
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{item.skill}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-200 dark:bg-slate-700 px-2.5 py-1 rounded-full">
                      Found in {item.count} profiles
                    </span>
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
