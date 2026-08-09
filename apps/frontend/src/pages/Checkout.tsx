import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { Address, ProductImage } from "../types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PLACEHOLDER = "https://placehold.co/600x800/1a1a1a/c9a24b?text=No+Image";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.price * (1 - item.product.discount / 100);
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal > 1499 ? 0 : 99;
  const total = Math.max(subtotal + shipping - discount, 0);

  useEffect(() => {
    api.get("/addresses").then((res) => {
      setAddresses(res.data);
      const defaultAddr = res.data.find((a: Address) => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    });
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await api.post("/coupons/validate/" + couponCode.toUpperCase(), { orderAmount: subtotal });
      setAppliedCoupon(res.data);
      setDiscount(Number(res.data.discount));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
      setDiscount(0);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId && !address.trim()) {
      setError("Please select or enter a delivery address");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const finalAddress = selectedAddressId
        ? addresses.find((a) => a.id === selectedAddressId)?.address || address
        : address;

      const orderRes = await api.post("/orders", {
        address: finalAddress,
        couponId: appliedCoupon?.code,
      });
      const order = orderRes.data;

      if (paymentMethod === "cod") {
        await api.put(`/orders/${order.id}/status`, { status: "CONFIRMED" });
        await fetchCart();
        navigate("/orders");
        return;
      }

      try {
        const paymentRes = await api.post("/payments/create", { orderId: order.id });
        const { razorpayOrder, key } = paymentRes.data;

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          setError("Razorpay SDK failed to load. Switching to Cash on Delivery.");
          await api.put(`/orders/${order.id}/status`, { status: "CONFIRMED" });
          await fetchCart();
          navigate("/orders");
          return;
        }

        const options = {
          key,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Bhaiya G Readymade Garments",
          description: `Order #${order.id.slice(0, 8)}`,
          order_id: razorpayOrder.id,
          handler: async (response: any) => {
            await api.post("/payments/verify", {
              orderId: order.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await fetchCart();
            navigate("/orders");
          },
          theme: { color: "#c9a24b" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (paymentErr: any) {
        const msg = paymentErr?.response?.data?.message || "";
        if (msg.includes("not available") || msg.includes("not configured")) {
          setError("Online payment is not configured. Switching to Cash on Delivery.");
          await api.put(`/orders/${order.id}/status`, { status: "CONFIRMED" });
          await fetchCart();
          setTimeout(() => navigate("/orders"), 1500);
        } else {
          throw paymentErr;
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg p-6 border border-gray-100">
              <h3 className="font-heading font-semibold text-xl text-brand mb-6">Delivery Address</h3>
              {addresses.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAddressId === addr.id ? "border-brand-gold bg-brand-ivory" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 text-brand-gold focus:ring-brand-gold"
                      />
                      <div>
                        <p className="font-medium text-brand">
                          {addr.fullName}
                          {addr.isDefault && <span className="ml-2 text-xs bg-brand-gold text-white px-2 py-0.5 rounded">Default</span>}
                        </p>
                        <p className="text-sm text-warmGray mt-1">{addr.phone}</p>
                        <p className="text-sm text-gray-600 mt-1">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-warmGray mb-4">No saved addresses. Enter one below.</p>
              )}
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="Or enter a new address: House no, street, city, state, pincode"
                className="input-field"
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 border border-gray-100">
              <h3 className="font-heading font-semibold text-xl text-brand mb-6">Payment Method</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    paymentMethod === "cod" ? "border-brand bg-brand-ivory" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="text-2xl mb-2">💵</div>
                  <p className="font-medium text-brand">Cash on Delivery</p>
                  <p className="text-xs text-warmGray mt-1">Pay when you receive</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    paymentMethod === "online" ? "border-brand bg-brand-ivory" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="text-2xl mb-2">💳</div>
                  <p className="font-medium text-brand">Pay Online</p>
                  <p className="text-xs text-warmGray mt-1">Razorpay secure</p>
                </button>
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-lg p-6 border border-gray-100">
              <h3 className="font-heading font-semibold text-xl text-brand mb-6">Coupon Code</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="input-field flex-1"
                />
                <button type="button" onClick={handleApplyCoupon} className="btn-primary px-6">
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                  <p className="text-green-700 text-sm">{appliedCoupon.message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-gray-100 sticky top-24">
              <h3 className="font-heading font-semibold text-xl text-brand mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative">
                      <img src={item.product.images?.[0]?.url || PLACEHOLDER} alt={item.product.name} className="w-12 h-16 object-cover rounded" />
                      <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand truncate">{item.product.name}</p>
                      <p className="text-xs text-warmGray">₹{(item.product.price * (1 - item.product.discount / 100)).toFixed(0)} each</p>
                    </div>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-sm text-warmGray text-center">+{items.length - 3} more items</p>
                )}
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-xl text-brand">₹{total.toFixed(0)}</span>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

              <button
                onClick={handlePlaceOrder}
                disabled={loading || items.length === 0}
                className="w-full btn-primary mt-6 py-4 text-base"
              >
                {loading ? "Processing..." : `Place Order · ₹${total.toFixed(0)}`}
              </button>
              <p className="text-xs text-warmGray text-center mt-3">
                By placing this order you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
