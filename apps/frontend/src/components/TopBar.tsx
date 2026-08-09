import { MapPin, Phone, MessageCircle } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-brand text-white text-xs py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3" />
          <p className="hidden sm:block">Welcome to Bhaiya G Readymade Garments</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:flex items-center gap-1 text-gray-300">
            <MapPin className="w-3 h-3" />
            Dhawarshi, 244242, Amroha, Uttar Pradesh
          </span>
          <a href="tel:+919999999999" className="hover:text-brand-gold transition-colors flex items-center gap-1">
            <Phone className="w-3 h-3" />
            Call Us
          </a>
          <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
