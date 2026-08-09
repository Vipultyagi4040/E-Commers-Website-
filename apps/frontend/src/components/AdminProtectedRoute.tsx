import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAdmin } from "../context/AdminContext";

export default function AdminProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { admin, loading } = useAdmin();

  if (loading) return <div className="text-center py-20">Loading...</div>;

  if (!admin) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}
