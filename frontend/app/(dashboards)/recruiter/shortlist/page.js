'use client';

import { useEffect, useState } from 'react';
import { getShortlistedCandidates, toggleShortlist } from '@/lib/api';

export default function ShortlistDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShortlist();
  }, []);

  const fetchShortlist = async () => {
    try {
      setLoading(true);
      const data = await getShortlistedCandidates();
      setCandidates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveShortlist = async (candidateId) => {
    try {
      await toggleShortlist(candidateId);
      // Remove from UI instantly
      setCandidates(prev => prev.filter(c => c._id !== candidateId));
    } catch (err) {
      alert("Error removing from shortlist: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-center">
        <div className="animate-pulse text-slate-500 font-medium">Loading your shortlisted candidates...</div>
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
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Shortlisted Candidates</h1>
            <p className="text-slate-500">Your saved talent pool for current and future recruitment campaigns.</p>
          </div>
        </div>

        {candidates.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No candidates shortlisted yet.</h3>
            <p className="text-slate-500 mt-2">Go to Application Management and click ⭐ Shortlist to build your talent pool.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map(candidate => (
              <div key={candidate._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="p-6 pb-4 flex flex-col items-center border-b border-slate-100 dark:border-slate-800/50">
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl font-bold uppercase mb-3 shadow-inner">
                    {candidate.name?.[0] || 'U'}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center">{candidate.name}</h3>
                  <p className="text-slate-500 text-sm text-center">{candidate.email}</p>
                  <p className="text-blue-500 font-medium text-sm text-center mt-1 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                    {candidate.targetRole || 'Software Engineer'}
                  </p>
                </div>
                
                <div className="p-6 py-4 flex-grow space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-400 uppercase text-[10px] font-bold tracking-wider mb-0.5">University</p>
                      <p className="text-slate-700 dark:text-slate-300 font-medium truncate" title={candidate.university}>{candidate.university || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 uppercase text-[10px] font-bold tracking-wider mb-0.5">Dept</p>
                      <p className="text-slate-700 dark:text-slate-300 font-medium truncate" title={candidate.department}>{candidate.department || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-400 uppercase text-[10px] font-bold tracking-wider mb-1.5">Employability Score</p>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${candidate.employabilityScore || 0}%` }}></div>
                    </div>
                    <p className="text-right text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">{candidate.employabilityScore || 0}/100</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800">
                  <a 
                    href={candidate.resumeUrl || '#'}
                    target={candidate.resumeUrl ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`py-2 text-sm rounded-lg font-medium text-center transition-colors flex items-center justify-center gap-1.5 ${
                      candidate.resumeUrl ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => { if(!candidate.resumeUrl) { e.preventDefault(); alert("No resume uploaded"); } }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Resume
                  </a>
                  <button 
                    onClick={() => handleRemoveShortlist(candidate._id)}
                    className="py-2 text-sm rounded-lg font-bold text-center transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-900/50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
