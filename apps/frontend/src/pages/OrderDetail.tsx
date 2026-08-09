import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Order } from "../types";

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PACKED: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_FLOW = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Order Placed",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => navigate("/orders"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      await api.put(`/orders/${order!.id}/status`, { status: "CANCELLED" });
      setOrder({ ...order!, status: "CANCELLED" });
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!order) return <div className="text-center py-20">Order not found</div>;

  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate("/orders")} className="text-sm text-warmGray hover:text-brand mb-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to Orders
            </button>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-brand">Order #{order.id.slice(0, 8)}</h1>
          </div>
          <span className={`text-sm font-medium px-4 py-1.5 rounded-full border ${statusColor[order.status] || "bg-gray-100"}`}>
            {order.status}
          </span>
        </div>

        {!isCancelled && (
          <div className="bg-white rounded-lg p-6 md:p-8 border border-gray-100 mb-6">
            <h3 className="font-heading font-semibold text-lg text-brand mb-6">Order Status</h3>
            <div className="flex items-center justify-between">
              {STATUS_FLOW.map((status, index) => (
                <div key={status} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all ${
                    index <= currentStatusIndex ? "bg-brand text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {index <= currentStatusIndex ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <p className={`text-xs text-center font-medium ${index <= currentStatusIndex ? "text-brand" : "text-gray-400"}`}>
                    {STATUS_LABELS[status]}
                  </p>
                  {index < STATUS_FLOW.length - 1 && (
                    <div className={`hidden md:block absolute h-0.5 w-full mt-[-28px] ${index < currentStatusIndex ? "bg-brand" : "bg-gray-100"}`} style={{ width: "100%", position: "absolute", left: "50%", transform: "translateX(50%)", zIndex: -1 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-6 mb-6 text-center">
            <div className="text-4xl mb-2">❌</div>
            <h3 className="font-heading font-semibold text-red-700 text-lg">Order Cancelled</h3>
            <p className="text-red-600 text-sm mt-1">This order has been cancelled.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 border border-gray-100">
            <h3 className="font-heading font-semibold text-brand mb-4">Order Information</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">Date: <span className="text-brand font-medium">{new Date(order.createdAt).toLocaleString("en-IN")}</span></p>
              <p className="text-gray-600">Payment: <span className="text-brand font-medium">{order.paymentStatus} ({order.paymentMethod})</span></p>
              <p className="text-gray-600">Address: <span className="text-brand font-medium">{order.address}</span></p>
              {order.discount > 0 && <p className="text-green-600">Discount: -₹{order.discount.toFixed(0)}</p>}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-100">
            <h3 className="font-heading font-semibold text-brand mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-brand text-sm">{item.product?.name || "Product"}</p>
                    <p className="text-xs text-warmGray">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <span className="font-semibold text-sm">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-brand">₹{order.totalAmount.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate("/orders")} className="btn-secondary">
            Back to Orders
          </button>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
          {(order.status === "PENDING" || order.status === "CONFIRMED") && (
            <button onClick={handleCancel} disabled={cancelling} className="border border-red-500 text-red-500 px-6 py-3 rounded font-medium hover:bg-red-50 transition-colors disabled:opacity-50">
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
