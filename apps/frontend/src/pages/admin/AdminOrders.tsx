import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";

const STATUSES = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

interface AdminOrder {
  id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  address: string;
  createdAt: string;
  user: { name: string; email: string; phone: string };
  items: { id: string; quantity: number; price: number; product: { name: string } }[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  const loadOrders = () => {
    adminApi.get("/orders/all").then((res) => setOrders(res.data));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await adminApi.put(`/orders/${id}/status`, { status });
    loadOrders();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-500">
                  {order.user?.name} · {order.user?.phone}
                </p>
                <p className="text-sm text-gray-500">{order.address}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {order.items.map((item) => (
              <div key={item.id} className="text-sm flex justify-between py-0.5">
                <span>
                  {item.product.name} x{item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 flex justify-between font-semibold text-sm">
              <span>Total (Payment: {order.paymentStatus})</span>
              <span>₹{order.totalAmount.toFixed(0)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
