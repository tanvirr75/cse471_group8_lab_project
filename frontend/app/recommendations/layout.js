import DashboardShell from "@/components/common/DashboardShell";

// Applies to /recommendations via Next.js nested layouts, same pattern as
// the jobs and applications routes.
export default function RecommendationsLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
