"use client";
import { useState, useEffect } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    fetch("/api/notifications", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error(err));
  }, []);

  // Time format helper
  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Icons
  const getIcon = (type) => {
    const icons = {
      'job_match': '💼',
      'interview': '📅',
      'score_update': '📈',
      'roadmap': '🗺️',
      'industry_trend': '📊',
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="max-w-4xl mx-auto w-full text-white">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-slate-400 text-sm mt-2">Job matches, interview invites and platform updates.</p>
        </div>
        <button className="bg-surface-dark hover:bg-background-dark border border-border-dark px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm">
          Mark all read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-surface-dark border border-border-dark rounded-2xl">
          No notifications found.
        </div>
      ) : (
        <div className="bg-surface-dark rounded-2xl divide-y divide-border-dark border border-border-dark shadow-sm">
          {notifications.map((n, i) => (
            <div key={i} className="p-5 flex items-start gap-4 hover:bg-background-dark transition cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-background-dark border border-border-dark flex items-center justify-center text-xl shrink-0 shadow-inner">
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-base">{n.title}</h3>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">{n.body}</p>
              </div>
              <div className="text-right text-xs font-medium text-slate-500 whitespace-nowrap pt-1">
                {getTimeAgo(n.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}