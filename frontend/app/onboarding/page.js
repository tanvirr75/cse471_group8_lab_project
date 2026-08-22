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
    await fetch("http://localhost:5002/api/profile/update", {
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
    await fetch("http://localhost:5002/api/profile/complete-onboarding", {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });
    router.push("/resume"); 
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* হেডার */}
        <div className="text-center mb-8">
          <p className="text-xs text-blue-500 font-semibold tracking-widest mb-2">STEP 2 OF 3 • CONNECT YOUR DATA</p>
          <h1 className="text-3xl font-bold mb-2">Let's build your profile</h1>
          <p className="text-gray-400 text-sm">Connect your accounts so SkillSync can analyze your real experience.</p>
        </div>

        {/* প্রোগ্রেস বার */}
        <div className="w-full h-1 bg-[#1e293b] rounded-full mb-8 relative">
          <div className="absolute left-0 top-0 h-1 w-2/3 bg-blue-500 rounded-full"></div>
        </div>

        {/* কার্ড ১: GitHub */}
        <div className="bg-[#162033] border border-gray-800 rounded-xl p-4 flex items-center justify-between mb-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center border border-gray-700">
              <span className="text-white text-xl">🐙</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">GitHub</h3>
              <p className="text-sm text-gray-400">Import repos, languages & contributions</p>
            </div>
          </div>
          <button 
            onClick={handleConnectGithub} 
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${githubConnected ? 'border-green-600 text-green-400 bg-green-900/20' : 'border-gray-600 text-white hover:bg-[#1e293b]'}`}
          >
            {githubConnected ? "✔ Connected" : "Connect"}
          </button>
        </div>

        {/* কার্ড ২: LinkedIn */}
        <div className="bg-[#162033] border border-gray-800 rounded-xl p-4 flex items-center justify-between mb-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xl">in</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">LinkedIn</h3>
              <p className="text-sm text-gray-400">Sync your professional profile</p>
            </div>
          </div>
          <button 
            onClick={handleConnectLinkedin} 
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${linkedinConnected ? 'border-green-600 text-green-400 bg-green-900/20' : 'border-gray-600 text-white hover:bg-[#1e293b]'}`}
          >
            {linkedinConnected ? "✔ Connected" : "Connect"}
          </button>
        </div>

        {/* কার্ড ৩: Resume (PDF) */}
        <div className="bg-[#162033] border border-gray-800 rounded-xl p-4 flex items-center justify-between mb-8 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1e293b] flex items-center justify-center">
              <span className="text-gray-400 text-xl">⬆</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Resume (PDF)</h3>
              <p className="text-sm text-gray-400">{resumeFile ? `Uploaded: ${resumeFile.name}` : "Upload for AI analysis & auto-fill"}</p>
            </div>
          </div>
          <label className="px-4 py-2 rounded-lg border border-gray-600 text-sm font-medium text-white hover:bg-[#1e293b] transition cursor-pointer">
            Upload
            <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
          </label>
        </div>

        {/* বটম বাটন */}
        <div className="flex gap-4">
          <button className="flex-1 py-3 rounded-lg bg-[#1e293b] text-white font-medium text-sm">Skip for now</button>
          <button 
            onClick={handleCompleteOnboarding} 
            className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition"
          >
            Continue to analysis
          </button>
        </div>
      </div>
    </div>
  );
}