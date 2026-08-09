import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Home, Search, Grid3X3, ShoppingBag, User } from "lucide-react";

export default function MobileNav() {
  const location = useLocation();
  const { cartCount } = useCart();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex items-center justify-around py-2">
        <Link to="/" className={`flex flex-col items-center gap-0.5 py-1 px-3 ${isActive("/") ? "text-brand-gold" : "text-warmGray"}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/products" className={`flex flex-col items-center gap-0.5 py-1 px-3 ${isActive("/products") ? "text-brand-gold" : "text-warmGray"}`}>
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-medium">Search</span>
        </Link>
        <Link to="/products" className={`flex flex-col items-center gap-0.5 py-1 px-3 ${isActive("/products") ? "text-brand-gold" : "text-warmGray"}`}>
          <Grid3X3 className="w-6 h-6" />
          <span className="text-[10px] font-medium">Categories</span>
        </Link>
        <Link to="/cart" className={`flex flex-col items-center gap-0.5 py-1 px-3 relative ${isActive("/cart") ? "text-brand-gold" : "text-warmGray"}`}>
          <ShoppingBag className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-2 bg-brand-gold text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium">Cart</span>
        </Link>
        <Link to={user ? "/profile" : "/login"} className={`flex flex-col items-center gap-0.5 py-1 px-3 ${isActive(user ? "/profile" : "/login") ? "text-brand-gold" : "text-warmGray"}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Account</span>
        </Link>
      </div>
    </nav>
  );
}
