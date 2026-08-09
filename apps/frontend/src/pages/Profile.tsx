import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, phone: user.phone, currentPassword: "", newPassword: "" });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await api.put("/auth/profile", form);
      const updatedUser = { ...user, ...res.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setForm({ ...form, currentPassword: "", newPassword: "" });
      setMessage("Profile updated successfully");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Update failed");
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-heading font-bold text-brand mb-8">My Profile</h1>

        <div className="bg-white rounded-lg p-6 md:p-8 border border-gray-100 mb-6">
          <h2 className="font-heading font-semibold text-xl text-brand mb-6">Account Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={user.email} disabled className="input-field bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="input-field" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary">Save Changes</button>
              {message && <span className="text-green-600 text-sm self-center">{message}</span>}
              {error && <span className="text-red-500 text-sm self-center">{error}</span>}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg p-6 md:p-8 border border-gray-100 mb-6">
          <h2 className="font-heading font-semibold text-xl text-brand mb-6">Change Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} placeholder="Enter current password" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="Enter new password" className="input-field" />
            </div>
            <button type="submit" className="btn-secondary">Update Password</button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Link to="/orders" className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="font-heading font-semibold text-brand mb-1">My Orders</h3>
            <p className="text-sm text-warmGray">Track and manage your orders</p>
          </Link>
          <Link to="/wishlist" className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="font-heading font-semibold text-brand mb-1">My Wishlist</h3>
            <p className="text-sm text-warmGray">Your saved items</p>
          </Link>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-100 mb-6">
          <Link to="/addresses" className="flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2">
            <div>
              <h3 className="font-heading font-semibold text-brand mb-1">My Addresses</h3>
              <p className="text-sm text-warmGray">Manage delivery addresses</p>
            </div>
            <svg className="w-5 h-5 text-warmGray" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>

        <button onClick={logout} className="text-red-500 font-medium hover:underline">Logout</button>
      </div>
    </div>
  );
}
