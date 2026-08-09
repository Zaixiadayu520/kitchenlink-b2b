import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { categoryName, getDict, isLocale, type Locale } from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";
import { siteContact, whatsappUrl } from "@/lib/contact";

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

  const waText =
    locale === "zh"
      ? "您好，我想了解全美中餐厅耗材批发（餐巾纸/热敏纸/打包盒/菜单灯箱等）。"
      : "Hi, I want wholesale restaurant consumables (napkins, thermal paper, packaging, menus/lightboxes).";

  return (
    <div>
      <section className="relative min-h-[90vh] overflow-hidden bg-ink text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-warehouse.jpg"
          alt=""
          className="hero-pan absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />

        <div className="container-page relative flex min-h-[90vh] flex-col justify-end pb-16 pt-28 md:justify-center md:pb-24">
          <p className="anim-rise mb-4 text-xs font-semibold tracking-[0.28em] text-gold uppercase">
            China Supplier · U.S. Chinese Restaurants
          </p>
          <h1 className="anim-rise max-w-4xl font-[family-name:var(--font-display)] text-[clamp(2.7rem,6.2vw,5rem)] leading-[1.02] tracking-[-0.03em]">
            {t.brand}
          </h1>
          <p className="anim-rise-delay mt-5 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
            {t.hero.title}
          </p>
          <p className="anim-rise-delay mt-3 max-w-xl text-base text-white/55">{t.hero.subtitle}</p>
          <div className="anim-rise-delay mt-9 flex flex-wrap gap-3">
            <Link href={`${base}/catalog`} className="btn btn-primary">
              {t.hero.ctaCatalog}
            </Link>
            <Link
              href={`${base}/apply`}
              className="btn border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15"
            >
              {t.hero.ctaApply}
            </Link>
            <a
              href={whatsappUrl(waText)}
              target="_blank"
              rel="noreferrer"
              className="btn border border-white/25 bg-transparent text-white/90 hover:bg-white/10"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="container-page grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[t.trust.t1, t.trust.t2, t.trust.t3, t.trust.t4].map((item, i) => (
            <div key={item} className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">0{i + 1}</p>
                <p className="mt-1 text-sm font-semibold leading-snug text-ink">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">Categories</p>
            <h2 className="section-title mt-2 text-ink">{t.categories}</h2>
          </div>
          <Link href={`${base}/catalog`} className="text-sm font-semibold text-accent">
            {t.viewAll} →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`${base}/catalog?category=${c.slug}`}
              className="group relative min-h-52 overflow-hidden rounded-2xl bg-ink shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {c.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.imageUrl}
                  alt={categoryName(c, locale)}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
              <div className="relative flex h-full min-h-52 flex-col justify-end p-6 text-white">
                <p className="text-xs tracking-[0.18em] text-white/60 uppercase">Wholesale</p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl">
                  {categoryName(c, locale)}
                </h3>
                <p className="mt-3 text-sm font-semibold text-gold">
                  {locale === "zh" ? "进入品类" : "Browse"} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white py-16 md:py-20">
        <div className="container-page">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">Featured</p>
            <h2 className="section-title mt-2 text-ink">{t.featured}</h2>
            <p className="mt-3 text-muted">
              {locale === "zh"
                ? "餐巾纸、热敏纸、打包盒、菜单灯箱等高频耗材，适合全美中餐厅稳定补货。"
                : "Napkins, thermal paper, packaging, menus and lightboxes — built for steady replenishment."}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} locale={locale} t={t} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink text-white">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(600px 280px at 20% 50%, rgba(196,164,106,0.25), transparent), radial-gradient(500px 260px at 90% 30%, rgba(158,43,30,0.28), transparent)",
          }}
        />
        <div className="container-page relative grid gap-8 py-16 md:grid-cols-[1.3fr_0.7fr] md:items-center md:py-20">
          <div>
            <h2 className="section-title">
              {locale === "zh" ? "菜单、灯箱、包装都可定制" : "Menus, lightboxes & packaging — customizable"}
            </h2>
            <p className="mt-4 max-w-xl text-white/65">
              {locale === "zh"
                ? "常规耗材箱规批发，同时承接菜单印刷、灯箱画面与打包物料定制。"
                : "Case wholesale for daily consumables, plus custom menu printing and lightbox graphics."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href={`${base}/custom`} className="btn btn-primary">
              {t.hero.ctaCustom}
            </Link>
            <Link href={`${base}/apply`} className="btn border border-white/25 text-white">
              {t.hero.ctaApply}
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-10 text-center text-sm text-muted">
        {locale === "zh" ? "服务热线" : "Sales"}：{siteContact.phoneDisplay} · {siteContact.email}
      </section>
    </div>
  );
}
