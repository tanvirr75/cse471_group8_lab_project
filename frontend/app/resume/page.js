"use client";
import { useState, useEffect } from "react";

export default function ResumeAnalysisPage() {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // আপনার নিজের _id এখানে বসান
    const userId = "6a7b561aaee4b02bde52ab8a"; 

    fetch(`http://localhost:5002/api/resume/${userId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.analysis) setAnalysis(data.analysis);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#0b1120] text-white p-8 flex flex-col items-center justify-center">
        <p className="text-gray-400 text-lg">No resume analysis found.</p>
        <p className="text-gray-500 text-sm mt-2">Please upload a PDF from the frontend or Postman.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0b1120] text-white font-sans overflow-hidden">
      {/* সাইডবার */}
      <div className="w-64 border-r border-gray-800 p-6 flex flex-col gap-6 hidden md:flex">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-blue-600 p-1.5 rounded-lg">⚡</div>
          <span className="text-xl font-bold">SkillSync</span>
        </div>
        <div className="space-y-4 text-gray-400 text-sm">
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">📊 Dashboard</div>
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">📈 Career Readiness</div>
          <div className="flex items-center gap-3 text-blue-400 font-semibold bg-[#1e293b] p-2 rounded-lg cursor-pointer">📄 Resume Analysis</div>
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">💼 Job Matches</div>
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">📁 Portfolio</div>
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">✅ Applications</div>
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">🔔 Notifications</div>
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

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-xs font-bold text-blue-500 tracking-widest">AI • RESUME ANALYSIS</p>
                <h1 className="text-3xl font-bold mt-1">Resume analysis</h1>
                <p className="text-gray-400 text-sm mt-1">Gemini reviewed your uploaded resume against industry standards.</p>
              </div>
              <button className="bg-[#1e293b] hover:bg-[#334155] px-4 py-2 rounded-lg text-sm transition flex items-center gap-2">
                ⬇️ Re-upload PDF
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ফিডব্যাক */}
              <div className="lg:col-span-2 bg-[#131b2e] p-6 rounded-2xl border border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-300">Feedback by section</h3>
                  <span className="text-xs text-gray-500">{analysis.feedback.length} areas reviewed</span>
                </div>
                <div className="space-y-3">
                  {analysis.feedback.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-[#1e293b] rounded-lg">
                      <span className="text-sm text-gray-300">{item}</span>
                      <span className="text-xs px-2 py-1 rounded bg-green-900/30 text-green-400 border border-green-800">
                        {item.includes("Improve") ? "Improve" : item.includes("Add") ? "Add" : "Strong"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* স্কোর */}
              <div className="bg-[#131b2e] p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center">
                <div className="relative w-32 h-32">
                  <div className="w-32 h-32 rounded-full bg-[#1e293b] flex items-center justify-center border-8 border-blue-500">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-400">{analysis.score}</div>
                      <div className="text-[10px] text-gray-400 tracking-widest">RESUME SCORE</div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-4 text-center">Good — 3 quick fixes to reach 90+</p>
              </div>

              {/* টপ ফিক্সেস */}
              <div className="lg:col-span-3 bg-[#131b2e] p-6 rounded-2xl border border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-500/20 p-2 rounded-lg text-blue-400">✨</span>
                  <h3 className="text-sm font-semibold">Top priority fixes</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  {analysis.topFixes.map((fix, idx) => (
                    <p key={idx}>{fix}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}