import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { getProductImage, fetchProductImage } from "../utils/productImage";

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dynamicImage, setDynamicImage] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const discountedPrice = product.price * (1 - product.discount / 100);
  const displayImage = dynamicImage || getProductImage(product);

  useEffect(() => {
    let mounted = true;
    const loadImage = async () => {
      const currentImage = product.images && product.images.length > 0 ? product.images[0]?.url : null;
      if (currentImage && !currentImage.includes("placehold.co")) return;
      const img = await fetchProductImage(product.name, product.category?.name);
      if (mounted) setDynamicImage(img);
    };
    loadImage();
    return () => { mounted = false; };
  }, [product.id, product.name, product.category?.name]);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return window.location.href = "/login";
    if (product.stock === 0) return;
    try {
      await addToCart(product.id, 1, product.sizes?.[0], product.colors?.[0]);
    } catch {
      // silently fail
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl border border-gray-100/60"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse z-10" />
        )}
        <img
          src={displayImage}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        />

        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-brand text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm z-20">
            {product.discount}% OFF
          </span>
        )}

        <button
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors shadow-sm z-20"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className="w-4 h-4" />
        </button>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <span className="bg-white text-brand px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">Out of Stock</span>
          </div>
        )}

        {product.stock > 0 && (
          <div
            className={`absolute bottom-3 left-3 right-3 z-20 transition-all duration-500 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <button
              onClick={handleQuickAdd}
              className="w-full bg-brand text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-brand/90 transition-colors shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              Quick Add
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1.5 truncate">
          {product.category?.name}
        </p>
        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-brand transition-colors min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base font-bold text-brand">₹{discountedPrice.toFixed(0)}</span>
          {product.discount > 0 && (
            <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
          ))}
          <span className="text-[11px] text-gray-400 ml-1">(24)</span>
        </div>
      </div>
    </Link>
  );
}
