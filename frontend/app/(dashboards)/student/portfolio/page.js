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
    <div className="max-w-5xl mx-auto w-full text-white pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <p className="text-xs text-blue-500 font-bold tracking-widest uppercase mb-1">Public Portfolio</p>
          <h1 className="text-3xl font-bold mt-1">Your professional portfolio</h1>
          <p className="text-slate-400 text-sm mt-2">This is what recruiters see. Keep it updated to increase your visibility.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl text-sm font-bold transition shadow-lg shadow-blue-500/20 whitespace-nowrap flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          Edit portfolio
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-[#121a2f] rounded-2xl border border-[#1e293b] p-6 md:p-8 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-blue-500 flex items-center justify-center text-4xl font-bold text-white shadow-inner shrink-0">
            {data.avatarInitials}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{data.fullName}</h2>
            <p className="text-slate-400 mt-1">{data.title} • {data.university}</p>
            <div className="flex flex-wrap gap-3 mt-4 text-slate-300 text-xs">
              {data.links?.github && <span className="flex items-center gap-2 bg-[#0b1120] px-3 py-1.5 rounded border border-[#1e293b]"><svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>{data.links.github}</span>}
              {data.links?.linkedin && <span className="flex items-center gap-2 bg-[#0b1120] px-3 py-1.5 rounded border border-[#1e293b]">{data.links.linkedin}</span>}
              {data.links?.website && <span className="flex items-center gap-2 bg-[#0b1120] px-3 py-1.5 rounded border border-[#1e293b]">{data.links.website}</span>}
            </div>
          </div>
          <div className="bg-[#1e293b] px-4 py-1.5 rounded-full border border-[#334155] text-blue-400 text-xs font-bold shadow-sm mt-4 md:mt-0 shrink-0">
            {data.employabilityScore} Employability
          </div>
        </div>
      </div>

      {/* Projects & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        {/* Featured Projects */}
        <div className="bg-[#121a2f] rounded-2xl border border-[#1e293b] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-white">Featured projects</h3>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">From GitHub</span>
          </div>
          <div className="space-y-4">
            {data.projects?.map((p, idx) => (
              <div key={idx} className="bg-[#0b1120] p-5 rounded-xl border border-[#1e293b]">
                <h4 className="font-bold text-white text-base">{p.title}</h4>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">{p.description}</p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {p.techStack?.map((tech, tIdx) => (
                    <span key={tIdx} className="bg-[#1e293b] px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 border border-[#334155]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Certifications */}
        <div className="bg-[#121a2f] rounded-2xl border border-[#1e293b] p-6 shadow-sm h-fit">
          <h3 className="font-bold text-lg text-white mb-6">Skills & certifications</h3>
          
          <div className="mb-8">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-4">Top Skills</p>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((s, idx) => (
                <span key={idx} className="bg-[#0b1120] px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-400 border border-[#1e293b]">
                  {s}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-4">Certifications</p>
            <ul className="space-y-3 text-sm text-slate-400 list-inside">
              {data.certifications?.map((c, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0"></span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}