'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { registerUser } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'student';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  
  // Generalized fields
  const [githubUsername, setGithubUsername] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  
  // Student fields
  const [university, setUniversity] = useState('');
  const [department, setDepartment] = useState('');
  const [targetRole, setTargetRole] = useState('');
  
  // Recruiter fields
  const [companyName, setCompanyName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
        githubUsername,
        linkedinUrl,
        ...(role === 'student' && { university, department, targetRole }),
        ...(role === 'recruiter' && { companyName })
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl shadow-slate-200/20 dark:shadow-none sm:rounded-2xl sm:px-10 border border-slate-100 dark:border-slate-800">
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                    role === 'student'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                    role === 'recruiter'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Recruiter
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg sm:text-sm dark:bg-slate-800 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg sm:text-sm dark:bg-slate-800 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg sm:text-sm dark:bg-slate-800 dark:text-white" />
            </div>

            {/* Generalized Social Links */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">LinkedIn Profile URL</label>
              <input type="text" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/username" className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg sm:text-sm dark:bg-slate-800 dark:text-white" />
            </div>

            {role === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">GitHub Username</label>
                  <input type="text" value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} placeholder="e.g. torvalds" className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg sm:text-sm dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">University</label>
                  <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="e.g. MIT" className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg sm:text-sm dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Department / Major</label>
                  <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Computer Science" className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg sm:text-sm dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Target Role (Career Goal)</label>
                  <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Software Engineer" className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg sm:text-sm dark:bg-slate-800 dark:text-white" />
                </div>
              </>
            )}

            {role === 'recruiter' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Company Name</label>
                <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Tech Corp" className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg sm:text-sm dark:bg-slate-800 dark:text-white" />
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
