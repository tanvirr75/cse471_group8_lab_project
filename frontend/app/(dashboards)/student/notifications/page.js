'use client';

import { useState, useEffect } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app, this would fetch from an API
  // useEffect(() => { fetchNotifications().then(setNotifications).finally(() => setLoading(false)) }, [])
  // For now, we simulate an empty response after a short delay
  useEffect(() => {
    setTimeout(() => {
      setNotifications([]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="max-w-5xl mx-auto w-full text-white pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-1">Notifications</p>
          <h1 className="text-3xl font-bold mt-1">Notifications</h1>
          <p className="text-slate-400 text-sm mt-2">Job matches, interview invites and platform updates.</p>
        </div>
        <button 
          className="bg-[#1e293b] hover:bg-[#334155] px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm border border-[#334155] whitespace-nowrap disabled:opacity-50"
          disabled={notifications.length === 0}
        >
          Mark all read
        </button>
      </div>

      <div className="bg-[#121a2f] rounded-2xl border border-[#1e293b] shadow-sm overflow-hidden flex flex-col min-h-[300px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className="w-16 h-16 bg-[#0b1120] rounded-2xl flex items-center justify-center mb-4 border border-[#1e293b]">
              <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">You're all caught up!</h3>
            <p className="text-slate-400 max-w-sm">When you get job matches, interview invites, or platform updates, they'll show up here.</p>
          </div>
        ) : (
          notifications.map((notif, idx) => (
            <div 
              key={notif.id} 
              className={`flex items-start md:items-center gap-4 p-5 ${idx !== notifications.length - 1 ? 'border-b border-[#1e293b]/50' : ''} hover:bg-[#1e293b]/20 transition-colors cursor-pointer group`}
            >
              <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border ${notif.iconBg} shadow-sm group-hover:scale-105 transition-transform`}>
                {notif.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{notif.title}</h4>
                <p className="text-sm text-slate-400 mt-1 truncate md:whitespace-normal leading-relaxed">{notif.message}</p>
              </div>
              
              <div className="text-xs text-slate-500 shrink-0 font-medium">
                {notif.time}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}