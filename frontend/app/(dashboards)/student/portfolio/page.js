"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [activePortfolioIndex, setActivePortfolioIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState("");

  // Form State for Editing/Adding
  const [formData, setFormData] = useState({
    fullName: "Naimul Hasan",
    title: "Backend Developer",
    university: "CSE, BRAC University",
    avatarInitials: "NH",
    employabilityScore: 76,
    github: "github.com/naimul",
    linkedin: "in/naimul-hasan",
    website: "naimul.dev",
    projects: [
      {
        title: "SkillSync API",
        description: "REST backend for a career platform — Node, Express, MongoDB, JWT.",
        techStack: ["Node.js", "MongoDB"],
        repoUrl: ""
      },
      {
        title: "E-commerce Backend",
        description: "Scalable API with payment integration and admin dashboard.",
        techStack: ["Express", "Stripe"],
        repoUrl: ""
      }
    ],
    skills: ["JavaScript", "Node.js", "MongoDB", "Express", "REST", "Git"],
    certifications: [
      "Meta Backend Developer (Coursera)",
      "MongoDB University M001"
    ]
  });

  const router = useRouter();

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token") || "";
  };

  const fetchPortfolios = async () => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/portfolio/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPortfolios(data);
      } else if (data && !data.message) {
        setPortfolios([data]);
      }
    } catch (err) {
      console.error("Error loading portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const activePortfolio = portfolios[activePortfolioIndex] || {
    fullName: "Naimul Hasan",
    title: "Backend Developer",
    university: "CSE, BRAC University",
    avatarInitials: "NH",
    employabilityScore: 76,
    links: {
      github: "github.com/naimul",
      linkedin: "in/naimul-hasan",
      website: "naimul.dev"
    },
    projects: [
      {
        title: "SkillSync API",
        description: "REST backend for a career platform — Node, Express, MongoDB, JWT.",
        techStack: ["Node.js", "MongoDB"]
      },
      {
        title: "E-commerce Backend",
        description: "Scalable API with payment integration and admin dashboard.",
        techStack: ["Express", "Stripe"]
      }
    ],
    skills: ["JavaScript", "Node.js", "MongoDB", "Express", "REST", "Git"],
    certifications: [
      { name: "Meta Backend Developer (Coursera)" },
      { name: "MongoDB University M001" }
    ]
  };

  // Open Edit Modal with current active portfolio data
  const handleOpenEditModal = () => {
    const certNames = (activePortfolio.certifications || []).map(c => typeof c === 'string' ? c : c.name || '');
    setFormData({
      fullName: activePortfolio.fullName || "",
      title: activePortfolio.title || "",
      university: activePortfolio.university || "",
      avatarInitials: activePortfolio.avatarInitials || "NH",
      employabilityScore: activePortfolio.employabilityScore !== undefined ? activePortfolio.employabilityScore : 76,
      github: activePortfolio.links?.github || "",
      linkedin: activePortfolio.links?.linkedin || "",
      website: activePortfolio.links?.website || "",
      projects: (activePortfolio.projects || []).map(p => ({
        title: p.title || "",
        description: p.description || "",
        techStack: Array.isArray(p.techStack) ? p.techStack : [],
        repoUrl: p.repoUrl || ""
      })),
      skills: Array.isArray(activePortfolio.skills) ? [...activePortfolio.skills] : [],
      certifications: certNames.length > 0 ? certNames : ["Meta Backend Developer (Coursera)", "MongoDB University M001"]
    });
    setIsEditModalOpen(true);
  };

  // Open Add New Portfolio Modal
  const handleOpenAddModal = () => {
    setFormData({
      fullName: "",
      title: "",
      university: "",
      avatarInitials: "",
      employabilityScore: 80,
      github: "",
      linkedin: "",
      website: "",
      projects: [
        {
          title: "New Project",
          description: "Full stack application with modern architecture.",
          techStack: ["React", "Node.js"]
        }
      ],
      skills: ["JavaScript", "React", "Node.js"],
      certifications: ["Full Stack Specialization"]
    });
    setIsAddModalOpen(true);
  };

  // Save changes (Update or Create)
  const handleSavePortfolio = async (isNew = false) => {
    const token = getToken();
    if (!token) return;

    setSaveLoading(true);

    const payload = {
      fullName: formData.fullName || "Naimul Hasan",
      title: formData.title || "Backend Developer",
      university: formData.university || "CSE, BRAC University",
      avatarInitials: formData.avatarInitials || (formData.fullName ? formData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'NH'),
      employabilityScore: Number(formData.employabilityScore) || 76,
      links: {
        github: formData.github,
        linkedin: formData.linkedin,
        website: formData.website
      },
      projects: formData.projects,
      skills: formData.skills,
      certifications: formData.certifications.map(c => ({ name: typeof c === 'string' ? c : c.name }))
    };

    try {
      let res;
      if (isNew) {
        res = await fetch("/api/portfolio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        const portId = activePortfolio._id;
        const endpoint = portId ? `/api/portfolio/${portId}` : "/api/portfolio";
        res = await fetch(endpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        await fetchPortfolios();
        setIsEditModalOpen(false);
        setIsAddModalOpen(false);
        setSaveSuccessToast(isNew ? "✓ New Portfolio Created!" : "✓ Portfolio Saved Successfully!");
        setTimeout(() => setSaveSuccessToast(""), 4000);
      } else {
        const errData = await res.json();
        alert("Failed to save: " + (errData.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error saving portfolio.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400 font-medium">Loading portfolio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full text-white pb-12 relative">
      
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div className="fixed top-6 right-6 bg-emerald-950/90 border border-emerald-500 text-emerald-300 px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <span>{saveSuccessToast}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <p className="text-xs text-blue-500 font-bold tracking-widest uppercase mb-1">Public Portfolio</p>
          <h1 className="text-3xl font-bold mt-1">Your professional portfolio</h1>
          <p className="text-slate-400 text-sm mt-2">This is what recruiters see. Keep it updated to increase your visibility.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {portfolios.length > 1 && (
            <select
              value={activePortfolioIndex}
              onChange={(e) => setActivePortfolioIndex(Number(e.target.value))}
              className="bg-[#121a2f] text-slate-300 border border-[#334155] rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
            >
              {portfolios.map((p, idx) => (
                <option key={idx} value={idx}>
                  Portfolio {idx + 1}: {p.fullName || 'Draft'}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            id="add-portfolio-btn"
            onClick={handleOpenAddModal}
            className="bg-[#121a2f] hover:bg-[#1e293b] text-slate-200 border border-[#334155] px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <span className="text-blue-400 text-base font-bold">+</span> Add portfolio
          </button>

          <button
            type="button"
            id="edit-portfolio-btn"
            onClick={handleOpenEditModal}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-lg shadow-blue-500/20 whitespace-nowrap flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit portfolio
          </button>
        </div>
      </div>

      {/* Profile Card Banner */}
      <div className="bg-[#121a2f] rounded-2xl border border-[#1e293b] p-6 md:p-8 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Blue Avatar Initials Box */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-3xl md:text-4xl font-extrabold text-white shadow-lg shadow-blue-500/20 shrink-0">
              {activePortfolio.avatarInitials || "NH"}
            </div>

            {/* Name, Title, University & Link Badges */}
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {activePortfolio.fullName || "Naimul Hasan"}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {activePortfolio.title || "Backend Developer"} {activePortfolio.university ? `· ${activePortfolio.university}` : "· CSE, BRAC University"}
              </p>

              {/* Links Pills */}
              <div className="flex flex-wrap items-center gap-2.5 mt-4">
                {activePortfolio.links?.github && (
                  <a
                    href={activePortfolio.links.github.startsWith("http") ? activePortfolio.links.github : `https://${activePortfolio.links.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-[#0b1120] hover:bg-[#1e293b] px-3 py-1.5 rounded-lg border border-[#1e293b] text-slate-300 hover:text-white text-xs transition"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span>{activePortfolio.links.github.replace("https://", "").replace("http://", "")}</span>
                  </a>
                )}

                {activePortfolio.links?.linkedin && (
                  <a
                    href={activePortfolio.links.linkedin.startsWith("http") ? activePortfolio.links.linkedin : `https://${activePortfolio.links.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-[#0b1120] hover:bg-[#1e293b] px-3 py-1.5 rounded-lg border border-[#1e293b] text-slate-300 hover:text-white text-xs transition"
                  >
                    <span className="text-[#0077b5] font-bold text-xs">in</span>
                    <span>{activePortfolio.links.linkedin.replace("https://", "").replace("http://", "").replace("linkedin.com/", "")}</span>
                  </a>
                )}

                {activePortfolio.links?.website && (
                  <a
                    href={activePortfolio.links.website.startsWith("http") ? activePortfolio.links.website : `https://${activePortfolio.links.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-[#0b1120] hover:bg-[#1e293b] px-3 py-1.5 rounded-lg border border-[#1e293b] text-slate-300 hover:text-white text-xs transition"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span>{activePortfolio.links.website.replace("https://", "").replace("http://", "")}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Employability Score Pill Badge */}
          <div className="bg-[#1e293b] px-4 py-2 rounded-full border border-[#334155] text-blue-400 text-xs font-bold shadow-inner shrink-0 self-start md:self-auto">
            {activePortfolio.employabilityScore !== undefined ? activePortfolio.employabilityScore : 76} Employability
          </div>
        </div>
      </div>

      {/* Featured Projects & Skills/Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Featured Projects */}
        <div className="bg-[#121a2f] rounded-2xl border border-[#1e293b] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-white">Featured projects</h3>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">From GitHub</span>
          </div>

          <div className="space-y-4">
            {(activePortfolio.projects || []).map((project, idx) => (
              <div key={idx} className="bg-[#0b1120] p-5 rounded-xl border border-[#1e293b]">
                <h4 className="font-bold text-white text-base">{project.title}</h4>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">{project.description}</p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {(project.techStack || []).map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-[#1e293b] px-3 py-1 rounded-lg text-xs font-medium text-slate-300 border border-[#334155]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Skills & Certifications */}
        <div className="bg-[#121a2f] rounded-2xl border border-[#1e293b] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-white mb-6">Skills &amp; certifications</h3>

            {/* Top Skills */}
            <div className="mb-8">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-3.5">Top Skills</p>
              <div className="flex flex-wrap gap-2">
                {(activePortfolio.skills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-[#0b1120] px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 border border-[#1e293b]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-3.5">Certifications</p>
              <ul className="space-y-3 text-sm text-slate-300">
                {(activePortfolio.certifications || []).map((cert, idx) => {
                  const certName = typeof cert === "string" ? cert : cert.name;
                  return (
                    <li key={idx} className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span>{certName}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Edit / Add Portfolio Modal */}
      {(isEditModalOpen || isAddModalOpen) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121a2f] border border-[#1e293b] rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-white">
            
            <div className="flex justify-between items-center mb-6 border-b border-[#1e293b] pb-4">
              <h2 className="text-xl font-bold text-white">
                {isAddModalOpen ? "Add New Portfolio" : "Edit Professional Portfolio"}
              </h2>
              <button
                onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); }}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 text-sm">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Naimul Hasan"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Job Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Backend Developer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">University / Dept</label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="CSE, BRAC University"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Employability Score</label>
                  <input
                    type="number"
                    value={formData.employabilityScore}
                    onChange={(e) => setFormData({ ...formData, employabilityScore: e.target.value })}
                    className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="76"
                  />
                </div>
              </div>

              {/* Links */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Social Links (GitHub, LinkedIn, Website)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="bg-[#0b1120] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="github.com/username"
                  />
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="bg-[#0b1120] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="in/username"
                  />
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="bg-[#0b1120] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="yourdomain.dev"
                  />
                </div>
              </div>

              {/* Projects */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-slate-400 text-xs font-semibold">Featured Projects</label>
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      projects: [...formData.projects, { title: "New Project", description: "Project summary...", techStack: ["Node.js"] }]
                    })}
                    className="text-blue-400 text-xs hover:underline font-bold"
                  >
                    + Add Project
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.projects.map((proj, pIdx) => (
                    <div key={pIdx} className="bg-[#0b1120] p-4 rounded-xl border border-[#1e293b] relative">
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          projects: formData.projects.filter((_, i) => i !== pIdx)
                        })}
                        className="absolute top-2 right-3 text-slate-500 hover:text-red-400 text-xs"
                      >
                        ✕ Remove
                      </button>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...formData.projects];
                          updated[pIdx].title = e.target.value;
                          setFormData({ ...formData, projects: updated });
                        }}
                        className="w-full bg-[#121a2f] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-white font-bold mb-2 focus:outline-none"
                        placeholder="Project Title"
                      />
                      <textarea
                        value={proj.description}
                        onChange={(e) => {
                          const updated = [...formData.projects];
                          updated[pIdx].description = e.target.value;
                          setFormData({ ...formData, projects: updated });
                        }}
                        rows={2}
                        className="w-full bg-[#121a2f] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-300 mb-2 focus:outline-none"
                        placeholder="Project description..."
                      />
                      <input
                        type="text"
                        value={Array.isArray(proj.techStack) ? proj.techStack.join(", ") : ""}
                        onChange={(e) => {
                          const updated = [...formData.projects];
                          updated[pIdx].techStack = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                          setFormData({ ...formData, projects: updated });
                        }}
                        className="w-full bg-[#121a2f] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-400 focus:outline-none"
                        placeholder="Tech stack (comma separated, e.g. Node.js, MongoDB)"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills & Certifications */}
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">
                  Top Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skills.join(", ")}
                  onChange={(e) => setFormData({
                    ...formData,
                    skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="JavaScript, Node.js, MongoDB, Express, REST, Git"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">
                  Certifications (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.certifications.join(", ")}
                  onChange={(e) => setFormData({
                    ...formData,
                    certifications: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="Meta Backend Developer (Coursera), MongoDB University M001"
                />
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-3 mt-8 border-t border-[#1e293b] pt-4">
              <button
                type="button"
                onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); }}
                className="bg-[#0b1120] hover:bg-[#1e293b] px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSavePortfolio(isAddModalOpen)}
                disabled={saveLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition shadow-lg shadow-blue-500/20"
              >
                {saveLoading ? "Saving..." : "Save Portfolio"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}