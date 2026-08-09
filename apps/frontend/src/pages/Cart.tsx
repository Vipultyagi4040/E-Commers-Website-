import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const PLACEHOLDER = "https://placehold.co/600x800/1a1a1a/c9a24b?text=No+Image";

export default function Cart() {
  const { cart, fetchCart, updateQuantity, removeItem, error } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart().finally(() => setLoading(false));
  }, [fetchCart]);

  const items = cart?.items || [];

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.price * (1 - item.product.discount / 100);
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal > 1499 ? 0 : 99;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-heading font-bold text-brand mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-gray-100 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-32 bg-gray-100 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-6 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-3xl font-heading font-bold text-brand mb-4">Your Cart is Empty</h2>
        <p className="text-warmGray mb-8 max-w-md mx-auto">Looks like you haven't added any items to your cart yet. Explore our collection and find something you love.</p>
        <Link to="/products" className="btn-primary">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand mb-2">Shopping Cart</h1>
        <p className="text-warmGray mb-8">{items.length} item{items.length > 1 ? "s" : ""} in your cart</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.product.price * (1 - item.product.discount / 100);
              return (
                <div key={item.id} className="bg-white rounded-lg p-4 md:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex gap-4 md:gap-6">
                    <Link to={`/products/${item.product.id}`} className="flex-shrink-0">
                      <img
                        src={item.product.images?.[0]?.url || PLACEHOLDER}
                        alt={item.product.name}
                        className="w-20 h-24 md:w-28 md:h-36 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link to={`/products/${item.product.id}`}>
                            <h3 className="font-medium text-brand hover:text-brand-gold transition-colors line-clamp-2">{item.product.name}</h3>
                          </Link>
                          <p className="text-sm text-warmGray mt-1">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.size && item.color && <span className="mx-1">·</span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </p>
                          <p className="font-semibold text-brand mt-2">₹{price.toFixed(0)}</p>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-warmGray hover:text-red-500 transition-colors p-1">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors">−</button>
                          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors">+</button>
                        </div>
                        <p className="font-semibold text-brand">₹{(price * item.quantity).toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-gray-100 sticky top-24">
              <h3 className="font-heading font-semibold text-xl text-brand mb-6">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-warmGray">Free shipping on orders above ₹1499</p>
                )}
                <div className="border-t border-gray-100 pt-4 flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-xl text-brand">₹{total.toFixed(0)}</span>
                </div>
              </div>
              <button onClick={() => navigate("/checkout")} className="w-full btn-primary mt-6">
                Proceed to Checkout
              </button>
              <Link to="/products" className="block text-center text-brand-gold text-sm mt-4 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
