export default function Sidebar() {
  // Simple data structure for navigation links
  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Career Readiness', href: '/readiness' },
    { name: 'Job Matches', href: '/jobs' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Applications', href: '/applications' },
  ];

  return (
    <aside className="w-64 flex-col border-r border-slate-200 bg-slate-50 hidden md:flex h-full min-h-[calc(100vh-4rem)]">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          >
            {item.name}
          </a>
        ))}
      </nav>
      
      <div className="mt-auto p-4 border-t border-slate-200">
        <a href="/settings" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors">
          Settings
        </a>
      </div>
    </aside>
  );
}
