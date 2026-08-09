import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: ReactNode;
  adminOnly?: boolean;
}) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center py-20">Loading...</div>;

  const stored = localStorage.getItem("user");
  let effectiveUser = user;
  if (!effectiveUser && stored) {
    try {
      effectiveUser = JSON.parse(stored);
    } catch {
      localStorage.removeItem("user");
    }
  }

  if (!effectiveUser) return <Navigate to="/login" replace />;

  if (adminOnly && effectiveUser.role !== "ADMIN") return <Navigate to="/" replace />;

  return <>{children}</>;
}
