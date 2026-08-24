"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/portfolio/me", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => {
        if (res.status === 404) return null;
        return res.json();
      })
      .then((data) => {
        if (data) setPortfolio(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token, router]);

  if (loading) return <div className="text-white p-6">Loading portfolio...</div>;

  // Dummy data (fallback for design preview)
  const dummyData = {
    avatarInitials: "NH",
    fullName: "Naimul Hasan",
    title: "Backend Developer",
    university: "CSE, BRAC University",
    employabilityScore: 76,
    links: {
      github: "github.com/naimul",
      linkedin: "in/naimul-hasan",
      website: "naimul.dev"
    },
    projects: [
      { title: "SkillSync API", description: "REST backend for a career platform — Node, Express, MongoDB, JWT.", techStack: ["Node.js", "MongoDB"] },
      { title: "E-commerce Backend", description: "Scalable API with payment integration and admin dashboard.", techStack: ["Express", "Stripe"] }
    ],
    skills: ["JavaScript", "Node.js", "MongoDB", "Express", "REST", "Git"],
    certifications: ["Meta Backend Developer (Coursera)", "MongoDB University M001"]
  };

  const data = portfolio || dummyData;

  return (
    <div className="max-w-5xl mx-auto w-full text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <p className="text-xs text-blue-500 font-semibold tracking-widest uppercase mb-1">Public Portfolio</p>
          <h1 className="text-3xl font-bold">Your professional portfolio</h1>
          <p className="text-slate-400 text-sm mt-2">This is what recruiters see. Keep it updated to increase your visibility.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl text-sm font-medium transition shadow-lg shadow-blue-500/20 whitespace-nowrap">
          ✏️ Edit portfolio
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-surface-dark rounded-2xl border border-border-dark p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-inner">
            {data.avatarInitials}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{data.fullName}</h2>
            <p className="text-slate-300 mt-1">{data.title} — {data.university}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-slate-400 text-sm">
              {data.links?.github && <span className="flex items-center gap-2">🐙 {data.links.github}</span>}
              {data.links?.linkedin && <span className="flex items-center gap-2">🔗 {data.links.linkedin}</span>}
              {data.links?.website && <span className="flex items-center gap-2">🌐 {data.links.website}</span>}
            </div>
          </div>
          <div className="bg-blue-900/30 px-4 py-2 rounded-full border border-blue-800/50 text-blue-400 text-sm font-bold shadow-sm mt-4 md:mt-0">
            {data.employabilityScore} Employability
          </div>
        </div>
      </div>

      {/* Projects & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        {/* Featured Projects */}
        <div className="bg-surface-dark rounded-2xl border border-border-dark p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-white">Featured projects</h3>
            <span className="text-xs text-slate-400 px-2 py-1 bg-background-dark rounded-md">From GitHub</span>
          </div>
          <div className="space-y-4">
            {data.projects?.map((p, idx) => (
              <div key={idx} className="bg-background-dark p-5 rounded-xl border border-border-dark">
                <h4 className="font-bold text-blue-400 text-base">{p.title}</h4>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">{p.description}</p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {p.techStack?.map((tech, tIdx) => (
                    <span key={tIdx} className="bg-surface-dark px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 border border-border-dark">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Certifications */}
        <div className="bg-surface-dark rounded-2xl border border-border-dark p-6 shadow-sm h-fit">
          <h3 className="font-bold text-lg text-white mb-6">Skills & certifications</h3>
          
          <div className="mb-8">
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-3">Top Skills</p>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((s, idx) => (
                <span key={idx} className="bg-background-dark px-3.5 py-1.5 rounded-full text-sm font-medium text-slate-300 border border-border-dark hover:border-blue-500/50 transition-colors cursor-default">
                  {s}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-3">Certifications</p>
            <ul className="space-y-2">
              {data.certifications?.map((c, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 bg-background-dark p-3 rounded-lg border border-border-dark">
                  <span className="text-emerald-500 mt-0.5">🏆</span>
                  <span className="font-medium">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}