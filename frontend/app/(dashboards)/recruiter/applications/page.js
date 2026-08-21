'use client';

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
    try {
      setLoading(true);
      const data = await getRecruiterApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
    </div>
  );
}
