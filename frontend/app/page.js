import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-slate-200/20 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-2xl tracking-tight bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            SkillSync
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/jobs"
              className="text-sm font-medium hover:text-indigo-500 transition-colors hidden sm:block"
            >
              Browse Jobs
            </Link>
            <Link 
              href="/login"
              className="text-sm font-medium hover:text-indigo-500 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/register"
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-all shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute top-40 -right-20 w-72 h-72 bg-pink-500/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Unlock your career potential with{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The ultimate recruitment and career development platform connecting students, recruiters, and universities through smart matching and AI-driven insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/register?role=student"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              I am a Student
            </Link>
            <Link 
              href="/register?role=recruiter"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 rounded-full font-medium transition-all hover:-translate-y-0.5"
            >
              I am a Recruiter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
