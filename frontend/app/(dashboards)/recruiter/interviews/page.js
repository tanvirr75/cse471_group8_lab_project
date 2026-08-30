'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRecruiterApplications } from '@/lib/api';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  async function fetchInterviews() {
    try {
      setLoading(true);
      const apps = await getRecruiterApplications();
      // Filter applications that are in 'interview' status
      const interviewApps = apps.filter(app => app.status === 'interview');
      setInterviews(interviewApps);
    } catch (err) {
      console.error('Failed to load interviews', err);
    } finally {
      setLoading(false);
    }
  };

  // Metrics calculation
  const totalSent = interviews.length;
  const accepted = interviews.filter(i => i.interviewDetails?.interviewStatus === 'accepted').length;
  const pending = interviews.filter(i => !i.interviewDetails?.interviewStatus || i.interviewDetails?.interviewStatus === 'pending').length;
  const declined = interviews.filter(i => i.interviewDetails?.interviewStatus === 'declined').length;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // fallback
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-white">
      <div className="max-w-[1200px] mx-auto p-8 space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 tracking-widest uppercase mb-3">
              <span>RECRUITER</span>
              <span className="text-slate-600">•</span>
              <span>COMMUNICATION</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Interview invitations</h1>
            <p className="text-slate-400 text-sm">Manage interview scheduling and recruitment communication.</p>
          </div>
          <Link href="/recruiter/applications" className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <span>+</span> New invitation
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#161b22] p-5 rounded-xl border border-[#1e293b]">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">SENT</h3>
            <p className="text-3xl font-bold text-white">{totalSent.toString().padStart(2, '0')}</p>
          </div>
          <div className="bg-[#161b22] p-5 rounded-xl border border-[#1e293b]">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">ACCEPTED</h3>
            <p className="text-3xl font-bold text-emerald-500">{accepted.toString().padStart(2, '0')}</p>
          </div>
          <div className="bg-[#161b22] p-5 rounded-xl border border-[#1e293b]">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">PENDING</h3>
            <p className="text-3xl font-bold text-amber-500">{pending.toString().padStart(2, '0')}</p>
          </div>
          <div className="bg-[#161b22] p-5 rounded-xl border border-[#1e293b]">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">DECLINED</h3>
            <p className="text-3xl font-bold text-slate-500">{declined.toString().padStart(2, '0')}</p>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-[#161b22] rounded-xl border border-[#1e293b] overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_2fr_2fr_1fr_1fr] gap-4 px-6 py-4 border-b border-[#1e293b] text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <div>CANDIDATE</div>
            <div>POSITION</div>
            <div>DATE & TIME</div>
            <div>TYPE</div>
            <div>STATUS</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#1e293b]">
            {loading ? (
              <div className="p-12 text-center text-slate-500">Loading invitations...</div>
            ) : interviews.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p className="mb-4">No invitations sent yet.</p>
                <Link href="/recruiter/applications" className="text-blue-500 hover:underline font-medium">Browse candidates to invite</Link>
              </div>
            ) : (
              interviews.map((app, idx) => {
                const initials = app.userId?.name?.substring(0, 2).toUpperCase() || 'U';
                const avatarColors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-emerald-500'];
                const avatarColor = avatarColors[idx % avatarColors.length];
                
                const status = app.interviewDetails?.interviewStatus || 'pending';
                const platform = app.interviewDetails?.platform || 'Video call';
                
                let statusBadgeClasses = '';
                let statusText = '';
                if (status === 'accepted') {
                  statusBadgeClasses = 'text-emerald-500 border-emerald-900/50 bg-emerald-900/20';
                  statusText = 'Accepted';
                } else if (status === 'declined') {
                  statusBadgeClasses = 'text-slate-400 border-slate-700 bg-slate-800';
                  statusText = 'Declined';
                } else {
                  statusBadgeClasses = 'text-amber-500 border-amber-900/50 bg-amber-900/20';
                  statusText = 'Pending';
                }

                return (
                  <div key={app._id} className="grid grid-cols-[2fr_2fr_2fr_1fr_1fr] gap-4 px-6 py-5 items-center hover:bg-[#1e293b]/30 transition-colors">
                    {/* Candidate */}
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg ${avatarColor} flex items-center justify-center text-sm font-bold text-white shadow-inner shrink-0`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white mb-0.5 truncate">{app.userId?.name || 'Unknown Candidate'}</h4>
                        <p className="text-xs text-slate-500 truncate">{app.matchPercentage || 0}% match</p>
                      </div>
                    </div>

                    {/* Position */}
                    <div className="text-sm text-slate-300 truncate">
                      {app.jobId?.title || 'Unknown Position'}
                    </div>

                    {/* Date & Time */}
                    <div className="text-sm text-slate-300 truncate">
                      {formatDate(app.interviewDetails?.date)}, {app.interviewDetails?.time || 'TBD'}
                    </div>

                    {/* Type */}
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#1e293b] text-slate-300 border border-[#334155] truncate max-w-full">
                        {platform}
                      </span>
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadgeClasses}`}>
                        {statusText}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
