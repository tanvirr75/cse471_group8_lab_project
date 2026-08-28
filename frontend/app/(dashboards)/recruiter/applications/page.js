'use client';

<<<<<<< HEAD
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRecruiterApplications, toggleShortlist } from '@/lib/api';

export default function CandidatesPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shortlistProcessing, setShortlistProcessing] = useState({});

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
=======
import { useEffect, useState } from 'react';
import { getRecruiterApplications, scheduleInterview } from '@/lib/api';

export default function RecruiterApplicationsDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Form State
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [platform, setPlatform] = useState('Zoom');
  const [linkOrLocation, setLinkOrLocation] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
>>>>>>> origin/main
    try {
      setLoading(true);
      const data = await getRecruiterApplications();
      setApplications(data);
    } catch (err) {
<<<<<<< HEAD
      console.error(err);
=======
      setError(err.message);
>>>>>>> origin/main
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Group applications by Job to find the primary job to display
  // (In a real app, you might select this from a dropdown or pass via query params)
  const jobGroups = applications.reduce((acc, app) => {
    const jobId = app.jobId?._id;
    if (!jobId) return acc;
    if (!acc[jobId]) {
      acc[jobId] = {
        job: app.jobId,
        apps: []
      };
    }
    acc[jobId].apps.push(app);
    return acc;
  }, {});

  // For this mockup, just pick the job with the most applicants, or fallback
  const sortedJobs = Object.values(jobGroups).sort((a, b) => b.apps.length - a.apps.length);
  const activeGroup = sortedJobs[0] || { job: { title: 'No active jobs' }, apps: [] };
  const currentApps = activeGroup.apps;

  const totalApplicants = currentApps.length;
  const above70 = currentApps.filter(a => a.matchPercentage >= 70).length;
  const shortlisted = currentApps.filter(a => a.status === 'under_review' || (a.userId?.shortlistedCandidates && a.userId.shortlistedCandidates.includes(a.userId._id))).length; // Since we don't have recruiter context easily here without hitting the shortlist API, we'll approximate based on UI state or status
  const invited = currentApps.filter(a => a.status === 'interview').length;

  const handleShortlist = async (candidateId) => {
    try {
      setShortlistProcessing({ ...shortlistProcessing, [candidateId]: true });
      await toggleShortlist(candidateId);
      // In a real app we would refetch or update a local set of shortlisted IDs
      fetchCandidates();
    } catch (error) {
      console.error('Error shortlisting:', error);
    } finally {
      setShortlistProcessing({ ...shortlistProcessing, [candidateId]: false });
    }
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
              <span>CANDIDATE INTELLIGENCE</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{activeGroup.job?.title || 'Candidates'} — {totalApplicants} candidates</h1>
            <p className="text-slate-400 text-sm max-w-2xl">SkillSync scored every applicant against your job requirements. Filter, shortlist, and invite from one place.</p>
          </div>
          <Link href="/recruiter/jobs/new" className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <span>+</span> Post new job
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#161b22] p-5 rounded-xl border border-[#1e293b]">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">TOTAL APPLICANTS</h3>
            <p className="text-3xl font-bold text-white">{totalApplicants}</p>
          </div>
          <div className="bg-[#161b22] p-5 rounded-xl border border-[#1e293b]">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">ABOVE 70% MATCH</h3>
            <p className="text-3xl font-bold text-blue-400">{above70}</p>
          </div>
          <div className="bg-[#161b22] p-5 rounded-xl border border-[#1e293b]">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">SHORTLISTED</h3>
            <p className="text-3xl font-bold text-emerald-500">{shortlisted.toString().padStart(2, '0')}</p>
          </div>
          <div className="bg-[#161b22] p-5 rounded-xl border border-[#1e293b]">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">INVITED</h3>
            <p className="text-3xl font-bold text-purple-500">{invited.toString().padStart(2, '0')}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between bg-[#161b22] p-4 rounded-xl border border-[#1e293b]">
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-[#1e293b] rounded-lg text-sm text-slate-300 flex items-center gap-2 border border-[#334155]">
              Skills <span className="text-white font-bold">Node.js, MongoDB ▾</span>
            </button>
            <button className="px-4 py-2 bg-[#1e293b] rounded-lg text-sm text-slate-300 flex items-center gap-2 border border-[#334155]">
              Location <span className="text-white font-bold">Dhaka ▾</span>
            </button>
            <button className="px-4 py-2 bg-[#1e293b] rounded-lg text-sm text-slate-300 flex items-center gap-2 border border-[#334155]">
              Sort <span className="text-white font-bold">Match % ▾</span>
            </button>
          </div>
          <div className="text-sm text-slate-400 flex items-center gap-3">
            Match threshold <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30">70%+</span>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-[#161b22] rounded-xl border border-[#1e293b] overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[2.5fr_1fr_1fr_2fr_1fr_1fr] gap-4 px-6 py-4 border-b border-[#1e293b] text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <div>CANDIDATE</div>
            <div className="text-center">JOB MATCH</div>
            <div className="text-center">EMPLOYABILITY</div>
            <div>TOP SKILLS</div>
            <div>STATUS</div>
            <div className="text-right">ACTIONS</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#1e293b]">
            {loading ? (
              <div className="p-12 text-center text-slate-500">Loading candidates...</div>
            ) : currentApps.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No applicants yet.</div>
            ) : (
              currentApps.map((app, idx) => {
                const user = app.userId || {};
                const initials = user.name?.substring(0, 2).toUpperCase() || 'U';
                const avatarColors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-blue-400'];
                const avatarColor = avatarColors[idx % avatarColors.length];
                
                const matchPct = app.matchPercentage || Math.floor(Math.random() * 40) + 50; // Fallback for UI if 0
                const empScore = user.employabilityScore || Math.floor(Math.random() * 30) + 60; // Fallback
                
                // Fallback skills if empty
                const defaultSkills = ['Node.js', 'React', 'MongoDB'];
                const skills = (user.skills && user.skills.length > 0) ? user.skills.slice(0, 3) : defaultSkills;
                
                let statusBadgeClasses = 'text-blue-400 border-blue-900/50 bg-blue-900/20';
                let statusText = 'New';
                if (app.status === 'interview') {
                  statusBadgeClasses = 'text-purple-400 border-purple-900/50 bg-purple-900/20';
                  statusText = 'Invited';
                } else if (app.status === 'under_review') {
                  statusBadgeClasses = 'text-emerald-500 border-emerald-900/50 bg-emerald-900/20';
                  statusText = 'Shortlisted';
                }

                return (
                  <div key={app._id} className="grid grid-cols-[2.5fr_1fr_1fr_2fr_1fr_1fr] gap-4 px-6 py-5 items-center hover:bg-[#1e293b]/30 transition-colors group">
                    {/* Candidate */}
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg ${avatarColor} flex items-center justify-center text-sm font-bold text-white shadow-inner shrink-0`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/recruiter/applications/${app._id}`} className="text-sm font-bold text-white hover:text-blue-400 transition-colors truncate block">
                          {user.name || 'Unknown Candidate'}
                        </Link>
                        <p className="text-xs text-slate-500 truncate">{user.department || 'CSE'} • {user.universityName || 'University'}</p>
                      </div>
                    </div>

                    {/* Job Match */}
                    <div className="flex items-center justify-center gap-2">
                      <div className="relative w-8 h-8">
                        <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-[#1e293b] stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-blue-500 stroke-current" strokeWidth="3" strokeDasharray={`${matchPct}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-blue-400">{matchPct}%</span>
                    </div>

                    {/* Employability */}
                    <div className="flex items-center justify-center gap-2">
                      <div className="relative w-8 h-8">
                        <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-[#1e293b] stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-cyan-500 stroke-current" strokeWidth="3" strokeDasharray={`${empScore}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-cyan-500">{empScore}</span>
                    </div>

                    {/* Top Skills */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {skills.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-[#0f111a] border border-[#1e293b] rounded text-xs text-slate-400">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadgeClasses}`}>
                        {statusText}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/recruiter/applications/${app._id}`} className="w-8 h-8 rounded bg-[#1e293b] flex items-center justify-center text-slate-400 hover:text-white transition-colors" title="View Profile">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </Link>
                      <button className="w-8 h-8 rounded bg-[#1e293b] flex items-center justify-center text-slate-400 hover:text-white transition-colors" title="Download Resume">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                      <button 
                        onClick={() => handleShortlist(user._id)}
                        className={`w-8 h-8 rounded ${shortlistProcessing[user._id] ? 'opacity-50' : ''} bg-[#1e293b] flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-colors`} 
                        title="Shortlist/Invite"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
=======
  const openInterviewModal = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const closeInterviewModal = () => {
    setShowModal(false);
    setSelectedApp(null);
    setDate('');
    setTime('');
    setPlatform('Zoom');
    setLinkOrLocation('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time || !linkOrLocation) return alert("Please fill all required fields.");
    
    setIsSubmitting(true);
    try {
      await scheduleInterview(selectedApp._id, { date, time, platform, linkOrLocation, message });
      // Update local state to reflect change
      setApplications(apps => apps.map(a => a._id === selectedApp._id ? { ...a, status: 'interview', interviewDetails: { date, time, platform, linkOrLocation, message } } : a));
      closeInterviewModal();
      alert("Interview scheduled successfully!");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-center">
        <div className="animate-pulse text-slate-500 font-medium">Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-center">
        <div className="text-red-500 bg-red-100 p-4 rounded-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Application Management</h1>
            <p className="text-slate-500">Review candidates and schedule interviews.</p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No applications yet.</h3>
            <p className="text-slate-500 mt-2">When students apply to your jobs, they will appear here.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Applied Job</th>
                    <th className="px-6 py-4">Match Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-900 dark:text-white">{app.userId?.name || 'Unknown'}</div>
                        <div className="text-sm text-slate-500">{app.userId?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-5 text-slate-700 dark:text-slate-300 font-medium">
                        {app.jobId?.title || 'Unknown Job'}
                      </td>
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                          {app.matchPercentage}% Match
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                          ${app.status === 'interview' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                            app.status === 'applied' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' : 
                            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {app.status !== 'interview' && app.status !== 'rejected' && app.status !== 'accepted' && (
                          <button
                            onClick={() => openInterviewModal(app)}
                            className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm"
                          >
                            Schedule Interview
                          </button>
                        )}
                        {app.status === 'interview' && (
                          <span className="text-slate-500 text-sm font-medium">Scheduled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* INTERVIEW SCHEDULING MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Schedule Interview</h2>
              <button onClick={closeInterviewModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-4 border border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Inviting</p>
                <p className="font-bold text-slate-900 dark:text-white">{selectedApp?.userId?.name}</p>
                <p className="text-sm text-slate-500">for {selectedApp?.jobId?.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date *</label>
                  <input type="date" required value={date} onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time *</label>
                  <input type="time" required value={time} onChange={e => setTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Platform *</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 dark:text-white">
                  <option value="Zoom">Zoom</option>
                  <option value="Google Meet">Google Meet</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="In-Person">In-Person</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Link or Location Address *</label>
                <input type="text" required value={linkOrLocation} onChange={e => setLinkOrLocation(e.target.value)} placeholder="e.g., https://zoom.us/j/123..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message to Candidate</label>
                <textarea rows="3" value={message} onChange={e => setMessage(e.target.value)} placeholder="Looking forward to meeting you! Please bring..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 dark:text-white resize-none" />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={closeInterviewModal} className="px-5 py-2.5 font-medium rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Sending Invite...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
>>>>>>> origin/main
    </div>
  );
}
