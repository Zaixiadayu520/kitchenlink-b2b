import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import {
  categoryName,
  formatUsd,
  productName,
  unitName,
  type Dictionary,
} from "@/lib/i18n";
import { AddToCartButton } from "./AddToCartButton";
import { ProductImage } from "./ProductImage";

type ProductCardProps = {
  locale: Locale;
  t: Dictionary;
  product: {
    id: string;
    slug: string;
    nameZh: string;
    nameEn: string;
    unitZh: string;
    unitEn: string;
    packSize: string;
    wholesalePrice: number;
    moq: number;
    imageEmoji: string;
    imageUrl?: string | null;
    category?: { nameZh: string; nameEn: string } | null;
  };
};

export function ProductCard({ locale, t, product }: ProductCardProps) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(12,21,32,0.08)]">
      <Link href={`/${locale}/product/${product.slug}`} className="flex flex-1 flex-col">
        <div className="overflow-hidden">
          <ProductImage
            imageUrl={product.imageUrl}
            imageEmoji={product.imageEmoji}
            alt={productName(product, locale)}
            className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            emojiClassName="text-5xl"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          {product.category && (
            <div className="text-[11px] font-semibold tracking-[0.16em] text-accent-2 uppercase">
              {categoryName(product.category, locale)}
            </div>
          )}
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl leading-snug text-ink">
            {productName(product, locale)}
          </h3>
          <p className="mt-2 text-sm text-muted">
            {t.pack}: {product.packSize} · {t.moq} {product.moq} {unitName(product, locale)}
          </p>
          <p className="mt-auto pt-4 text-lg font-semibold text-ink">
            {formatUsd(product.wholesalePrice)}
            <span className="ml-1 text-sm font-normal text-muted">
              {t.priceUnit} {unitName(product, locale)}
            </span>
          </p>
        </div>
      </Link>
      <div className="border-t border-line px-5 py-4">
        <AddToCartButton locale={locale} product={product} label={t.addToCart} />
      </div>
    </article>
  );
}
