import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="h-16 w-full flex items-center justify-between border-b border-[#1e293b] px-6 lg:px-10 shrink-0">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="flex items-center bg-[#1e293b]/50 border border-[#334155] rounded-lg px-3 py-2 w-full transition-colors focus-within:border-blue-500/50">
          <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search jobs, skills, companies..."
            className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-500 w-full"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notification bell */}
        <Link
          href="/student/notifications"
          aria-label="Notifications"
          className="relative p-2 rounded-lg bg-[#1e293b]/50 text-slate-400 hover:text-white transition-colors border border-[#334155] hover:border-slate-500 flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 border border-[#0f172a] rounded-full"></span>
        </Link>

        {/* Avatar */}
        <div className="h-9 w-9 rounded-lg bg-blue-500 flex items-center justify-center text-sm font-bold text-white shadow-lg cursor-pointer hover:bg-blue-600 transition-colors">
          NH
        </div>
      </div>
    </header>
  );
}
