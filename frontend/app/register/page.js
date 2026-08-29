'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api';
import { GraduationCap, Briefcase, Building2, Star, LineChart, Target } from 'lucide-react';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'student';
  const router = useRouter();

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [universityName, setUniversityName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const payload = {
        name,
        email,
        password,
        role,
        ...(role === 'recruiter' && { companyName }),
        ...(role === 'university' && { universityName })
      };

      const data = await registerUser(payload);
      
      // Save auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userRole', data.role || role);
      
      // Redirect to correct dashboard based on role
      if (role === 'student') router.push('/student/dashboard');
      else if (role === 'recruiter') router.push('/recruiter/dashboard');
      else if (role === 'university') router.push('/university/dashboard');
      else router.push('/jobs');
      
    } catch (err) {
      setError(err.message || 'Failed to create account');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#050814] text-slate-50 font-sans">
      
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-5/12 xl:w-1/2 flex-col p-12 border-r border-[#1e293b] relative overflow-hidden bg-[#0a0f1e]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15)_0,transparent_60%)] opacity-70 z-0 pointer-events-none"></div>
        
        <div className="relative z-10 flex-1">
          <Link href="/" className="flex items-center gap-3 w-fit mb-24">
            <div className="bg-blue-500 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">SkillSync</span>
          </Link>

          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-16">
            Your AI career co-<br/>pilot, from campus to<br/>career.
          </h1>

          <div className="space-y-10">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-white">Know your score</h3>
                <p className="text-slate-400">Get a 0-100 employability score in minutes.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <LineChart className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-white">Close your gaps</h3>
                <p className="text-slate-400">AI roadmaps tailored to your target role.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-white">Get matched</h3>
                <p className="text-slate-400">Right jobs, ranked by real compatibility.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500 mt-12">
          Join 12,000+ students already on SkillSync
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 xl:p-24 bg-[#0a0a0a] overflow-y-auto">
        
        {/* Mobile Header */}
        <div className="w-full max-w-[440px] mb-8 lg:hidden flex items-center gap-3">
          <div className="bg-blue-500 w-8 h-8 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">SkillSync</span>
        </div>

        <div className="w-full max-w-[440px]">
          <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
          <p className="text-sm text-slate-400 mb-8">Start with your role — you can change it later.</p>

          {/* Role Selector Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
            {[
              { id: 'student', icon: GraduationCap, title: "I'm a Student", subtitle: 'Build & get hired' },
              { id: 'recruiter', icon: Briefcase, title: "I'm a Recruiter", subtitle: 'Hire talent' },
              { id: 'university', icon: Building2, title: "I'm a University", subtitle: 'Track placements' }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between min-h-[110px] ${
                  role === r.id 
                    ? 'bg-[#121a2f] border-blue-500 ring-1 ring-blue-500 shadow-sm shadow-blue-500/10' 
                    : 'bg-[#0a0a0a] border-[#1e293b] hover:border-slate-600'
                }`}
              >
                <r.icon className={`w-5 h-5 mb-2 ${role === r.id ? 'text-blue-400' : 'text-slate-500'}`} />
                <div>
                  <div className={`font-semibold text-sm ${role === r.id ? 'text-white' : 'text-slate-300'}`}>{r.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{r.subtitle}</div>
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="block w-full px-4 py-3 bg-[#121a2f] border border-[#1e293b] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full px-4 py-3 bg-[#121a2f] border border-[#1e293b] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
              />
            </div>

            {role === 'recruiter' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="block w-full px-4 py-3 bg-[#121a2f] border border-[#1e293b] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                />
              </div>
            )}

            {role === 'university' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">University Name</label>
                <input
                  type="text"
                  required
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="block w-full px-4 py-3 bg-[#121a2f] border border-[#1e293b] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full px-4 py-3 bg-[#121a2f] border border-[#1e293b] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center mt-6 py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>



          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-500 hover:text-blue-400 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
