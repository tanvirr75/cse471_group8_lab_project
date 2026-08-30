'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getNotifications, markAllNotificationsAsRead } from '@/lib/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0f111a] flex items-center justify-center text-slate-500">Loading notifications...</div>;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0f111a] text-white p-8">
      <div className="max-w-[800px] mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 tracking-widest uppercase mb-3">
              <span>ACCOUNT</span>
              <span className="text-slate-600">•</span>
              <span>NOTIFICATIONS</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Notifications Center</h1>
            <p className="text-sm text-slate-400">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}.
            </p>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-900/50"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="bg-[#161b22] border border-[#1e293b] rounded-xl overflow-hidden shadow-lg">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No notifications yet.
            </div>
          ) : (
            <div className="divide-y divide-[#1e293b]">
              {notifications.map(notif => (
                <div key={notif._id} className={`p-6 flex gap-4 transition-colors ${!notif.read ? 'bg-[#1e293b]/30' : 'hover:bg-[#1e293b]/10'}`}>
                  
                  {/* Icon Based on Type */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!notif.read ? 'bg-blue-500 shadow-lg shadow-blue-500/20 text-white' : 'bg-[#1e293b] text-slate-400'}`}>
                    {notif.type === 'interview' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    ) : notif.type === 'job_match' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`text-sm ${!notif.read ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm ${!notif.read ? 'text-slate-300' : 'text-slate-500'}`}>
                      {notif.body}
                    </p>
                    
                    {notif.link && (
                      <div className="mt-3">
                        <Link href={notif.link} className="inline-block px-4 py-1.5 bg-[#1e293b] hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-[#334155] transition-colors">
                          View details
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  )}
                  
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
