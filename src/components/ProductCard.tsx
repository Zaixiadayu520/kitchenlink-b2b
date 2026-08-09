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
    category?: { nameZh: string; nameEn: string } | null;
  };
};

export function ProductCard({ locale, t, product }: ProductCardProps) {
  return (
    <article className="card flex h-full flex-col p-4">
      <Link href={`/${locale}/product/${product.slug}`} className="flex flex-1 flex-col">
        <div className="mb-3 flex h-28 items-center justify-center rounded-xl bg-paper-2 text-5xl">
          {product.imageEmoji}
        </div>
        {product.category && (
          <div className="text-xs font-semibold uppercase tracking-wide text-accent-2">
            {categoryName(product.category, locale)}
          </div>
        )}
        <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg leading-snug text-ink">
          {productName(product, locale)}
        </h3>
        <p className="mt-2 text-sm text-muted">
          {t.pack}: {product.packSize} · {t.moq} {product.moq} {unitName(product, locale)}
        </p>
        <p className="mt-3 text-base font-semibold text-ink">
          {formatUsd(product.wholesalePrice)}
          <span className="ml-1 text-sm font-normal text-muted">
            {t.priceUnit} {unitName(product, locale)}
          </span>
        </p>
      </Link>
      <div className="mt-4">
        <AddToCartButton locale={locale} product={product} label={t.addToCart} />
      </div>
    </article>
  );
}
