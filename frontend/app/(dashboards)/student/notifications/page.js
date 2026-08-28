'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);
  const router = useRouter();

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token') || '';
  };

  const fetchNotifications = async () => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    const token = getToken();
    if (!token) return;
    setMarkingRead(true);
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    } finally {
      setMarkingRead(false);
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'job_match':
        return {
          bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )
        };
      case 'interview':
        return {
          bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )
        };
      case 'score_update':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          )
        };
      case 'roadmap':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          )
        };
      case 'industry_trend':
      default:
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )
        };
    }
  };

  const handleNotificationClick = (notif) => {
    if (notif.link) {
      router.push(notif.link);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full text-white pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <p className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-1">Notifications</p>
          <h1 className="text-3xl font-bold mt-1">Notifications</h1>
          <p className="text-slate-400 text-sm mt-2">Job matches, interview invites and platform updates.</p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={notifications.length === 0 || markingRead}
          className="bg-[#121a2f] hover:bg-[#1e293b] px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm border border-[#334155] whitespace-nowrap text-slate-200 disabled:opacity-50"
        >
          {markingRead ? 'Updating...' : 'Mark all read'}
        </button>
      </div>

      {/* Notifications Card List Container */}
      <div className="bg-[#121a2f] rounded-2xl border border-[#1e293b] shadow-sm overflow-hidden flex flex-col min-h-[300px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 p-12">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading notifications...</span>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-[#0b1120] rounded-2xl flex items-center justify-center mb-4 border border-[#1e293b]">
              <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">You're all caught up!</h3>
            <p className="text-slate-400 text-sm max-w-sm">When you get job matches, interview invites, or platform updates, they'll show up here.</p>
          </div>
        ) : (
          notifications.map((notif, idx) => {
            const visual = getNotificationIcon(notif.type);
            const isLast = idx === notifications.length - 1;

            return (
              <div
                key={notif._id || idx}
                onClick={() => handleNotificationClick(notif)}
                className={`flex items-start md:items-center justify-between gap-4 p-5 ${
                  !isLast ? 'border-b border-[#1e293b]/60' : ''
                } hover:bg-[#1e293b]/30 transition-colors cursor-pointer group`}
              >
                <div className="flex items-start md:items-center gap-4 flex-1 min-w-0">
                  {/* Category Icon Badge */}
                  <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center border ${visual.bg} shadow-sm group-hover:scale-105 transition-transform`}>
                    {visual.icon}
                  </div>

                  {/* Title & Body Content */}
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-sm font-bold text-white truncate">
                      {notif.title}
                    </h4>
                    <p className="text-sm text-slate-400 mt-0.5 leading-relaxed">
                      {notif.body}
                    </p>
                  </div>
                </div>

                {/* Relative Timestamp */}
                <div className="text-xs text-slate-500 shrink-0 font-medium whitespace-nowrap self-start md:self-center mt-1 md:mt-0">
                  {formatTimeAgo(notif.createdAt)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}