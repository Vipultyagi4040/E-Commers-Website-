import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../services/api";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "ADMIN";
}

interface AdminContextType {
  admin: AdminUser | null;
  loading: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    const token = localStorage.getItem("adminToken");
    if (stored && token) {
      try {
        setAdmin(JSON.parse(stored));
      } catch {
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken");
      }
    }
    setLoading(false);
  }, []);

  const adminLogin = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const user = res.data.user as AdminUser;
    if (user.role !== "ADMIN") {
      throw new Error("Access denied. Not an admin account.");
    }
    localStorage.setItem("adminToken", res.data.token);
    localStorage.setItem("adminUser", JSON.stringify(user));
    setAdmin(user);
  };

  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, loading, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};
