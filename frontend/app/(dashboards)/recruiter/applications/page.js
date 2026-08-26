'use client';

import { useEffect, useState } from 'react';
import { getRecruiterApplications, scheduleInterview, toggleShortlist, getShortlistedCandidates } from '@/lib/api';

export default function RecruiterApplicationsDashboard() {
  const [applications, setApplications] = useState([]);
  const [shortlistedIds, setShortlistedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Interview Modal State
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  
  // Form State
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [platform, setPlatform] = useState('Zoom');
  const [linkOrLocation, setLinkOrLocation] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsData, shortlistData] = await Promise.all([
        getRecruiterApplications(),
        getShortlistedCandidates().catch(() => [])
      ]);
      setApplications(appsData);
      setShortlistedIds(new Set(shortlistData.map(c => c._id)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShortlist = async (candidateId) => {
    try {
      const res = await toggleShortlist(candidateId);
      setShortlistedIds(prev => {
        const newSet = new Set(prev);
        if (res.isShortlisted) newSet.add(candidateId);
        else newSet.delete(candidateId);
        return newSet;
      });
    } catch (err) {
      alert("Error toggling shortlist: " + err.message);
    }
  };

  const openInterviewModal = (app) => {
    setSelectedApp(app);
    setShowInterviewModal(true);
  };

  const closeInterviewModal = () => {
    setShowInterviewModal(false);
    setSelectedApp(null);
    setDate('');
    setTime('');
    setPlatform('Zoom');
    setLinkOrLocation('');
    setMessage('');
  };

  const openProfileModal = (app) => {
    setSelectedProfile(app.userId);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setSelectedProfile(null);
  };

  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time || !linkOrLocation) return alert("Please fill all required fields.");
    
    setIsSubmitting(true);
    try {
      await scheduleInterview(selectedApp._id, { date, time, platform, linkOrLocation, message });
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
            <p className="text-slate-500">Review candidates, download resumes, and schedule interviews.</p>
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
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {app.userId?.name || 'Unknown'}
                          {shortlistedIds.has(app.userId?._id) && (
                            <span title="Shortlisted" className="text-amber-500 text-sm">⭐</span>
                          )}
                        </div>
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
                      <td className="px-6 py-5 text-right space-x-2">
                        <button
                          onClick={() => openProfileModal(app)}
                          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm"
                        >
                          Review Profile
                        </button>
                        
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

      {/* PROFILE REVIEW MODAL (FEATURE 13) */}
      {showProfileModal && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Candidate Profile</h2>
              <button onClick={closeProfileModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold uppercase">
                  {selectedProfile.name?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedProfile.name}</h3>
                  <p className="text-slate-500">{selectedProfile.email}</p>
                  <p className="text-sm font-medium text-blue-500 mt-1">{selectedProfile.targetRole || 'Software Engineer'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">University</p>
                  <p className="text-slate-900 dark:text-slate-300 font-medium">{selectedProfile.university || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Employability Score</p>
                  <div className="inline-flex items-center px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    {selectedProfile.employabilityScore || 0}%
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Portfolio Links</p>
                <div className="flex gap-3">
                  {selectedProfile.githubUrl ? (
                    <a href={selectedProfile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 rounded-lg text-center text-sm font-medium transition-colors">
                      GitHub ↗
                    </a>
                  ) : (
                     <span className="flex-1 bg-slate-50 dark:bg-slate-900/50 text-slate-400 py-2 rounded-lg text-center text-sm">No GitHub</span>
                  )}
                  {selectedProfile.linkedinUrl ? (
                    <a href={selectedProfile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 rounded-lg text-center text-sm font-medium transition-colors">
                      LinkedIn ↗
                    </a>
                  ) : (
                     <span className="flex-1 bg-slate-50 dark:bg-slate-900/50 text-slate-400 py-2 rounded-lg text-center text-sm">No LinkedIn</span>
                  )}
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800">
                <a 
                  href={selectedProfile.resumeUrl || '#'}
                  target={selectedProfile.resumeUrl ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-xl font-medium text-center transition-all flex items-center justify-center gap-2 ${
                    selectedProfile.resumeUrl 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                  onClick={(e) => { if(!selectedProfile.resumeUrl) { e.preventDefault(); alert("Candidate has not uploaded a resume."); } }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download Resume
                </a>
                
                <button 
                  onClick={() => handleToggleShortlist(selectedProfile._id)}
                  className={`w-full py-3 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 border ${
                    shortlistedIds.has(selectedProfile._id)
                      ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {shortlistedIds.has(selectedProfile._id) ? (
                    <>⭐ Shortlisted (Click to Remove)</>
                  ) : (
                    <>☆ Shortlist Candidate</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERVIEW SCHEDULING MODAL */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Schedule Interview</h2>
              <button onClick={closeInterviewModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleInterviewSubmit} className="p-6 space-y-4">
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
    </div>
  );
}
