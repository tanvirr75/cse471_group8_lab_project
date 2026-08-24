"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "../../src/components/common/ProtectedRoute";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    fetch("http://localhost:5002/api/notifications", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error(err));
  }, []);

  // টাইম ফরম্যাট
  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // আইকন
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
    <ProtectedRoute>
    <div className="flex h-screen bg-[#0b1120] text-white overflow-hidden font-sans">
      {/* সাইডবার */}
      <div className="w-64 border-r border-gray-800 p-6 flex flex-col gap-6 hidden md:flex">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-blue-600 p-1.5 rounded-lg">⚡</div>
          <span className="text-xl font-bold">SkillSync</span>
        </div>
        <div className="space-y-4 text-gray-400 text-sm">
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">📊 Dashboard</div>
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">📈 Career Readiness</div>
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">📄 Resume Analysis</div>
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">💼 Job Matches</div>
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">📁 Portfolio</div>
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">✅ Applications</div>
          <div className="flex items-center gap-3 text-blue-400 font-semibold bg-[#1e293b] p-2 rounded-lg cursor-pointer">🔔 Notifications</div>
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">⚙️ Settings</div>
        </div>
      </div>

      {/* মূল কন্টেন্ট */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div className="flex-1">
            <div className="bg-[#1e293b] rounded-full px-4 py-2 flex items-center gap-2 text-sm text-gray-400 w-full max-w-md">
              <span>🔍</span>
              <input type="text" placeholder="Search jobs, skills, companies..." className="bg-transparent outline-none w-full text-white" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#1e293b] p-2 rounded-full cursor-pointer">🔔</div>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm cursor-pointer">NH</div>
          </div>
        </div>

        {/* নোটিফিকেশন লিস্ট */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">Notifications</h1>
                <p className="text-gray-500 text-sm mt-1">Job matches, interview invites and platform updates.</p>
              </div>
              <button className="bg-[#1e293b] hover:bg-[#334155] px-4 py-2 rounded-lg text-sm transition">
                Mark all read
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No notifications found.</div>
            ) : (
              <div className="bg-[#131b2e] rounded-2xl divide-y divide-gray-800 border border-gray-800">
                {notifications.map((n, i) => (
                  <div key={i} className="p-4 flex items-start gap-4 hover:bg-[#1e293b] transition cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-[#1e293b] flex items-center justify-center text-lg">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">{n.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">{n.body}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500 whitespace-nowrap pt-1">
                      {getTimeAgo(n.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}