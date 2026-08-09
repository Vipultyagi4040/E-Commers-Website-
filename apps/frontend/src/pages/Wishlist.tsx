import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { WishlistItem as WishlistItemType } from "../types";

const PLACEHOLDER = "https://placehold.co/600x800/1a1a1a/c9a24b?text=No+Image";

export default function Wishlist() {
  const [items, setItems] = useState<WishlistItemType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = () => {
    api.get("/wishlist").then((res) => setItems(res.data.items)).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    await api.delete(`/wishlist/${productId}`);
    setItems(items.filter((item) => item.productId !== productId));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-heading font-bold text-brand mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-[3/4] bg-gray-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand mb-2">My Wishlist</h1>
        <p className="text-warmGray mb-8">{items.length} item{items.length > 1 ? "s" : ""} saved</p>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">💖</div>
            <h2 className="text-2xl font-heading font-bold text-brand mb-4">Your Wishlist is Waiting</h2>
            <p className="text-warmGray mb-8 max-w-md mx-auto">Save items you love to your wishlist and come back to them anytime.</p>
            <Link to="/products" className="btn-primary">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => {
              const product = item.product;
              const discountedPrice = product.price * (1 - product.discount / 100);
              return (
                <div key={item.id} className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all group">
                  <Link to={`/products/${product.id}`}>
                    <div className="aspect-[3/4] bg-gray-50 overflow-hidden relative">
                      <img src={product.images?.[0]?.url || PLACEHOLDER} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      {product.discount > 0 && (
                        <span className="absolute top-3 left-3 bg-brand-gold text-brand text-xs font-semibold px-2.5 py-1 rounded">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-medium text-brand group-hover:text-brand-gold transition-colors line-clamp-2 mb-2">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-brand text-lg">₹{discountedPrice.toFixed(0)}</span>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/products/${product.id}`} className="flex-1 btn-primary text-center text-sm py-2">
                        View
                      </Link>
                      <button onClick={() => handleRemove(product.id)} className="flex-1 border border-red-500 text-red-500 text-sm py-2 rounded hover:bg-red-50 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
