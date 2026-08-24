"use client";
import { useState, useEffect } from "react";

export default function ResumeAnalysisPage() {
  const [analysis, setAnalysis] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchAnalysis = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (!token || !userId) return;

    fetch(`/api/resume/${userId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (data && data.analysis) setAnalysis(data.analysis);
      })
      .catch((err) => console.log("No existing analysis found"));
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("/api/resume/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.data?.analysis) {
        setAnalysis(data.data.analysis);
      } else {
        alert("Upload failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!analysis) {
    return (
      <div className="text-white p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-[#121a2f] p-8 rounded-2xl border border-[#1e293b] shadow-sm flex flex-col items-center max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#1e293b] text-blue-500 rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner">
            📄
          </div>
          <h2 className="text-xl font-bold mb-2">No Resume Found</h2>
          <p className="text-slate-400 text-sm mb-6">Upload your resume in PDF format to get an AI-powered analysis of your skills and experience.</p>
          
          <label className={`w-full py-3 rounded-xl font-bold text-sm transition text-center cursor-pointer shadow-lg shadow-blue-500/20 ${isUploading ? 'bg-blue-800 text-slate-300' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
            {isUploading ? 'Analyzing...' : 'Upload PDF'}
            <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={isUploading} />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full text-white pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-xs font-bold text-blue-500 tracking-widest uppercase">AI • Resume Analysis</p>
          <h1 className="text-3xl font-bold mt-2">Resume analysis</h1>
          <p className="text-slate-400 text-sm mt-2">Gemini reviewed your uploaded resume against industry standards for backend roles.</p>
        </div>
        <label className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 border border-[#334155] cursor-pointer shadow-sm ${isUploading ? 'bg-[#0b1120] text-slate-500' : 'bg-[#121a2f] hover:bg-[#1e293b]'}`}>
          {isUploading ? '⏳ Uploading...' : '⬇️ Re-upload PDF'}
          <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={isUploading} />
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Feedback Sections (Left Column, span 3) */}
        <div className="lg:col-span-3 bg-[#121a2f] p-6 rounded-2xl border border-[#1e293b] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-white">Feedback by section</h3>
            <span className="text-xs text-slate-500 font-medium">{analysis.feedback.length} areas reviewed</span>
          </div>
          <div className="space-y-4">
            {analysis.feedback.map((item, idx) => {
              const isImprove = item.includes("Improve");
              const isAdd = item.includes("Add");
              const isStrong = !isImprove && !isAdd;
              
              // Extract the bold part vs description if formatted as "Title: Description"
              const parts = item.split(":");
              const title = parts[0] || item;
              const desc = parts[1] || "";

              return (
                <div key={idx} className="flex items-start gap-4 p-1">
                  {/* Icon */}
                  <div className={`mt-0.5 shrink-0 w-5 h-5 rounded flex items-center justify-center border ${
                    isImprove ? "border-amber-500/50 text-amber-500" :
                    isAdd ? "border-red-500/50 text-red-500 bg-red-500/10" :
                    "border-emerald-500/50 text-emerald-500 bg-emerald-500/10"
                  }`}>
                    {isImprove ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    ) : isAdd ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-200">{title}</h4>
                    {desc && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>}
                  </div>
                  {/* Badge */}
                  <div className={`text-[10px] font-bold px-3 py-1 rounded-full border shrink-0 ${
                    isImprove ? "bg-amber-900/10 text-amber-500 border-amber-900/50" : 
                    isAdd ? "bg-red-900/10 text-red-500 border-red-900/50" : 
                    "bg-emerald-900/10 text-emerald-500 border-emerald-900/50"
                  }`}>
                    {isImprove ? "Improve" : isAdd ? "Add" : "Strong"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Score (Right Column, span 2) */}
        <div className="lg:col-span-2 bg-[#121a2f] p-8 rounded-2xl border border-[#1e293b] shadow-sm flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 mb-8">
            {/* The circular progress matching the Figma design */}
            <div className="w-48 h-48 rounded-full bg-[#0b1120] flex items-center justify-center border-[16px] border-[#1e293b] shadow-inner relative">
              {/* Pseudo-element for the progress arc - we'll simulate it with a colored border for now */}
              <div className="absolute inset-[-16px] rounded-full border-[16px] border-blue-500/0 border-t-blue-500 border-r-blue-500 border-b-blue-500 transform -rotate-45" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 50%)' }}></div>
              <div className="text-center z-10 relative">
                <div className="text-6xl font-black text-white">{analysis.score}</div>
                <div className="text-[10px] font-bold text-slate-500 tracking-widest mt-2 uppercase">Resume Score</div>
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-sm text-center font-medium">
            {analysis.score >= 90 ? "Excellent — You are ready to apply!" : "Good — 3 quick fixes to reach 90+"}
          </p>
        </div>

        {/* Top Priority Fixes (Full width bottom) */}
        <div className="lg:col-span-5 bg-[#121a2f] p-6 rounded-2xl border border-blue-900/30 shadow-sm relative overflow-hidden">
          {/* Subtle blue glow top line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600/0 via-blue-500 to-blue-600/0 opacity-50"></div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-lg p-1.5 shadow-sm shadow-blue-500/20">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              </div>
              <h3 className="text-base font-bold text-white">Top priority fixes</h3>
            </div>
            <span className="text-[10px] font-bold text-blue-300 bg-blue-900/30 px-2 py-1 rounded border border-blue-800">Gemini</span>
          </div>
          
          <div className="text-sm text-slate-300 leading-relaxed pt-2">
            {analysis.topFixes.map((fix, idx) => {
              // Extract the bold title (usually up to the first dash or period)
              const parts = fix.split("—");
              const boldPart = parts[0];
              const restPart = parts.slice(1).join("—");
              
              return (
                <span key={idx}>
                  <strong className="text-white font-bold">{boldPart}</strong>
                  {restPart ? ` — ${restPart}` : ""}
                  {idx < analysis.topFixes.length - 1 ? " " : ""}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}