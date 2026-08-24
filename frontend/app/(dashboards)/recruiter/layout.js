import ProtectedRoute from "../../../src/components/common/ProtectedRoute";

export default function Layout({ children }) {
  return <ProtectedRoute allowedRoles={['recruiter']}>{children}</ProtectedRoute>;
}
