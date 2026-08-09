import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-ivory flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-lg">
        <div className="text-9xl font-heading font-bold text-brand/10 mb-4">404</div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand mb-4">Page Not Found</h1>
        <p className="text-warmGray mb-8">Oops! The page you're looking for doesn't exist. It might have been moved or deleted.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            Go Back Home
          </Link>
          <Link to="/products" className="btn-secondary">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
