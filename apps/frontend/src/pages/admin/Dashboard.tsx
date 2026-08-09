import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  lowStockItems: { id: string; name: string; stock: number }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    adminApi.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  const cards = [
    { label: "Total Products", value: stats.totalProducts },
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Total Customers", value: stats.totalCustomers },
    { label: "Total Revenue", value: `₹${stats.totalRevenue.toFixed(0)}` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-3">Low Stock Items</h2>
      {stats.lowStockItems.length === 0 ? (
        <p className="text-gray-500">All products are well stocked 👍</p>
      ) : (
        <ul className="space-y-2">
          {stats.lowStockItems.map((item) => (
            <li key={item.id} className="flex justify-between border-b pb-2">
              <span>{item.name}</span>
              <span className="text-orange-600 font-medium">{item.stock} left</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
