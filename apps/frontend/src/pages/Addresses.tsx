import { useEffect, useState } from "react";
import api from "../services/api";
import { Address } from "../types";

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false });
  const [loading, setLoading] = useState(true);

  const loadAddresses = () => {
    api.get("/addresses").then((res) => setAddresses(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const value = (target as HTMLInputElement).type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setForm({ ...form, [target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/addresses/${editingId}`, form);
      } else {
        await api.post("/addresses", form);
      }
      setForm({ fullName: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false });
      setShowForm(false);
      setEditingId(null);
      loadAddresses();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save address");
    }
  };

  const handleEdit = (addr: Address) => {
    setForm({ fullName: addr.fullName, phone: addr.phone, address: addr.address, city: addr.city, state: addr.state, pincode: addr.pincode, isDefault: addr.isDefault });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    await api.delete(`/addresses/${id}`);
    loadAddresses();
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-brand">My Addresses</h1>
            <p className="text-warmGray mt-1">Manage your delivery addresses</p>
          </div>
          {!showForm && (
            <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ fullName: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false }); }} className="btn-primary text-sm">
              + Add Address
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 border border-gray-100 mb-6">
            <h3 className="font-heading font-semibold text-lg text-brand mb-4">{editingId ? "Edit Address" : "New Address"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required className="input-field" />
              <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required className="input-field" />
              <input name="city" placeholder="City" value={form.city} onChange={handleChange} required className="input-field" />
              <input name="state" placeholder="State" value={form.state} onChange={handleChange} required className="input-field" />
              <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} required className="input-field" />
            </div>
            <textarea name="address" placeholder="Full Address" value={form.address} onChange={handleChange} required rows={3} className="input-field mt-4" />
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} className="w-4 h-4 text-brand-gold rounded focus:ring-brand-gold" />
              <span className="text-sm text-gray-700">Set as default address</span>
            </label>
            <div className="flex gap-3 mt-6">
              <button type="submit" className="btn-primary">{editingId ? "Update" : "Save"} Address</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-brand">
                    {addr.fullName}
                    {addr.isDefault && <span className="ml-2 text-xs bg-brand-gold text-white px-2 py-0.5 rounded">Default</span>}
                  </p>
                  <p className="text-sm text-warmGray mt-1">{addr.phone}</p>
                  <p className="text-sm text-gray-600 mt-1">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(addr)} className="text-sm text-brand-gold hover:underline font-medium">Edit</button>
                  <button onClick={() => handleDelete(addr.id)} className="text-sm text-red-500 hover:underline font-medium">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {addresses.length === 0 && !showForm && (
            <div className="text-center py-12">
              <p className="text-warmGray mb-4">No addresses saved yet</p>
              <button onClick={() => setShowForm(true)} className="btn-primary">Add Your First Address</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
