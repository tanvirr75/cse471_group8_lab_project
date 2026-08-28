import ProtectedRoute from "../../../src/components/common/ProtectedRoute";
<<<<<<< HEAD
import DashboardShell from "../../../src/components/common/DashboardShell";

export default function Layout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['recruiter']}>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
=======

export default function Layout({ children }) {
  return <ProtectedRoute allowedRoles={['recruiter']}>{children}</ProtectedRoute>;
>>>>>>> origin/main
}
