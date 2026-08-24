'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [githubConnected, setGithubConnected] = useState(true);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full text-white px-4">
      
      {/* Header section */}
      <div className="text-center max-w-2xl w-full mb-10">
        <p className="text-[10px] font-bold text-blue-500 tracking-[0.2em] uppercase mb-4">
          Step 2 of 3 • Connect your data
        </p>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Let's build your profile</h1>
        <p className="text-slate-400 text-sm md:text-base">
          Connect your accounts so SkillSync can analyze your real experience.
        </p>
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#1e293b] rounded-full mt-10 overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full w-2/3 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
        </div>
      </div>

      {/* Connection Cards */}
      <div className="w-full max-w-2xl space-y-4">
        
        {/* GitHub */}
        <div className="bg-[#121a2f] p-5 md:p-6 rounded-2xl border border-[#1e293b] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-[#0b1120] border border-[#1e293b] flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">GitHub</h3>
              <p className="text-slate-400 text-sm">Import repos, languages & contributions</p>
            </div>
          </div>
          {githubConnected ? (
            <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-bold bg-emerald-900/10 px-3 py-1.5 rounded-lg border border-emerald-900/30">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              Connected
            </span>
          ) : (
            <button className="bg-[#1e293b] hover:bg-[#334155] px-5 py-2 rounded-xl text-sm font-bold transition">Connect</button>
          )}
        </div>

        {/* LinkedIn */}
        <div className="bg-[#121a2f] p-5 md:p-6 rounded-2xl border border-[#1e293b] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-[#0077b5] border border-[#0077b5] flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">LinkedIn</h3>
              <p className="text-slate-400 text-sm">Sync your professional profile</p>
            </div>
          </div>
          <button className="bg-[#1e293b] hover:bg-[#334155] border border-[#334155] px-5 py-2 rounded-xl text-sm font-bold transition">Connect</button>
        </div>

        {/* Resume */}
        <div className="bg-[#121a2f] p-5 md:p-6 rounded-2xl border border-[#1e293b] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-[#0b1120] border border-[#1e293b] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">Resume (PDF)</h3>
              <p className="text-slate-400 text-sm">Upload for AI analysis & auto-fill</p>
            </div>
          </div>
          <button className="bg-[#1e293b] hover:bg-[#334155] border border-[#334155] px-5 py-2 rounded-xl text-sm font-bold transition">Upload</button>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="w-full max-w-2xl flex gap-4 mt-8">
        <button 
          onClick={() => router.push('/student/dashboard')}
          className="flex-1 bg-[#121a2f] hover:bg-[#1e293b] border border-[#1e293b] py-3.5 rounded-xl font-bold transition"
        >
          Skip for now
        </button>
        <button 
          onClick={() => router.push('/student/dashboard')}
          className="flex-[2] bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 py-3.5 rounded-xl font-bold transition"
        >
          Continue to analysis
        </button>
      </div>
    </div>
  );
}