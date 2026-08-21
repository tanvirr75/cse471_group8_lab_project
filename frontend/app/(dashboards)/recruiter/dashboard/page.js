'use client';

export default function RecruiterDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Recruiter Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">Job Postings</h2>
            <p className="text-slate-600 dark:text-slate-400">Manage your active job postings and create new opportunities.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">Candidate Screening</h2>
            <p className="text-slate-600 dark:text-slate-400">Review AI-matched candidates and send interview invitations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
