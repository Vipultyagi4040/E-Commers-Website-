import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(search)}`);
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`bg-white transition-all duration-300 ${isScrolled ? "shadow-md" : "shadow-sm"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className="text-2xl font-bold font-display text-brand tracking-wide leading-none">
              Bhaiya G
            </span>
            <span className="text-[10px] text-brand-gold font-medium tracking-[0.2em] uppercase mt-1">
              READYMADE GARMENTS
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full flex">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for shirts, kurtis, dresses..."
                className="flex-1 pl-4 pr-4 py-2.5 bg-brand-ivory border border-gray-200 rounded-l-full text-sm focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all"
              />
              <button
                type="submit"
                className="bg-brand text-white px-5 py-2.5 rounded-r-full hover:bg-brand-dark transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/products?sort=newest" className="flex flex-col items-center text-brand hover:text-brand-gold transition-colors">
              <Search className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">New Arrivals</span>
            </Link>
            <Link to="/wishlist" className="relative text-brand hover:text-brand-gold transition-colors">
              <Heart className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="relative text-brand hover:text-brand-gold transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex flex-col items-center text-brand hover:text-brand-gold transition-colors">
                  <User className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5">Account</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-brand hover:bg-brand-ivory rounded-t-lg">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-brand hover:bg-brand-ivory">My Orders</Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-sm text-brand hover:bg-brand-ivory">Wishlist</Link>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-brand-ivory rounded-b-lg">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex flex-col items-center text-brand hover:text-brand-gold transition-colors">
                <User className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-brand">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="mt-3">
              <div className="relative flex">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2.5 bg-brand-ivory border border-gray-200 rounded-l-full text-sm focus:border-brand-gold focus:outline-none"
                />
                <button type="submit" className="bg-brand text-white px-4 py-2.5 rounded-r-full">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
            <div className="mt-4 space-y-1">
              <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm font-medium text-brand hover:text-brand-gold">Shop All</Link>
              <Link to="/products?sort=newest" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm font-medium text-brand hover:text-brand-gold">New Arrivals</Link>
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm font-medium text-brand hover:text-brand-gold">Wishlist</Link>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm font-medium text-brand hover:text-brand-gold">My Orders</Link>
              {user ? (
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block py-2.5 text-sm font-medium text-red-600">Logout</button>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm font-medium text-brand-gold">Login</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
