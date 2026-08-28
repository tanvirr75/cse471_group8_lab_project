import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardShell({ children }) {
  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden text-slate-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
