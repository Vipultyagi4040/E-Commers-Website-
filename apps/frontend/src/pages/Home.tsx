import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Product, Category } from "../types";
import ProductCard from "../components/ProductCard";
import { getCategoryImage } from "../utils/productImage";
import { Truck, Shield, RotateCcw, MessageCircle, ArrowRight } from "lucide-react";

const WHATSAPP_NUMBER = "919999999999";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/products?limit=8&sort=newest"),
      api.get("/products?limit=8&sort=popular"),
      api.get("/categories"),
    ])
      .then(([productsRes, bestSellersRes, categoriesRes]) => {
        setProducts(productsRes.data.products);
        setBestSellers(bestSellersRes.data.products);
        setCategories(categoriesRes.data);
      })
      .catch((err) => setError(err?.response?.data?.message || "Failed to load homepage"));
  }, []);

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi Bhaiya G Garments! I'm interested in your products.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <p className="mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[700px] md:min-h-[800px] flex items-center bg-brand overflow-hidden">
        <div className="absolute inset-0 lg:w-1/2 lg:ml-auto">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=1400&fit=crop"
            alt="Fashion Collection"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/20 lg:bg-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 md:py-0">
          <div className="max-w-xl">
            <p className="text-brand-gold text-xs md:text-sm font-semibold tracking-[0.3em] uppercase mb-4 md:mb-6">
              New Season Collection
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.1] mb-6 md:mb-8 text-white">
              Style That Speaks
              <br />
              <span className="text-brand-gold">For You</span>
            </h1>
            <p className="text-gray-200 text-base md:text-lg lg:text-xl mb-8 md:mb-10 max-w-md leading-relaxed">
              Premium ready-to-wear fashion crafted for every occasion. Discover elegance redefined.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link to="/products?category=Men" className="bg-brand-gold text-white px-8 md:px-10 py-3.5 md:py-4 rounded-lg text-xs md:text-sm font-bold tracking-wider hover:bg-brand-goldLight transition-colors text-center">
                SHOP MEN
              </Link>
              <Link to="/products?category=Women" className="border-2 border-white text-white px-8 md:px-10 py-3.5 md:py-4 rounded-lg text-xs md:text-sm font-bold tracking-wider hover:bg-white hover:text-brand transition-colors text-center">
                SHOP WOMEN
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
              {[
                { icon: Truck, label: "Free Delivery", sub: "On orders above ₹999" },
                { icon: Shield, label: "Secure Payment", sub: "100% secure checkout" },
                { icon: RotateCcw, label: "Easy Returns", sub: "7 days return policy" },
                { icon: MessageCircle, label: "WhatsApp Support", sub: "Quick customer support" },
              ].map((perk, index) => (
                <div key={index} className="flex items-center gap-3 py-3 md:py-4 px-3 md:px-6">
                  <perk.icon className="w-5 h-5 md:w-6 md:h-6 text-brand-gold flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-gray-900 text-xs md:text-sm font-semibold truncate">{perk.label}</p>
                    <p className="text-gray-500 text-[10px] md:text-xs truncate">{perk.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CATEGORY BANNERS ==================== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-3">Shop by Category</h2>
            <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">Explore our wide range of collections crafted for every style and occasion</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {categories.slice(0, 3).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group relative h-[320px] md:h-[420px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${getCategoryImage(cat.name)}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 font-display">{cat.name}</h3>
                  <p className="text-gray-200 text-xs md:text-sm mb-3 md:mb-4">Shop {cat.name}'s Collection</p>
                  <span className="inline-flex items-center text-brand-gold text-xs md:text-sm font-semibold group-hover:gap-2 transition-all">
                    Explore Now
                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TRENDING NOW ==================== */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8 md:mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 relative inline-block">
                Trending Now
                <span className="absolute bottom-0 left-0 w-full h-0.5 md:h-1 bg-brand-gold -mb-1"></span>
              </h2>
              <p className="text-gray-500 text-sm md:text-base mt-3">Fresh styles just landed</p>
            </div>
            <Link to="/products?sort=newest" className="hidden md:flex items-center text-brand font-semibold hover:gap-2 transition-all text-sm">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
            {newArrivals.map((product) => (
              <div key={product.id} className="snap-start flex-shrink-0 w-[calc(50%-8px)] md:w-auto">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/products?sort=newest" className="btn-secondary text-sm">View All New Arrivals</Link>
          </div>
        </div>
      </section>

      {/* ==================== FESTIVE SALE BANNER ==================== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-brand rounded-2xl md:rounded-3xl overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 p-8 md:p-16 lg:p-20 flex flex-col md:flex-row items-center justify-between">
              <div className="text-white mb-6 md:mb-0 text-center md:text-left">
                <p className="text-brand-gold text-xs md:text-sm font-semibold tracking-[0.3em] uppercase mb-3 md:mb-4">Limited Time Offer</p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-2 md:mb-3">FESTIVE SALE</h2>
                <p className="text-gray-300 text-base md:text-lg lg:text-xl">Up to 40% OFF on Entire Collection</p>
              </div>
              <Link to="/products" className="bg-brand-gold text-white px-10 md:px-12 py-3.5 md:py-4 rounded-lg text-xs md:text-sm font-bold tracking-wider hover:bg-brand-goldLight transition-colors whitespace-nowrap">
                SHOP NOW
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== NEW ARRIVALS ==================== */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8 md:mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 relative inline-block">
                New Arrivals
                <span className="absolute bottom-0 left-0 w-full h-0.5 md:h-1 bg-brand-gold -mb-1"></span>
              </h2>
              <p className="text-gray-500 text-sm md:text-base mt-3">Fresh styles, just added</p>
            </div>
            <Link to="/products?sort=newest" className="hidden md:flex items-center text-brand font-semibold hover:gap-2 transition-all text-sm">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/products?sort=newest" className="btn-secondary text-sm">View All New Arrivals</Link>
          </div>
        </div>
      </section>

      {/* ==================== BEST SELLERS ==================== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8 md:mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 relative inline-block">
                Best Sellers
                <span className="absolute bottom-0 left-0 w-full h-0.5 md:h-1 bg-brand-gold -mb-1"></span>
              </h2>
              <p className="text-gray-500 text-sm md:text-base mt-3">Customer favorites</p>
            </div>
            <Link to="/products" className="hidden md:flex items-center text-brand font-semibold hover:gap-2 transition-all text-sm">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== VISIT OUR STORE ==================== */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 relative inline-block">
              Visit Our Store
              <span className="absolute bottom-0 left-0 w-full h-0.5 md:h-1 bg-brand-gold -mb-1"></span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base mt-3">Experience the collection in person</p>
          </div>
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm border border-gray-100">
            <h3 className="font-display text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Bhaiya G Readymade Garments</h3>
            <p className="text-gray-500 text-sm md:text-base mb-1">Dhawarshi, 244242</p>
            <p className="text-gray-500 text-sm md:text-base mb-6 md:mb-8">Amroha, Uttar Pradesh</p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                Chat on WhatsApp
              </a>
              <a href="tel:+919999999999" className="btn-secondary text-sm">
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== NEWSLETTER ==================== */}
      <section className="py-16 md:py-24 bg-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-3 md:mb-4">Stay Updated</h2>
          <p className="text-gray-300 text-sm md:text-base mb-6 md:mb-8 max-w-lg mx-auto">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); handleWhatsApp(); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold bg-white/10 border border-white/20 text-white placeholder:text-gray-400"
            />
            <button type="submit" className="bg-brand-gold text-white px-8 py-3 rounded-lg text-xs md:text-sm font-bold tracking-wider hover:bg-brand-goldLight transition-colors">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
