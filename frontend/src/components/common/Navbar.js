export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Brand / Logo Area */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-blue-600 tracking-tight">SkillSync</span>
      </div>
      
      {/* Right side actions / Profile */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-600">Student Workspace</span>
        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-700">
          NH
        </div>
      </div>
    </header>
  );
}
