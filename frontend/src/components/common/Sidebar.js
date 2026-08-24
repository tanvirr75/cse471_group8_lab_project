// Theme updated to match the approved dark dashboard mockups - the public
// landing page (app/page.js) has its own separate theme and is not part of this.
export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', href: '/student/dashboard' },
    { name: 'Portfolio', href: '/student/portfolio' },
    { name: 'Resume Analysis', href: '/student/resume' },
    { name: 'Career Readiness', href: '/student/readiness' },
    { name: 'Job Matches', href: '/jobs' },
    { name: 'Recommendations', href: '/recommendations' },
    { name: 'Applications', href: '/applications' },
  ];

  return (
    <aside className="w-64 flex-col border-r border-border-dark bg-surface-dark hidden md:flex h-full min-h-[calc(100vh-4rem)]">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text-muted hover:bg-background-dark hover:text-text-light transition-colors"
          >
            {item.name}
          </a>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t border-border-dark">
        <a href="/settings" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text-muted hover:bg-background-dark hover:text-text-light transition-colors">
          Settings
        </a>
      </div>
    </aside>
  );
}
