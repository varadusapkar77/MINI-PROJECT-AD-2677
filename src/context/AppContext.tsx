import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../services/api";

export type CartItem = { product: Product; qty: number };

type AppContextType = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  favorites: Product[];
  toggleFav: (p: Product) => void;
  isFav: (id: number) => boolean;
  cart: CartItem[];
  addToCart: (p: Product) => void;
  changeQty: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  userTick: number;
  refreshUser: () => void;
  clearUserData: () => void;
};

const AppContext = createContext<AppContextType>(null as any);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userTick, setUserTick] = useState(0);

  const isFav = (id: number) => favorites.some((f) => f.id === id);

  const toggleFav = (p: Product) =>
    setFavorites((prev) =>
      prev.some((f) => f.id === p.id) ? prev.filter((f) => f.id !== p.id) : [...prev, p]
    );

  const addToCart = (p: Product) =>
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === p.id);
      return existing
        ? prev.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { product: p, qty: 1 }];
    });

  const changeQty = (id: number, delta: number) =>
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((i) => i.product.id !== id));

  const clearCart = () => setCart([]);
  const refreshUser = () => setUserTick((t) => t + 1);
  const clearUserData = () => {
    setCart([]);
    setFavorites([]);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.qty * i.product.price, 0);

  return (
    <AppContext.Provider
      value={{
        products, setProducts, favorites, toggleFav, isFav,
        cart, addToCart, changeQty, removeFromCart, clearCart,
        cartCount, cartTotal, userTick, refreshUser, clearUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}