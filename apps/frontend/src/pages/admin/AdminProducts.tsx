import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";
import { Product, Category } from "../../types";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  discount: "0",
  stock: "",
  sizes: "",
  colors: "",
  categoryId: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState<FileList | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        adminApi.get("/products?limit=100"),
        adminApi.get("/categories"),
      ]);
      setProducts(productsRes.data.products);
      setCategories(categoriesRes.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      if (images) {
        Array.from(images).forEach((file) => fd.append("images", file));
      }
      if (editingId) {
        await adminApi.put(`/products/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await adminApi.post("/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setForm(emptyForm);
      setImages(null);
      setShowForm(false);
      setEditingId(null);
      loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save product");
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      discount: String(product.discount),
      stock: String(product.stock),
      sizes: product.sizes?.join(",") || "",
      colors: product.colors?.join(",") || "",
      categoryId: product.categoryId,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await adminApi.delete(`/products/${id}`);
    loadData();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div>
      {/* Header Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-100 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-brand">Products</h1>
            <p className="text-warmGray mt-1">
              {products.length} product{products.length !== 1 ? "s" : ""} in your store
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full lg:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300"
            >
              + Add Product
            </button>
          )}
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg p-6 border border-gray-100 mb-8">
          <h3 className="font-heading font-semibold text-xl text-brand mb-6">
            {editingId ? "Edit Product" : "New Product"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  name="name"
                  placeholder="e.g. Premium Cotton Shirt"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  name="price"
                  type="number"
                  placeholder="899"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                <input
                  name="discount"
                  type="number"
                  placeholder="0"
                  value={form.discount}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  name="stock"
                  type="number"
                  placeholder="50"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
                <input
                  name="sizes"
                  placeholder="S, M, L, XL"
                  value={form.sizes}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma separated)</label>
                <input
                  name="colors"
                  placeholder="Red, Blue, Black"
                  value={form.colors}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(e.target.files)}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Product description..."
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="input-field"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingId ? "Update Product" : "Save Product"}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-ivory">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Product Name</th>
                <th className="text-left p-4 font-medium text-gray-700">Category</th>
                <th className="text-left p-4 font-medium text-gray-700">Price</th>
                <th className="text-left p-4 font-medium text-gray-700">Discount</th>
                <th className="text-left p-4 font-medium text-gray-700">Stock</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-brand">{p.name}</td>
                  <td className="p-4 text-warmGray">{p.category?.name}</td>
                  <td className="p-4 font-medium">₹{p.price}</td>
                  <td className="p-4">
                    {p.discount > 0 ? (
                      <span className="text-green-600 font-medium">{p.discount}%</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={p.stock < 10 ? "text-red-600 font-medium" : ""}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-brand-gold hover:underline font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-500 hover:underline font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-warmGray">
                    No products yet. Click "+ Add Product" to create your first product.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
