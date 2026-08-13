// Theme updated to match the approved dark dashboard mockups - the public
// landing page (app/page.js) has its own separate theme and is not part of this.
export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border-dark bg-surface-dark px-6">
      {/* Brand / Logo Area */}
      <div className="flex items-center gap-6">
        <span className="text-xl font-bold text-primary tracking-tight">SkillSync</span>

        {/* Search input - visual only for now, no search logic wired up yet */}
        <input
          type="text"
          placeholder="Search jobs, skills, companies..."
          className="hidden md:block w-72 rounded-md border border-border-dark bg-background-dark px-3 py-1.5 text-sm text-text-light placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Right side actions / Profile */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-text-muted">Student Workspace</span>

        {/* Notification bell - visual only, no notifications wired up yet */}
        <button
          type="button"
          aria-label="Notifications"
          className="text-lg text-text-muted hover:text-text-light transition-colors"
        >
          🔔
        </button>

        <div className="h-8 w-8 rounded-full bg-border-dark flex items-center justify-center text-sm font-medium text-text-light">
          NH
        </div>
      </div>
    </header>
  );
}
