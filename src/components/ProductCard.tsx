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
    <article className="group flex h-full flex-col">
      <Link href={`/${locale}/product/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden rounded-[14px] bg-surface-strong">
          <ProductImage
            imageUrl={product.imageUrl}
            imageEmoji={product.imageEmoji}
            alt={productName(product, locale)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            emojiClassName="text-5xl"
            rounded={false}
          />
          {product.category && (
            <span className="badge-pill absolute top-3 left-3">
              {categoryName(product.category, locale)}
            </span>
          )}
        </div>
        <div className="mt-3 flex flex-1 flex-col gap-1 px-0.5">
          <h3 className="title-md line-clamp-2 text-ink">{productName(product, locale)}</h3>
          <p className="body-sm">
            {t.pack}: {product.packSize} · {t.moq} {product.moq} {unitName(product, locale)}
          </p>
          <p className="mt-1 text-[14px] font-semibold text-ink">
            {formatUsd(product.wholesalePrice)}
            <span className="ml-1 font-normal text-muted">
              / {unitName(product, locale)}
            </span>
          </p>
        </div>
      </Link>
      <div className="mt-3">
        <AddToCartButton locale={locale} product={product} label={t.addToCart} />
      </div>
    </article>
  );
}
