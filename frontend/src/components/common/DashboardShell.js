import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

// Shared dark dashboard shell (Navbar + Sidebar) for the jobs and
// applications routes. Kept out of the public landing page, which has its
// own separate theme and layout.
export default function DashboardShell({ children }) {
  return (
    <div className="min-h-screen bg-background-dark">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
