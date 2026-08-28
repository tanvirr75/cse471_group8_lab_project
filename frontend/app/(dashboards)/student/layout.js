import ProtectedRoute from "../../../src/components/common/ProtectedRoute";
import DashboardShell from "../../../src/components/common/DashboardShell";

export default function Layout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
