import DashboardShell from "@/components/common/DashboardShell";
import ProtectedRoute from "@/components/common/ProtectedRoute";

// Applies to /recommendations via Next.js nested layouts, same pattern as
// the jobs and applications routes.
export default function RecommendationsLayout({ children }) {
  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
