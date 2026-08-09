"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = {
  productId: string;
  slug: string;
  nameZh: string;
  nameEn: string;
  unitZh: string;
  unitEn: string;
  imageEmoji: string;
  unitPrice: number;
  moq: number;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  setQty: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const KEY = "kitchenlink-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const value = useMemo<CartContextValue>(() => {
    return {
      lines,
      add: (line, qty = line.moq || 1) => {
        setLines((prev) => {
          const existing = prev.find((l) => l.productId === line.productId);
          if (existing) {
            return prev.map((l) =>
              l.productId === line.productId
                ? { ...l, quantity: l.quantity + Math.max(qty, line.moq) }
                : l,
            );
          }
          return [...prev, { ...line, quantity: Math.max(qty, line.moq) }];
        });
      },
      setQty: (productId, quantity) => {
        setLines((prev) =>
          prev
            .map((l) => (l.productId === productId ? { ...l, quantity: Math.max(0, quantity) } : l))
            .filter((l) => l.quantity > 0),
        );
      },
      remove: (productId) => setLines((prev) => prev.filter((l) => l.productId !== productId)),
      clear: () => setLines([]),
      count: lines.reduce((s, l) => s + l.quantity, 0),
      total: lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
