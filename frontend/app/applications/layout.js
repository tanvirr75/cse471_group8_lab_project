import DashboardShell from "@/components/common/DashboardShell";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function ApplicationsLayout({ children }) {
  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
