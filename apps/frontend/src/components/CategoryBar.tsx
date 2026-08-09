import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Category } from "../types";
import { Menu, Flame } from "lucide-react";

export default function CategoryBar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    api.get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="hidden md:block bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-brand text-white px-4 py-2.5 text-sm font-medium hover:bg-brand-dark transition-colors"
            >
              <Menu className="w-4 h-4" />
              ALL CATEGORIES
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="block px-4 py-2.5 text-sm text-brand hover:bg-brand-ivory transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <nav className="flex items-center gap-8">
            {["Home", "Men", "Women", "Kids", "New Arrivals", "Offers", "Track Order"].map((item) => (
              <Link
                key={item}
                to={
                  item === "Home"
                    ? "/"
                    : item === "Track Order"
                      ? "/orders"
                      : `/products?category=${item}`
                }
                className="py-3 text-sm font-medium text-brand hover:text-brand-gold transition-colors whitespace-nowrap"
              >
                {item}
              </Link>
            ))}
          </nav>

          <Link
            to="/products"
            className="flex items-center gap-2 bg-brand text-brand-gold px-4 py-2.5 text-sm font-medium hover:bg-brand-dark transition-colors"
          >
            <Flame className="w-4 h-4" />
            FESTIVE SALE - UP TO 40% OFF
          </Link>
        </div>
      </div>
    </div>
  );
}
