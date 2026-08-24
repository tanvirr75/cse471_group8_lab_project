"use client";
import { useState, useEffect } from "react";

export default function ResumeAnalysisPage() {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (!token || !userId) return;

    fetch(`/api/resume/${userId}`, {
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
      <div className="text-white p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-slate-400 text-lg">No resume analysis found.</p>
        <p className="text-slate-500 text-sm mt-2">Please upload a PDF from your portfolio or complete onboarding.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-xs font-bold text-blue-500 tracking-widest uppercase">AI • Resume Analysis</p>
          <h1 className="text-3xl font-bold mt-2">Resume Score & Feedback</h1>
          <p className="text-slate-400 text-sm mt-1">SkillSync AI reviewed your uploaded resume against industry standards.</p>
        </div>
        <button className="bg-surface-dark hover:bg-background-dark px-4 py-2 rounded-xl text-sm transition flex items-center gap-2 border border-border-dark">
          ⬇️ Re-upload PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback Sections */}
        <div className="lg:col-span-2 bg-surface-dark p-6 rounded-2xl border border-border-dark shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-300">Feedback by section</h3>
            <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-background-dark rounded-md">{analysis.feedback.length} areas reviewed</span>
          </div>
          <div className="space-y-3">
            {analysis.feedback.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start md:items-center p-4 bg-background-dark rounded-xl border border-border-dark gap-4">
                <span className="text-sm text-slate-300 leading-relaxed">{item}</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-md shrink-0 border ${
                  item.includes("Improve") ? "bg-amber-900/30 text-amber-400 border-amber-800" : 
                  item.includes("Add") ? "bg-blue-900/30 text-blue-400 border-blue-800" : 
                  "bg-emerald-900/30 text-emerald-400 border-emerald-800"
                }`}>
                  {item.includes("Improve") ? "Improve" : item.includes("Add") ? "Add" : "Strong"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Score */}
        <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark shadow-sm flex flex-col items-center justify-center">
          <div className="relative w-36 h-36">
            <div className="w-36 h-36 rounded-full bg-background-dark flex items-center justify-center border-[10px] border-blue-600 shadow-inner">
              <div className="text-center">
                <div className="text-5xl font-black text-blue-400">{analysis.score}</div>
                <div className="text-[10px] font-bold text-slate-500 tracking-widest mt-1">RESUME SCORE</div>
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-6 text-center font-medium px-4">
            {analysis.score >= 90 ? "Excellent — You are ready to apply!" : "Good — Fix a few things to reach 90+"}
          </p>
        </div>

        {/* Top Priority Fixes */}
        <div className="lg:col-span-3 bg-surface-dark p-6 rounded-2xl border border-border-dark shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-600/20 p-2 rounded-xl text-blue-400">✨</span>
            <h3 className="text-base font-bold">Top priority fixes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.topFixes.map((fix, idx) => (
              <div key={idx} className="flex gap-3 text-sm text-slate-300 p-4 bg-background-dark rounded-xl border border-border-dark">
                <span className="text-blue-500 font-bold">{idx + 1}.</span>
                <p className="leading-relaxed">{fix}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}