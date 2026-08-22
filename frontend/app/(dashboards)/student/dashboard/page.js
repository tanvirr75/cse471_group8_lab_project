'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyApplications } from '@/lib/api';

export default function StudentDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalApps = applications.length;
  const interviews = applications.filter(app => app.status === 'interview');
  const upcomingInterviewCount = interviews.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] p-8 text-slate-800 dark:text-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Student Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back! Here's your career readiness overview.</p>
          </div>
          <Link href="/jobs" className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md">
            Find New Jobs
          </Link>
        </div>

        {/* Feature 14 Integration: Upcoming Interviews Highlight */}
        {!loading && upcomingInterviewCount > 0 && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <span className="text-3xl">📅</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">You have {upcomingInterviewCount} upcoming interview{upcomingInterviewCount > 1 ? 's' : ''}!</h2>
                <p className="text-emerald-50 font-medium">Recruiters are waiting to speak with you.</p>
              </div>
            </div>
            <Link href="/applications" className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold shadow hover:scale-105 transition-transform whitespace-nowrap">
              View Details →
            </Link>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Active Applications</h3>
            <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">{loading ? '-' : totalApps}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Upcoming Interviews</h3>
            <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{loading ? '-' : upcomingInterviewCount}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">Employability Score</h3>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white">88</p>
              <span className="text-slate-400 font-bold">/ 100</span>
            </div>
          </div>
        </div>

        {/* Navigation Action Cards */}
        <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link href="/applications" className="group bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all block">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              📂
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">My Applications</h2>
            <p className="text-slate-500 text-sm">Track your application statuses, review match scores, and check interview schedules.</p>
          </Link>

          <Link href="/jobs" className="group bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all block">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🎯
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">Job Matches</h2>
            <p className="text-slate-500 text-sm">Explore smart job recommendations tailored exactly to your skills and department.</p>
          </Link>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center text-2xl mb-4">
              💼
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">My Portfolio (Soon)</h2>
            <p className="text-slate-500 text-sm">Manage your projects, GitHub repositories, and professional certifications.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
