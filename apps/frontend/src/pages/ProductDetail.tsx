import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Product, Review } from "../types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const PLACEHOLDER = "https://placehold.co/600x800/1a1a1a/c9a24b?text=No+Image";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState("");
  const [productError, setProductError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    let mounted = true;
    setProductError("");
    Promise.all([
      api.get(`/products/${id}`),
      api.get(`/products/${id}/reviews`),
      api.get(`/products/${id}/related`),
    ])
      .then(([productRes, reviewsRes, relatedRes]) => {
        if (!mounted) return;
        setProduct(productRes.data);
        setSelectedSize(productRes.data.sizes?.[0] || "");
        setSelectedColor(productRes.data.colors?.[0] || "");
        setReviews(reviewsRes.data);
        setRelated(relatedRes.data);
      })
      .catch((err) => {
        if (!mounted) return;
        setProductError(err?.response?.data?.message || "Failed to load product");
      });
    return () => { mounted = false; };
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return navigate("/login");
    setActionError("");
    try {
      await addToCart(product!.id, qty, selectedSize, selectedColor);
      setMessage("Added to cart!");
      setAddedToCart(true);
      setTimeout(() => {
        setMessage("");
        setAddedToCart(false);
      }, 2000);
    } catch (err: any) {
      setActionError(err?.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!user) return navigate("/login");
    setActionError("");
    try {
      await addToCart(product!.id, qty, selectedSize, selectedColor);
      navigate("/cart");
    } catch (err: any) {
      setActionError(err?.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hi, I'm interested in ${product?.name}. Can you provide more details?`);
    window.open(`https://wa.me/919999999999?text=${msg}`, "_blank");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setReviewError("");
    try {
      const res = await api.post(`/products/${id}/reviews`, reviewForm);
      setReviews([res.data, ...reviews]);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err: any) {
      setReviewError(err?.response?.data?.message || "Failed to submit review");
    }
  };

  if (!product) {
    if (productError) {
      return (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-red-500 text-lg mb-4">{productError}</p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Go Back
          </button>
        </div>
      );
    }
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
            <div className="h-32 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - product.discount / 100);
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-warmGray mb-8">
          <Link to="/" className="hover:text-brand">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-brand">Products</Link>
          <span>/</span>
          <span className="text-brand truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={product.images?.[activeImage]?.url || PLACEHOLDER}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? "border-brand-gold" : "border-transparent hover:border-gray-200"}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="py-4">
            <p className="text-sm text-warmGray uppercase tracking-wider mb-2">{product.category?.name}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-brand mb-4 font-heading leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className={`w-5 h-5 ${star <= Math.round(Number(avgRating)) ? "text-brand-gold" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">{avgRating} ({reviews.length} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl md:text-4xl font-bold text-brand">₹{discountedPrice.toFixed(0)}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{product.price}</span>
                  <span className="bg-red-50 text-red-600 text-sm font-medium px-2 py-0.5 rounded">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-sm mb-3 text-gray-700">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                        selectedSize === s ? "bg-brand text-white border-brand" : "bg-white border-gray-200 hover:border-brand"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-sm mb-3 text-gray-700">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                        selectedColor === c ? "bg-brand text-white border-brand" : "bg-white border-gray-200 hover:border-brand"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h4 className="font-medium text-sm mb-3 text-gray-700">Quantity</h4>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:border-brand transition-colors text-lg">−</button>
                <span className="w-12 text-center font-medium text-lg">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:border-brand transition-colors text-lg">+</button>
              </div>
            </div>

            {product.stock <= 5 && product.stock > 0 && (
              <p className="text-orange-600 text-sm mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
                Only {product.stock} left in stock
              </p>
            )}
            {product.stock === 0 && (
              <p className="text-red-600 text-sm mb-4 font-medium">Out of Stock</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-4 rounded-lg font-semibold text-base transition-all duration-300 ${
                  addedToCart
                    ? "bg-green-600 text-white"
                     : "bg-brand text-white hover:bg-brand-dark"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 border-2 border-brand text-brand py-4 rounded-lg font-semibold text-base hover:bg-brand hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            <button onClick={handleWhatsApp} className="w-full border border-green-600 text-green-600 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Enquire on WhatsApp
            </button>

            {message && <p className="text-green-600 text-sm mt-3 text-center">{message}</p>}
            {actionError && <p className="text-red-500 text-sm mt-3 text-center">{actionError}</p>}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 border-t border-gray-100 pt-16">
          <h3 className="text-2xl font-heading font-bold text-brand mb-8">
            Customer Reviews ({reviews.length})
          </h3>

          {user && (
            <form onSubmit={handleReviewSubmit} className="bg-brand-ivory rounded-lg p-6 mb-10">
              <h4 className="font-medium mb-4">Write a Review</h4>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className={`text-2xl transition-colors ${star <= reviewForm.rating ? "text-brand-gold" : "text-gray-300"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                rows={4}
                required
                className="input-field mb-3"
              />
              {reviewError && <p className="text-red-500 text-sm mb-2">{reviewError}</p>}
              <button type="submit" className="btn-primary">Submit Review</button>
            </form>
          )}

          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-brand">{review.user?.name || "Verified Customer"}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-4 h-4 ${star <= review.rating ? "text-brand-gold" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-warmGray">{new Date(review.createdAt!).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span>
                </div>
                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-warmGray mb-4">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-2xl font-heading font-bold text-brand">You May Also Like</h3>
                <p className="text-warmGray mt-1">Similar products you might enjoy</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <Link key={p.id} to={`/products/${p.id}`} className="group block bg-white rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl">
                  <div className="aspect-[3/4] bg-gray-50 overflow-hidden">
                    <img src={p.images?.[0]?.url || PLACEHOLDER} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-800 truncate group-hover:text-brand-gold transition-colors">{p.name}</h3>
                    <span className="font-bold text-brand">₹{(p.price * (1 - p.discount / 100)).toFixed(0)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
