"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Locale } from "@/lib/i18n";
import { formatUsd } from "@/lib/i18n";

type Props = {
  locale: Locale;
  product: {
    id: string;
    slug: string;
    nameZh: string;
    nameEn: string;
    unitZh: string;
    unitEn: string;
    imageEmoji: string;
    wholesalePrice: number;
    moq: number;
  };
  label: string;
};

export function AddToCartButton({ locale, product, label }: Props) {
  const { add } = useCart();
  const [ok, setOk] = useState(false);

  return (
    <button
      type="button"
      className="btn btn-primary w-full !min-h-11 !py-2.5 !text-sm"
      onClick={() => {
        add({
          productId: product.id,
          slug: product.slug,
          nameZh: product.nameZh,
          nameEn: product.nameEn,
          unitZh: product.unitZh,
          unitEn: product.unitEn,
          imageEmoji: product.imageEmoji,
          unitPrice: product.wholesalePrice,
          moq: product.moq,
        });
        setOk(true);
        setTimeout(() => setOk(false), 1200);
      }}
    >
      {ok ? (locale === "zh" ? "已加入" : "Added") : `${label} · ${formatUsd(product.wholesalePrice)}`}
    </button>
  );
}
