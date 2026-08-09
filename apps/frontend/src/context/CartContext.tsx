import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import api from "../services/api";
import { Cart } from "../types";

interface CartContextType {
  cart: Cart | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number, size?: string, color?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  cartCount: number;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await api.get("/cart");
      setCart(res.data);
      setError(null);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCart(null);
      }
      setError(err?.response?.data?.message || "Failed to load cart");
    }
  }, []);

  const addToCart = async (productId: string, quantity = 1, size?: string, color?: string) => {
    try {
      setError(null);
      await api.post("/cart", { productId, quantity, size, color });
      await fetchCart();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCart(null);
      }
      setError(err?.response?.data?.message || "Failed to add to cart");
      throw err;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setError(null);
      await api.put(`/cart/${itemId}`, { quantity });
      await fetchCart();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCart(null);
      }
      setError(err?.response?.data?.message || "Failed to update cart");
      throw err;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setError(null);
      await api.delete(`/cart/${itemId}`);
      await fetchCart();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCart(null);
      }
      setError(err?.response?.data?.message || "Failed to remove item");
      throw err;
    }
  };

  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, updateQuantity, removeItem, cartCount, error }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
