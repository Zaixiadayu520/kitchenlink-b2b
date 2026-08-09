import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  categoryName,
  getDict,
  isLocale,
  type Locale,
} from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const base = `/${locale}`;

  const [categories, featured] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: { featured: true, active: true },
      include: { category: true },
      take: 6,
      orderBy: { nameEn: "asc" },
    }),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-[1.15fr_0.85fr] md:py-20">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-highlight/70 px-3 py-1 text-xs font-semibold tracking-wide text-ink-soft">
              U.S. Foodservice Wholesale · B2B
            </p>
            <h1 className="max-w-xl font-[family-name:var(--font-display)] text-4xl leading-[1.1] text-ink md:text-5xl">
              {t.hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`${base}/catalog`} className="btn btn-primary">
                {t.hero.ctaCatalog}
              </Link>
              <Link href={`${base}/custom`} className="btn btn-secondary">
                {t.hero.ctaCustom}
              </Link>
              <Link href={`${base}/apply`} className="btn btn-ghost">
                {t.hero.ctaApply}
              </Link>
            </div>
          </div>
          <div className="card relative overflow-hidden p-6 md:p-8">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/15" />
            <div className="absolute -bottom-10 left-10 h-28 w-28 rounded-full bg-accent-2/15" />
            <p className="relative text-sm font-semibold uppercase tracking-[0.18em] text-accent-2">
              KitchenLink
            </p>
            <p className="relative mt-4 font-[family-name:var(--font-display)] text-3xl leading-tight text-ink">
              {locale === "zh" ? "箱规批发 · 定制跟进 · 稳定补货" : "Case packs · Custom sourcing · Replenish"}
            </p>
            <ul className="relative mt-6 space-y-3 text-sm text-ink-soft">
              <li>• {t.trust.t1}</li>
              <li>• {t.trust.t2}</li>
              <li>• {t.trust.t3}</li>
              <li>• {t.trust.t4}</li>
            </ul>
            <div className="relative mt-8 grid grid-cols-3 gap-2 text-center">
              {["🫙", "🍚", "🥡"].map((e) => (
                <div key={e} className="rounded-xl bg-paper-2 py-6 text-3xl">
                  {e}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">{t.categories}</h2>
          <Link href={`${base}/catalog`} className="text-sm font-semibold text-accent">
            {t.viewAll}
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`${base}/catalog?category=${c.slug}`}
              className="card group flex items-center justify-between px-5 py-4 transition hover:-translate-y-0.5"
            >
              <span className="font-semibold text-ink">{categoryName(c, locale)}</span>
              <span className="text-muted transition group-hover:text-accent">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">{t.featured}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} locale={locale} t={t} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
