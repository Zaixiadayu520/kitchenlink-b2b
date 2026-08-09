import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { categoryName } from "@/lib/i18n";

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale: raw } = await params;
  const { category: categorySlug } = await searchParams;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);

  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: { category: true },
    orderBy: { nameEn: "asc" },
  });

  return (
    <div className="container-page py-10">
      <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl">{t.catalogTitle}</h1>
      <p className="mt-2 max-w-2xl text-muted">{t.catalogHint}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={`/${locale}/catalog`}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
            !categorySlug ? "bg-ink text-white" : "border border-line bg-white text-ink-soft"
          }`}
        >
          {t.allCategories}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/${locale}/catalog?category=${c.slug}`}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              categorySlug === c.slug ? "bg-ink text-white" : "border border-line bg-white text-ink-soft"
            }`}
          >
            {categoryName(c, locale)}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} locale={locale} t={t} product={p} />
        ))}
      </div>
    </div>
  );
}
