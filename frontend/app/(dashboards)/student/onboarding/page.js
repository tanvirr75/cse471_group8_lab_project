"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [githubConnected, setGithubConnected] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const updateProfile = async (data) => {
    await fetch("/api/profile/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(data)
    });
  };

  const handleConnectGithub = async () => {
    await updateProfile({ githubUrl: "https://github.com/nafiur" });
    setGithubConnected(true);
  };

  const handleConnectLinkedin = async () => {
    await updateProfile({ linkedinUrl: "https://linkedin.com/in/nafiur" });
    setLinkedinConnected(true);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);
    alert("Resume selected: " + file.name);
  };

  const handleCompleteOnboarding = async () => {
    await fetch("/api/profile/complete-onboarding", {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });
    router.push("/student/resume"); 
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[70vh]">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs text-blue-500 font-bold tracking-widest mb-2">STEP 2 OF 3 • CONNECT YOUR DATA</p>
          <h1 className="text-3xl font-bold mb-3 text-white">Let's build your profile</h1>
          <p className="text-slate-400 text-sm">Connect your accounts so SkillSync can analyze your real experience.</p>
        </div>

        {/* Progress */}
        <div className="w-full h-1.5 bg-background-dark rounded-full mb-10 relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-2/3 bg-blue-600 rounded-full"></div>
        </div>

        {/* Card 1: GitHub */}
        <div className="bg-surface-dark border border-border-dark rounded-2xl p-5 flex items-center justify-between mb-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-background-dark flex items-center justify-center border border-border-dark shadow-inner">
              <span className="text-white text-xl">🐙</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">GitHub</h3>
              <p className="text-sm text-slate-400 mt-1">Import repos, languages & contributions</p>
            </div>
          </div>
          <button 
            onClick={handleConnectGithub} 
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${githubConnected ? 'border border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : 'border border-border-dark text-white hover:bg-background-dark shadow-sm'}`}
          >
            {githubConnected ? "✔ Connected" : "Connect"}
          </button>
        </div>

        {/* Card 2: LinkedIn */}
        <div className="bg-surface-dark border border-border-dark rounded-2xl p-5 flex items-center justify-between mb-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-inner">
              <span className="text-white font-bold text-xl">in</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">LinkedIn</h3>
              <p className="text-sm text-slate-400 mt-1">Sync your professional profile</p>
            </div>
          </div>
          <button 
            onClick={handleConnectLinkedin} 
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${linkedinConnected ? 'border border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : 'border border-border-dark text-white hover:bg-background-dark shadow-sm'}`}
          >
            {linkedinConnected ? "✔ Connected" : "Connect"}
          </button>
        </div>

        {/* Card 3: Resume */}
        <div className="bg-surface-dark border border-border-dark rounded-2xl p-5 flex items-center justify-between mb-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-background-dark flex items-center justify-center border border-border-dark shadow-inner">
              <span className="text-slate-400 text-xl">⬆</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Resume (PDF)</h3>
              <p className="text-sm text-slate-400 mt-1">{resumeFile ? `Uploaded: ${resumeFile.name}` : "Upload for AI analysis & auto-fill"}</p>
            </div>
          </div>
          <label className="px-5 py-2.5 rounded-xl border border-border-dark text-sm font-medium text-white hover:bg-background-dark transition cursor-pointer shadow-sm">
            Upload
            <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
          </label>
        </div>

        {/* Bottom Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 py-3.5 rounded-xl bg-surface-dark text-white font-medium text-sm border border-border-dark hover:bg-background-dark transition shadow-sm">
            Skip for now
          </button>
          <button 
            onClick={handleCompleteOnboarding} 
            className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
          >
            Continue to analysis
          </button>
        </div>
      </div>
    </div>
  );
}