import { useState } from "react";
import api from "../services/api";

const WHATSAPP_NUMBER = "919999999999";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/contact", form);
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-brand mb-4">Get in Touch</h1>
          <p className="text-warmGray max-w-2xl mx-auto">Have questions about our products or need help with your order? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-8 border border-gray-100">
            <h3 className="font-heading font-semibold text-xl text-brand mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="How can we help you?" className="input-field" />
              </div>
              {status === "success" && <p className="text-green-600 text-sm">Message sent successfully! We'll get back to you soon.</p>}
              {status === "error" && <p className="text-red-500 text-sm">Failed to send message. Please try again.</p>}
              <button type="submit" disabled={status === "loading"} className="w-full btn-primary">
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-8 border border-gray-100">
              <h3 className="font-heading font-semibold text-xl text-brand mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-ivory rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📍</span>
                  </div>
                  <div>
                    <p className="font-medium text-brand">Visit Our Store</p>
                    <p className="text-sm text-warmGray mt-1">Dhawarshi, 244242<br />Amroha, Uttar Pradesh</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-ivory rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📞</span>
                  </div>
                  <div>
                    <p className="font-medium text-brand">Call Us</p>
                    <a href="tel:+919999999999" className="text-sm text-brand-gold hover:underline">+91-9999999999</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-ivory rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📧</span>
                  </div>
                  <div>
                    <p className="font-medium text-brand">Email Us</p>
                    <a href="mailto:support@bhaiyag.com" className="text-sm text-brand-gold hover:underline">support@bhaiyag.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-ivory rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🕐</span>
                  </div>
                  <div>
                    <p className="font-medium text-brand">Store Hours</p>
                    <p className="text-sm text-warmGray mt-1">Mon - Sat: 10:00 AM - 8:00 PM<br />Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="block bg-green-600 text-white rounded-lg p-6 text-center hover:bg-green-700 transition-colors">
              <div className="text-3xl mb-2">💬</div>
              <p className="font-heading font-semibold text-lg">Chat on WhatsApp</p>
              <p className="text-sm text-green-100 mt-1">Get instant support</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
