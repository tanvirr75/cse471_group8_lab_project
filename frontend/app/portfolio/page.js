"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

    fetch("http://localhost:5002/api/portfolio/me", {
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

  if (loading) return <div className="min-h-screen bg-[#0b1120] text-white p-6">Loading portfolio...</div>;

  // ডামি ডাটা (যদি ব্যাকএন্ডে ডাটা না থাকে, তাহলে ডিজাইন দেখানোর জন্য)
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
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">📄 Resume Analysis</div>
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">💼 Job Matches</div>
          <div className="flex items-center gap-3 text-blue-400 font-semibold bg-[#1e293b] p-2 rounded-lg cursor-pointer">📁 Portfolio</div>
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">✅ Applications</div>
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">🔔 Notifications</div>
          <div className="flex items-center gap-3 hover:text-white cursor-pointer">⚙️ Settings</div>
        </div>
      </div>

      {/* মূল কন্টেন্ট */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* টপ বার */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div className="flex-1">
            <div className="bg-[#1e293b] rounded-full px-4 py-2 flex items-center gap-2 text-sm text-gray-400 w-full max-w-md">
              <span>🔍</span>
              <input type="text" placeholder="Search jobs, skills, companies..." className="bg-transparent outline-none w-full text-white" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#1e293b] p-2 rounded-full cursor-pointer">🔔</div>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm cursor-pointer">{data.avatarInitials}</div>
          </div>
        </div>

        {/* পোর্টফোলিও কন্টেন্ট */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-xs text-blue-500 font-semibold tracking-widest uppercase">Public Portfolio</p>
                <h1 className="text-3xl font-bold mt-1">Your professional portfolio</h1>
                <p className="text-gray-400 text-sm mt-1">This is what recruiters see. Keep it updated to increase your visibility.</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2">
                ✏️ Edit portfolio
              </button>
            </div>

            {/* প্রোফাইল কার্ড */}
            <div className="bg-[#131b2e] rounded-2xl border border-gray-800 p-8 mb-8 shadow-lg">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-blue-500 flex items-center justify-center text-3xl font-bold text-white">
                  {data.avatarInitials}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{data.fullName}</h2>
                  <p className="text-gray-300">{data.title} — {data.university}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-gray-400 text-sm">
                    <span className="flex items-center gap-1">🐙 {data.links?.github}</span>
                    <span className="flex items-center gap-1">in {data.links?.linkedin}</span>
                    <span className="flex items-center gap-1">🌐 {data.links?.website}</span>
                  </div>
                </div>
                <div className="bg-[#1e293b] px-4 py-1.5 rounded-full border border-blue-900/50 text-blue-400 text-sm font-medium">
                  {data.employabilityScore} Employability
                </div>
              </div>
            </div>

            {/* প্রজেক্ট ও স্কিলস */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Featured Projects */}
              <div className="bg-[#131b2e] rounded-2xl border border-gray-800 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Featured projects</h3>
                  <span className="text-xs text-gray-400">From GitHub</span>
                </div>
                <div className="space-y-4">
                  {data.projects?.map((p, idx) => (
                    <div key={idx} className="bg-[#1e293b] p-4 rounded-xl border border-gray-700">
                      <h4 className="font-semibold text-blue-400">{p.title}</h4>
                      <p className="text-gray-400 text-sm mt-1">{p.description}</p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {p.techStack?.map((tech, tIdx) => (
                          <span key={tIdx} className="bg-[#0b1120] px-2 py-1 rounded text-xs text-gray-300 border border-gray-700">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills & Certifications */}
              <div className="bg-[#131b2e] rounded-2xl border border-gray-800 p-6">
                <h3 className="font-semibold text-lg mb-2">Skills & certifications</h3>
                <div className="mb-4">
                  <p className="text-xs text-gray-400 uppercase mb-2">Top Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {data.skills?.map((s, idx) => (
                      <span key={idx} className="bg-[#1e293b] px-3 py-1 rounded-full text-xs text-gray-300 border border-gray-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-2">Certifications</p>
                  <ul className="space-y-1 text-sm text-gray-300 list-disc list-inside">
                    {data.certifications?.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}