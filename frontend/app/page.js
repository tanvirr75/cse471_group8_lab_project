'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Briefcase, 
  LineChart, 
  Code, 
  FileText, 
  Target, 
  BarChart, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 font-sans overflow-x-hidden selection:bg-blue-500/30">
      {/* Background Pattern - Modern Dash Theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-40 -right-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0f172a]/90 backdrop-blur-md border-b border-[#1e293b] py-4 shadow-lg shadow-[#0b1120]/50' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">SkillSync</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</Link>
            <Link href="#roles" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Ecosystem</Link>
            <Link href="/jobs" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Job Board</Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium hover:text-blue-400 transition-colors">Sign In</Link>
            <Link href="/register" className="text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
              Get Started
            </Link>
          </div>

          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0f172a] pt-24 px-6 flex flex-col gap-6 md:hidden">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold">Features</Link>
            <Link href="#roles" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold">Ecosystem</Link>
            <Link href="/jobs" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold">Job Board</Link>
            <hr className="border-[#1e293b]" />
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg text-slate-400 hover:text-white">Sign In</Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-lg bg-blue-600 text-white px-6 py-3 rounded-xl text-center">Get Started</Link>
        </div>
      )}

      <main className="relative z-10 pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-24 mt-10">
          <motion.div initial="hidden" animate="visible" variants={STAGGER} className="max-w-4xl mx-auto text-center">
            <motion.div variants={FADE_UP} className="inline-block border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold tracking-widest text-blue-400 mb-8 uppercase rounded-full">
              AI Career Intelligence
            </motion.div>
            <motion.h1 variants={FADE_UP} className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-8">
              Turn your skills into a <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">career you&apos;re ready for</span>
            </motion.h1>
            <motion.p variants={FADE_UP} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
              SkillSync analyzes your GitHub, evaluates your resume, and calculates your employability score to seamlessly connect you with the right opportunities.
            </motion.p>
            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register?role=student" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap">
                Analyze my profile — free
              </Link>
              <Link href="/register?role=recruiter" className="w-full sm:w-auto px-8 py-3.5 bg-[#121a2f] border border-[#1e293b] hover:border-slate-500 text-slate-300 rounded-xl font-medium transition-all whitespace-nowrap">
                For recruiters
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Mock UI Snippet Section */}
        <section className="max-w-5xl mx-auto px-6 lg:px-8 mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-[#0b1120] rounded-2xl border border-[#1e293b] shadow-2xl overflow-hidden"
          >
            <div className="border-b border-[#1e293b] bg-[#0b1120] flex items-center px-4 py-3 gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            </div>
            
            {/* Dashboard Mock */}
            <div className="flex h-[350px] md:h-[450px] bg-[#0f172a]">
              {/* Sidebar Mock */}
              <div className="hidden md:flex w-56 flex-col gap-4 border-r border-[#1e293b] p-6 bg-[#0b1120]">
                <div className="h-2 w-20 bg-slate-700 rounded mb-4"></div>
                <div className="h-6 w-full bg-[#1e293b] rounded-md"></div>
                <div className="h-6 w-5/6 bg-slate-800/50 rounded-md"></div>
                <div className="h-6 w-4/6 bg-slate-800/50 rounded-md"></div>
                <div className="h-6 w-5/6 bg-slate-800/50 rounded-md"></div>
              </div>
              
              {/* Main Content Mock */}
              <div className="flex-1 p-6 md:p-8 flex flex-col gap-6">
                {/* Top Stats */}
                <div className="flex gap-4">
                  <div className="h-28 flex-1 bg-[#121a2f] border border-[#1e293b] rounded-xl p-5 flex flex-col justify-between">
                    <div className="h-2 w-16 bg-slate-600 rounded"></div>
                    <div className="h-8 w-24 bg-slate-700 rounded-lg"></div>
                  </div>
                  <div className="h-28 flex-1 bg-[#121a2f] border border-[#1e293b] rounded-xl p-5 flex flex-col justify-between hidden sm:flex">
                    <div className="h-2 w-20 bg-slate-600 rounded"></div>
                    <div className="h-8 w-16 bg-slate-700 rounded-lg"></div>
                  </div>
                  <div className="h-28 flex-1 bg-[#121a2f] border border-[#1e293b] rounded-xl p-5 flex flex-col justify-between hidden md:flex">
                    <div className="h-2 w-24 bg-slate-600 rounded"></div>
                    <div className="h-8 w-20 bg-slate-700 rounded-lg"></div>
                  </div>
                </div>
                
                {/* AI Section Mock */}
                <div className="flex-1 bg-[#121a2f] border border-[#1e293b] rounded-xl p-6 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0,transparent_60%)]"></div>
                  <div className="flex flex-col items-center gap-4 z-10">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin"></div>
                    <p className="text-sm text-slate-400 font-medium">Generating AI Learning Roadmap...</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={STAGGER}
              className="text-center mb-16"
            >
              <h2 className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-3">What You Get</h2>
              <p className="text-3xl md:text-4xl font-bold leading-tight">Everything you need to get hired</p>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">From skill analysis to interview invitations — one intelligent platform.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Employability Score', icon: BarChart, text: 'A 0-100 score built from your skills, GitHub activity, projects, resume and certifications — updated as you grow.' },
                { title: 'AI Skill Gap & Roadmap', icon: LineChart, text: 'See exactly which skills you\'re missing for your target role and get a step-by-step learning plan to close them.' },
                { title: 'Smart Job Matching', icon: Target, text: 'Get matched to jobs by compatibility percentage and be notified the moment a role fits your profile above 80%.' },
                { title: 'GitHub Integration', icon: Code, text: 'Connect your GitHub to auto-import repos, languages and contribution history — no manual data entry.' },
                { title: 'Resume Analysis', icon: FileText, text: 'Upload your resume and get AI feedback on structure, keywords and weak sections — before recruiters see it.' },
                { title: 'University Analytics', icon: Building2, text: 'Career centers track employability and placement readiness across departments with live dashboards.' }
              ].map((feature, i) => (
                <motion.div 
                  key={i} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true, margin: "-50px" }}
                  variants={FADE_UP}
                  className="bg-[#121a2f] p-8 rounded-2xl border border-[#1e293b] hover:border-slate-600 transition-colors shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Roles Section (Ecosystem) */}
        <section id="roles" className="py-24 bg-[#0b1120] border-y border-[#1e293b]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={STAGGER}
              className="text-center mb-16"
            >
              <h2 className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-3">Built for Everyone</h2>
              <p className="text-3xl md:text-4xl font-bold leading-tight">One platform, four roles</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Students', icon: GraduationCap, desc: 'Build portfolios, analyze readiness, apply to jobs.' },
                { title: 'Recruiters', icon: Briefcase, desc: 'Post jobs, screen candidates, send invitations.' },
                { title: 'Universities', icon: Building2, desc: 'Track placement readiness with analytics.' },
                { title: 'Admins', icon: ShieldCheck, desc: 'Verify recruiters, moderate jobs, manage users.' }
              ].map((role, i) => (
                <motion.div key={i} variants={FADE_UP} className="bg-[#0f172a] p-8 rounded-2xl border border-[#1e293b] text-center shadow-sm">
                  <div className="mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                    <role.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{role.title}</h3>
                  <p className="text-sm text-slate-400">{role.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-[#121a2f] border border-[#1e293b] rounded-3xl p-12 shadow-xl shadow-blue-900/10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to see where you stand?</h2>
              <p className="text-slate-400 mb-10 max-w-lg mx-auto">Get your employability score in under 2 minutes. Free for students, always.</p>
              <Link href="/register" className="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20">
                Get started free
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e293b] py-8 bg-[#0b1120]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-slate-500">
            © 2026 SkillSync — Group 08, CSE471
          </div>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="#" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
