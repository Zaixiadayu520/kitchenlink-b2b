import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  categoryName,
  formatUsd,
  getDict,
  isLocale,
  productDesc,
  productName,
  unitName,
  type Locale,
} from "@/lib/i18n";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductImage } from "@/components/ProductImage";
import Link from "next/link";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product || !product.active) notFound();

  return (
    <div className="container-page py-10">
      <Link href={`/${locale}/catalog`} className="text-sm font-semibold text-accent">
        ← {t.nav.catalog}
      </Link>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="card overflow-hidden p-2">
          <ProductImage
            imageUrl={product.imageUrl}
            imageEmoji={product.imageEmoji}
            alt={productName(product, locale)}
            className="min-h-72 w-full object-cover"
            emojiClassName="text-8xl"
          />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-2">
            {categoryName(product.category, locale)} · {product.sku}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl md:text-4xl">
            {productName(product, locale)}
          </h1>
          <p className="mt-4 leading-relaxed text-muted">{productDesc(product, locale)}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="card p-3">
              <dt className="text-muted">{t.pack}</dt>
              <dd className="mt-1 font-semibold">{product.packSize}</dd>
            </div>
            <div className="card p-3">
              <dt className="text-muted">{t.moq}</dt>
              <dd className="mt-1 font-semibold">
                {product.moq} {unitName(product, locale)}
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-2xl font-semibold">
            {formatUsd(product.wholesalePrice)}
            <span className="ml-2 text-base font-normal text-muted">
              {t.priceUnit} {unitName(product, locale)}
            </span>
          </p>
          <p className="mt-1 text-sm text-muted">{t.wholesaleOnly}</p>
          <div className="mt-6 max-w-sm">
            <AddToCartButton locale={locale} product={product} label={t.addToCart} />
          </div>
        </div>
      </div>
    </div>
  );
}
