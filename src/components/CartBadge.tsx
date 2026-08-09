"use client";

import { useCart } from "@/lib/cart";

export function CartBadge({ label }: { label: string }) {
  const { count } = useCart();
  return (
    <span className="inline-flex items-center gap-1.5">
      {label}
      <span
        className="inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-white"
        aria-live="polite"
      >
        {count}
      </span>
    </span>
  );
}
