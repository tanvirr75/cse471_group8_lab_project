"use client";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [notifications, setNotifications] = useState([]);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [portfolios, setPortfolios] = useState([]); // ✅ এখন এটি একটি Array

  // Add/Edit Portfolio এর জন্য State
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", title: "", university: "", avatarInitials: "", 
    github: "", linkedin: "", website: "", 
    skills: "", certifications: "", projects: ""
  });
  const [loading, setLoading] = useState(false);

  const [onboarding, setOnboarding] = useState({ githubConnected: false, linkedinConnected: false, resumeFile: null });

  useEffect(() => {
    const autoLoginAndLoad = async () => {
      let token = localStorage.getItem("token");
      if (!token) {
        const res = await fetch("http://localhost:5002/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "nafir@bracu.ac.bd", password: "123456" })
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          token = data.token;
        }
      }

      // 1. Notifications
      fetch("http://localhost:5002/api/notifications", {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => res.json()).then(data => setNotifications(Array.isArray(data) ? data : []));

      // 2. Resume
      const userId = "6a7b561aaee4b02bde52ab8a";
      fetch(`http://localhost:5002/api/resume/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => res.json()).then(data => {
        if (data && data.analysis) setResumeAnalysis(data.analysis);
      });

      // 3. Portfolio (সবগুলো ডাটা আনা)
      fetch("http://localhost:5002/api/portfolio/me", {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => res.json()).then(data => {
        if (Array.isArray(data)) setPortfolios(data);
      });
    };
    autoLoginAndLoad();
  }, []);

  // ------------------ ONBOARDING HANDLERS ------------------
  const handleConnectGithub = async () => setOnboarding(prev => ({ ...prev, githubConnected: true }));
  const handleConnectLinkedin = async () => setOnboarding(prev => ({ ...prev, linkedinConnected: true }));
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. ফাইলটি আসলেই PDF কিনা চেক করুন
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please upload a valid PDF file.");
      return;
    }

    // 2. ফাইলের নাম দেখে ভিন্ন ভিন্ন রেজাল্ট দিন
    const fileName = file.name.toLowerCase();
    let score = 65;
    let feedback = ["Contact & links: Needs Improvement", "Technical skills: Needs Improvement", "Project descriptions: Needs Improvement", "Formatting: Needs Improvement", "Summary statement: Missing"];
    let fixes = ["1. Add a professional summary.", "2. Quantify your projects.", "3. Insert missing keywords like Node.js."];

    if (fileName.includes("cv") || fileName.includes("resume")) {
      score = 85;
      feedback = ["Contact & links: Excellent", "Technical skills: Strong", "Project descriptions: Good", "Keyword optimization: Improve", "Formatting: Excellent", "Summary statement: Add"];
      fixes = ["1. Add more specific keywords like Docker and AWS.", "2. Include measurable outcomes in projects.", "3. Add a professional summary at the top."];
    }

    // 3. ফলাফল UI-তে সেট করুন
    setOnboarding(prev => ({ ...prev, resumeFile: file }));
    setResumeAnalysis({ score, feedback, topFixes: fixes });

    // 4. অটোমেটিক Resume Analysis ট্যাবে চলে যান
    setActiveTab("resume");
    alert("Resume analyzed! Score: " + score);
  };
  // ------------------ PORTFOLIO HANDLERS ------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add বাটনে ক্লিক করলে ফর্ম খালি হবে
  const handleAddClick = () => {
    setFormData({ fullName: "", title: "", university: "", avatarInitials: "NH", github: "", linkedin: "", website: "", skills: "", certifications: "", projects: "" });
    setIsEditing(false);
    setShowPortfolioForm(true);
  };

  // Edit বাটনে ক্লিক করলে ফর্মে আগের ডাটা বসবে
  const handleEditClick = (index) => {
    const selectedPortfolio = portfolios[index];
    if (selectedPortfolio) {
      setFormData({
        fullName: selectedPortfolio.fullName || "",
        title: selectedPortfolio.title || "",
        university: selectedPortfolio.university || "",
        avatarInitials: selectedPortfolio.avatarInitials || "NH",
        github: selectedPortfolio.links?.github || "",
        linkedin: selectedPortfolio.links?.linkedin || "",
        website: selectedPortfolio.links?.website || "",
        skills: (selectedPortfolio.skills || []).join(", "),
        certifications: (selectedPortfolio.certifications || []).join(", "),
        projects: (selectedPortfolio.projects || []).map(p => `${p.title}; ${p.description}; ${p.techStack.join(", ")}`).join("\n")
      });
      setIsEditing(true);
      setShowPortfolioForm(true);
    }
  };

  const handlePortfolioSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.title) {
      alert("Please fill in the required fields (Name and Title)");
      return;
    }
    
    setLoading(true);
    const token = localStorage.getItem("token");

    const skillsArray = formData.skills.split(",").map(s => s.trim()).filter(Boolean);
    const certsArray = formData.certifications.split(",").map(s => s.trim()).filter(Boolean);
    
    const projectsArray = formData.projects.split("\n").map(line => {
      const parts = line.split(";").map(p => p.trim());
      if (parts.length >= 2) {
        return { title: parts[0], description: parts[1], techStack: parts[2] ? parts[2].split(",").map(t => t.trim()).filter(Boolean) : [] };
      }
      return null;
    }).filter(Boolean);

    const payload = {
      fullName: formData.fullName,
      title: formData.title,
      university: formData.university,
      avatarInitials: formData.avatarInitials || "NH",
      links: { github: formData.github, linkedin: formData.linkedin, website: formData.website },
      skills: skillsArray,
      certifications: certsArray,
      projects: projectsArray
    };

    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("http://localhost:5002/api/portfolio", {
        method: method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(isEditing ? "Portfolio updated successfully!" : "Portfolio added successfully!");
        setShowPortfolioForm(false);

        // লিস্ট আবার রিফ্রেশ করা
        fetch("http://localhost:5002/api/portfolio/me", {
          headers: { "Authorization": `Bearer ${token}` }
        }).then(res => res.json()).then(data => {
          if (Array.isArray(data)) setPortfolios(data);
        });
      } else {
        alert("Failed: " + (data.message || "Error"));
      }
    } catch (error) {
      alert("Server error.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ RENDER CONTENT ------------------
  const renderContent = () => {
    if (activeTab === "notifications") {
      return (
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Notifications</h1>
          {notifications.length === 0 ? <p className="text-gray-400">No notifications found.</p> : (
            <div className="bg-[#131b2e] rounded-2xl divide-y divide-gray-800 border border-gray-800">
              {notifications.map((n, i) => (
                <div key={i} className="p-4 flex items-start gap-4 hover:bg-[#1e293b] transition cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-[#1e293b] flex items-center justify-center text-lg">{n.type === 'job_match' ? '💼' : n.type === 'interview' ? '📅' : n.type === 'score_update' ? '📈' : '🔔'}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm">{n.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{n.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "resume") {
      // Figma-র মতো ডিটেইলস ম্যাপিং
      const dummyDetails = {
         "Contact & links": "GitHub, LinkedIn and email all present and clickable.",
         "Technical skills": "Well-organized and relevant to target role.",
         "Project descriptions": "Add measurable impact — use numbers and outcomes.",
         "Keyword optimization": "Missing: Docker, CI/CD, testing — recruiters filter for these.",
         "Formatting": "Clean, single-column, ATS-friendly layout.",
         "Summary statement": "Missing — add a 2-line professional summary at the top."
      };

      // ব্যাজের রং ও লেবেল ঠিক করা
      const badgeLogic = (text) => {
        if (text.includes("Improve")) return { label: "Improve", color: "text-yellow-400 border-yellow-800 bg-yellow-900/30" };
        if (text.includes("Add")) return { label: "Add", color: "text-red-400 border-red-800 bg-red-900/30" };
        return { label: "Strong", color: "text-green-400 border-green-800 bg-green-900/30" };
      };

      return (
        <div className="p-8 max-w-6xl mx-auto">
          {/* হেডার */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-xs font-bold text-blue-500 tracking-widest">AI • RESUME ANALYSIS</p>
              <h1 className="text-3xl font-bold mt-1">Resume analysis</h1>
              <p className="text-gray-400 text-sm mt-1">Gemini reviewed your uploaded resume against industry standards for backend roles.</p>
            </div>
            <button className="bg-[#1e293b] hover:bg-[#334155] px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              ⬇️ Re-upload PDF
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ফিডব্যাক সেকশন (বাম দিক) */}
            <div className="lg:col-span-2 bg-[#131b2e] p-6 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Feedback by section</h3>
                <span className="text-gray-500 text-xs">{resumeAnalysis.feedback.length} areas reviewed</span>
              </div>
              <div className="space-y-3">
                {resumeAnalysis.feedback.map((item, idx) => {
                  const parts = item.split(":");
                  const label = parts[0].trim();
                  const badge = badgeLogic(item);
                  const description = dummyDetails[label] || "No description available.";

                  return (
                    <div key={idx} className="p-3 rounded-lg bg-[#1e293b] flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{label}</h4>
                        <p className="text-xs text-gray-400 mt-1">{description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded border text-xs font-medium ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* স্কোর রিং (ডান দিক) */}
            <div className="bg-[#131b2e] p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32">
                <div className="w-32 h-32 rounded-full bg-[#1e293b] flex items-center justify-center border-8 border-blue-500">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400">{resumeAnalysis.score}</div>
                    <div className="text-[10px] text-gray-400 tracking-widest">RESUME SCORE</div>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-4 text-center">Good — 3 quick fixes to reach 90+</p>
            </div>

            {/* টপ ফিক্সেস (নিচে) */}
            <div className="lg:col-span-3 bg-[#131b2e] p-6 rounded-2xl border border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-500/20 p-2 rounded-lg text-blue-400">✨</span>
                <h3 className="font-semibold">Top priority fixes</h3>
                <span className="ml-auto bg-blue-600 px-2 py-0.5 rounded text-xs text-white">Gemini</span>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                {resumeAnalysis.topFixes.map((fix, idx) => (
                  <p key={idx}>{fix}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "onboarding") {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b1120] p-6">
          <div className="max-w-3xl w-full">
            {/* হেডার */}
            <div className="text-center mb-8">
              <p className="text-xs font-bold text-blue-500 tracking-widest mb-2">STEP 2 OF 3 • CONNECT YOUR DATA</p>
              <h1 className="text-3xl font-bold mb-2">Let's build your profile</h1>
              <p className="text-gray-400 text-sm">Connect your accounts so SkillSync can analyze your real experience.</p>
            </div>

            {/* প্রোগ্রেস বার */}
            <div className="w-full h-1 bg-[#1e293b] rounded-full mb-8 relative">
              <div className="absolute left-0 top-0 h-1 w-2/3 bg-blue-500 rounded-full"></div>
            </div>

            {/* GitHub কার্ড */}
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
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${onboarding.githubConnected ? 'border-green-600 text-green-400 bg-green-900/20' : 'border-gray-600 text-white hover:bg-[#1e293b]'}`}
              >
                {onboarding.githubConnected ? "✓ Connected" : "Connect"}
              </button>
            </div>

            {/* LinkedIn কার্ড */}
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
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${onboarding.linkedinConnected ? 'border-green-600 text-green-400 bg-green-900/20' : 'border-gray-600 text-white hover:bg-[#1e293b]'}`}
              >
                {onboarding.linkedinConnected ? "✓ Connected" : "Connect"}
              </button>
            </div>

            {/* Resume কার্ড */}
            <div className="bg-[#162033] border border-gray-800 rounded-xl p-4 flex items-center justify-between mb-8 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1e293b] flex items-center justify-center">
                  <span className="text-gray-400 text-xl">⬆</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Resume (PDF)</h3>
                  <p className="text-sm text-gray-400">{onboarding.resumeFile ? `Uploaded: ${onboarding.resumeFile.name}` : "Upload for AI analysis & auto-fill"}</p>
                </div>
              </div>
              <label className="px-4 py-2 rounded-lg border border-gray-600 text-sm font-medium text-white hover:bg-[#1e293b] transition cursor-pointer">
                Upload
                <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
              </label>
            </div>

            {/* নিচের বাটন */}
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab("resume")} 
                className="flex-1 py-3 rounded-lg bg-[#1e293b] text-white font-medium text-sm"
              >
                Skip for now
              </button>
              <button onClick={() => setActiveTab("resume")} className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition">
                Continue to analysis
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "portfolio") {
      return (
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-xs font-bold text-blue-500 tracking-widest uppercase">Public Portfolio</p>
              <h1 className="text-3xl font-bold mt-1">Your professional portfolio</h1>
              <p className="text-gray-400 text-sm mt-1">This is what recruiters see. Keep it updated to increase your visibility.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddClick} className="bg-green-600 hover:bg-green-700 px-6 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2">
                + Add Portfolio
              </button>
            </div>
          </div>

          {showPortfolioForm && (
            <div className="bg-[#162033] border border-gray-700 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Portfolio" : "Add New Portfolio"}</h2>
              <form onSubmit={handlePortfolioSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-[#0b1120] border border-gray-700 outline-none" placeholder="Naimul Hasan" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-[#0b1120] border border-gray-700 outline-none" placeholder="Backend Developer" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">University</label>
                    <input type="text" name="university" value={formData.university} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-[#0b1120] border border-gray-700 outline-none" placeholder="BRAC University" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Avatar Initials</label>
                    <input type="text" name="avatarInitials" value={formData.avatarInitials} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-[#0b1120] border border-gray-700 outline-none" placeholder="NH" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">GitHub Link</label>
                    <input type="text" name="github" value={formData.github} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-[#0b1120] border border-gray-700 outline-none" placeholder="github.com/naimul" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">LinkedIn Link</label>
                    <input type="text" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-[#0b1120] border border-gray-700 outline-none" placeholder="in/naimul-hasan" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Skills (comma separated)</label>
                    <input type="text" name="skills" value={formData.skills} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-[#0b1120] border border-gray-700 outline-none" placeholder="JavaScript, Node.js, MongoDB, Express, REST, Git" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Certifications (comma separated)</label>
                    <input type="text" name="certifications" value={formData.certifications} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-[#0b1120] border border-gray-700 outline-none" placeholder="Meta Backend Developer (Coursera), MongoDB University M001" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Projects (Title; Description; TechStack) - এক লাইনে একটা প্রজেক্ট</label>
                    <textarea name="projects" value={formData.projects} onChange={handleInputChange} rows={4} className="w-full p-3 rounded-lg bg-[#0b1120] border border-gray-700 outline-none" placeholder={`SkillSync API; REST backend for a career platform - Node, Express, MongoDB, JWT; Node.js, MongoDB\nE-commerce Backend; Scalable API with payment integration and admin dashboard; Express, Stripe`}></textarea>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                    {loading ? "Saving..." : "Save Portfolio"}
                  </button>
                  <button type="button" onClick={() => setShowPortfolioForm(false)} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg text-sm font-medium">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {portfolios.length === 0 ? <p className="text-gray-400">No portfolio found. Click "Add Portfolio" to create one.</p> : portfolios.map((portfolio, index) => (
            <div key={index} className="space-y-6 mb-8">
              {/* Profile Card */}
              <div className="bg-[#131b2e] rounded-2xl border border-gray-800 p-8 shadow-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-blue-500 flex items-center justify-center text-3xl font-bold text-white">
                    {portfolio.avatarInitials || "NH"}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold">{portfolio.fullName}</h2>
                    <p className="text-gray-300 text-lg">{portfolio.title} — {portfolio.university}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-gray-400 text-sm">
                      {portfolio.links?.github && <span className="flex items-center gap-1">🐙 {portfolio.links.github}</span>}
                      {portfolio.links?.linkedin && <span className="flex items-center gap-1">in {portfolio.links.linkedin}</span>}
                      {portfolio.links?.website && <span className="flex items-center gap-1">🌐 {portfolio.links.website}</span>}
                    </div>
                  </div>
                  <div className="bg-[#1e293b] px-4 py-1.5 rounded-full border border-blue-900/50 text-blue-400 text-sm font-medium">
                    {portfolio.employabilityScore || 76} Employability
                  </div>
                </div>
              </div>

              {/* Projects & Skills Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Featured Projects */}
                <div className="bg-[#131b2e] rounded-2xl border border-gray-800 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Featured projects</h3>
                    <span className="text-xs text-gray-400">From GitHub</span>
                  </div>
                  <div className="space-y-4">
                    {portfolio.projects?.length > 0 ? portfolio.projects.map((p, pIdx) => (
                      <div key={pIdx} className="bg-[#1e293b] p-4 rounded-xl border border-gray-700">
                        <h4 className="font-semibold text-blue-400">{p.title}</h4>
                        <p className="text-gray-400 text-sm mt-1">{p.description}</p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {p.techStack?.map((tech, tIdx) => (
                            <span key={tIdx} className="bg-[#0b1120] px-2 py-1 rounded text-xs text-gray-300 border border-gray-700">{tech}</span>
                          ))}
                        </div>
                      </div>
                    )) : <p className="text-gray-500 text-sm">No projects added yet.</p>}
                  </div>
                </div>

                {/* Skills & Certifications */}
                <div className="bg-[#131b2e] rounded-2xl border border-gray-800 p-6">
                  <h3 className="font-semibold text-lg mb-2">Skills & certifications</h3>
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 uppercase mb-2">Top Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {portfolio.skills?.map((s, sIdx) => (
                        <span key={sIdx} className="bg-[#1e293b] px-3 py-1 rounded-full text-xs text-gray-300 border border-gray-700">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-2">Certifications</p>
                    <ul className="space-y-1 text-sm text-gray-300 list-disc list-inside">
                      {portfolio.certifications?.map((c, cIdx) => (
                        <li key={cIdx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <button onClick={() => handleEditClick(index)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                ✏️ Edit this portfolio
              </button>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-[#0b1120] text-white font-sans overflow-hidden">
      <div className="w-64 border-r border-gray-800 p-6 flex flex-col gap-6 hidden md:flex">
        <div className="flex items-center gap-2 mb-6"><div className="bg-blue-600 p-1.5 rounded-lg">⚡</div><span className="text-xl font-bold">SkillSync</span></div>
        <div className="space-y-4 text-gray-400 text-sm">
          <div onClick={() => setActiveTab("notifications")} className={`flex items-center gap-3 hover:text-white cursor-pointer ${activeTab === "notifications" ? "text-blue-400 font-semibold bg-[#1e293b] p-2 rounded-lg" : ""}`}>🔔 Notifications</div>
          <div onClick={() => setActiveTab("resume")} className={`flex items-center gap-3 hover:text-white cursor-pointer ${activeTab === "resume" ? "text-blue-400 font-semibold bg-[#1e293b] p-2 rounded-lg" : ""}`}>📄 Resume Analysis</div>
          <div onClick={() => setActiveTab("onboarding")} className={`flex items-center gap-3 hover:text-white cursor-pointer ${activeTab === "onboarding" ? "text-blue-400 font-semibold bg-[#1e293b] p-2 rounded-lg" : ""}`}>📊 Onboarding</div>
          <div onClick={() => setActiveTab("portfolio")} className={`flex items-center gap-3 hover:text-white cursor-pointer ${activeTab === "portfolio" ? "text-blue-400 font-semibold bg-[#1e293b] p-2 rounded-lg" : ""}`}>📁 Portfolio</div>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div className="flex-1"><div className="bg-[#1e293b] rounded-full px-4 py-2 flex items-center gap-2 text-sm text-gray-400 w-full max-w-md"><span>🔍</span><input type="text" placeholder="Search..." className="bg-transparent outline-none w-full text-white" /></div></div>
          <div className="flex items-center gap-4"><div className="bg-[#1e293b] p-2 rounded-full cursor-pointer">🔔</div><div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm cursor-pointer">NH</div></div>
        </div>
        <div className="flex-1 overflow-y-auto p-8">{renderContent()}</div>
      </div>
    </div>
  );
}