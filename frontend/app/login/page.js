'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const data = await loginUser(email, password);
      // Save auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      const userRole = data.role || 'student';
      localStorage.setItem('userRole', userRole);
      
      // Redirect to correct dashboard based on role
      if (userRole === 'student') router.push('/student/dashboard');
      else if (userRole === 'recruiter') router.push('/recruiter/dashboard');
      else if (userRole === 'university') router.push('/university/dashboard');
      else if (userRole === 'admin') router.push('/admin/dashboard');
      else router.push('/jobs');
    } catch (err) {
      setError(err.message || 'Failed to login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#050814] text-slate-50 font-sans">
      
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 border-r border-[#1e293b] relative overflow-hidden bg-[#0a0f1e]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0,transparent_70%)] opacity-50 z-0 pointer-events-none"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="bg-blue-500 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">SkillSync</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md mt-20 mb-auto">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Welcome back. Your career momentum is waiting.
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-12">
            Pick up where you left off — new job matches and score updates since your last visit.
          </p>
        </div>

        <div className="relative z-10 text-sm text-slate-500">
          "SkillSync helped me land my first internship." — CSE student, BRAC
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 xl:p-24 bg-[#0a0a0a]">
        
        {/* Mobile Header (Shows only on small screens) */}
        <div className="w-full max-w-sm mb-12 lg:hidden flex items-center gap-3">
          <div className="bg-blue-500 w-8 h-8 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">SkillSync</span>
        </div>

        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-white mb-2">Log in to SkillSync</h2>
          <p className="text-sm text-slate-400 mb-8">Welcome back — enter your details.</p>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="block w-full px-4 py-3 bg-[#121a2f] border border-[#1e293b] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full px-4 py-3 bg-[#121a2f] border border-[#1e293b] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
              />
            </div>

            <div className="flex items-center justify-between pt-1 pb-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-[#121a2f] border-[#1e293b] rounded text-blue-500 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400 cursor-pointer">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </form>



          <p className="mt-8 text-center text-sm text-slate-400">
            New to SkillSync?{' '}
            <Link href="/register" className="font-semibold text-blue-500 hover:text-blue-400 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
