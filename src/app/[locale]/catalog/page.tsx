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
    <div className="container-page py-10 md:py-14">
      <h1 className="section-title">{t.catalogTitle}</h1>
      <p className="mt-2 max-w-2xl text-[14px] text-muted">{t.catalogHint}</p>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-hairline pb-4">
        <Link
          href={`/${locale}/catalog`}
          className={`border-b-2 px-1 pb-3 text-[14px] font-medium ${
            !categorySlug
              ? "border-ink text-ink"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          {t.allCategories}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/${locale}/catalog?category=${c.slug}`}
            className={`border-b-2 px-1 pb-3 text-[14px] font-medium ${
              categorySlug === c.slug
                ? "border-ink text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {categoryName(c, locale)}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} locale={locale} t={t} product={p} />
        ))}
      </div>
    </div>
  );
}
