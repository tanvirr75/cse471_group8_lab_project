'use client';

import { useState, useEffect } from 'react';
import { getTechNews, getJobs } from '@/lib/api';

export default function CareerHubPage() {
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'trends'
  const [jobs, setJobs] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCareerData();
  }, []);

  const fetchCareerData = async () => {
    try {
      setLoading(true);
      // Fetch both internal jobs and external news/jobs
      const [newsResponse, internalJobsResponse] = await Promise.all([
        getTechNews().catch(() => ({ jobs: [], trends: [] })),
        getJobs().catch(() => [])
      ]);

      const internalJobs = (Array.isArray(internalJobsResponse) ? internalJobsResponse : (internalJobsResponse.jobs || [])).map(job => ({
        title: job.title,
        description: job.description || 'No description provided.',
        publishedAt: job.createdAt,
        url: `/jobs/${job._id}`,
        source: job.company || 'Internal Posting',
        imageUrl: null // Or a default image
      }));

      const externalJobs = newsResponse.jobs || [];
      const combinedJobs = [...internalJobs, ...externalJobs];

      setJobs(combinedJobs);
      setTrends(newsResponse.trends || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching career data:', err);
      setError('Failed to load career data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-white pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-1">Career Hub</p>
          <h1 className="text-3xl font-bold mt-1">Live IT Jobs & Industry Trends</h1>
          <p className="text-slate-300 text-sm mt-2 max-w-xl leading-relaxed">
            Real, daily-updated software engineering jobs for Bangladesh candidates and the latest tech industry news.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-700/50 pb-2">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 text-sm font-semibold transition-colors relative ${
            activeTab === 'jobs' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Job Postings
          {activeTab === 'jobs' && (
            <span className="absolute bottom-[-9px] left-0 w-full h-[2px] bg-blue-500 rounded-t-md"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`px-4 py-2 text-sm font-semibold transition-colors relative ${
            activeTab === 'trends' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Industry Trends
          {activeTab === 'trends' && (
            <span className="absolute bottom-[-9px] left-0 w-full h-[2px] bg-blue-500 rounded-t-md"></span>
          )}
        </button>
      </div>

      {/* Content State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-slate-800/30 rounded-xl h-72 animate-pulse border border-slate-700/50"></div>
          ))}
        </div>
      ) : !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'jobs' ? jobs : trends).map((item, index) => (
            <div 
              key={index}
              className="bg-slate-800/30 backdrop-blur-md rounded-xl overflow-hidden border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group flex flex-col"
            >
              <div className="h-48 overflow-hidden relative bg-slate-900/50">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80'; }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-500">
                    <svg className="w-12 h-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <span className="text-sm font-medium">{activeTab === 'jobs' ? 'Job Listing' : 'News Article'}</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10 shadow-sm">
                  {item.source}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="font-bold text-lg leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>
                
                <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
                
                <div className="mt-auto pt-4 border-t border-slate-700/50 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {formatDate(item.publishedAt)}
                    </span>
                  </div>
                  
                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center w-full bg-[#1e293b] hover:bg-blue-600 border border-[#334155] hover:border-blue-500 text-sm font-medium py-2.5 rounded-lg transition-colors"
                  >
                    {activeTab === 'jobs' ? 'Apply Now ↗' : 'Read full article ↗'}
                  </a>
                </div>
              </div>
            </div>
          ))}
          
          {(activeTab === 'jobs' ? jobs : trends).length === 0 && !loading && (
            <div className="col-span-full py-12 text-center bg-slate-800/20 rounded-xl border border-slate-700/50 border-dashed">
              <svg className="w-12 h-12 mx-auto text-slate-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-slate-300">No {activeTab === 'jobs' ? 'jobs' : 'trends'} found</h3>
              <p className="text-slate-500 text-sm mt-1">Check back later for updates.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
