import DashboardShell from "../../components/common/DashboardShell";

// Applies to both /jobs and /jobs/[id] via Next.js nested layouts.
export default function JobsLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
