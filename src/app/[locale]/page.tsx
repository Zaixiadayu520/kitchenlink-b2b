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
      take: 8,
      orderBy: { nameEn: "asc" },
    }),
  ]);

  const waText =
    locale === "zh"
      ? "您好，我想了解全美中餐厅耗材批发（餐巾纸/热敏纸/打包盒/菜单灯箱等）。"
      : "Hi, I want wholesale restaurant consumables (napkins, thermal paper, packaging, menus/lightboxes).";

  return (
    <div className="bg-canvas">
      {/* Hero — photo-led, modest type */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[58vh] md:min-h-[68vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-warehouse.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/10" />
          <div className="container-page relative flex min-h-[58vh] flex-col justify-end pb-12 pt-24 md:min-h-[68vh] md:pb-16">
            <p className="anim-rise mb-3 text-[12px] font-bold tracking-[0.04em] text-white/90 uppercase">
              China Supplier · U.S. Chinese Restaurants
            </p>
            <h1 className="anim-rise max-w-3xl text-[28px] font-bold leading-[1.43] text-white md:text-[32px]">
              {t.hero.title}
            </h1>
            <p className="anim-rise-delay mt-3 max-w-2xl text-[16px] leading-relaxed text-white/85">
              {t.hero.subtitle}
            </p>
            <div className="anim-rise-delay mt-7 flex flex-wrap gap-3">
              <Link href={`${base}/catalog`} className="btn btn-primary">
                {t.hero.ctaCatalog}
              </Link>
              <Link
                href={`${base}/apply`}
                className="btn btn-secondary !border-white !bg-white/95 !text-ink hover:!bg-white"
              >
                {t.hero.ctaApply}
              </Link>
              <a
                href={whatsappUrl(waText)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost !border-white/50 !text-white hover:!bg-white/10"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-hairline">
        <div className="container-page grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[t.trust.t1, t.trust.t2, t.trust.t3, t.trust.t4].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <p className="text-[14px] font-medium leading-snug text-ink">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories — photo cards */}
      <section className="container-page py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="section-title">{t.categories}</h2>
          <Link href={`${base}/catalog`} className="text-[14px] font-medium text-muted hover:text-ink hover:underline">
            {t.viewAll}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`${base}/catalog?category=${c.slug}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-[14px] bg-surface-strong"
            >
              {c.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.imageUrl}
                  alt={categoryName(c, locale)}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <span className="badge-pill mb-2 !bg-white/95">{locale === "zh" ? "批发" : "Wholesale"}</span>
                <h3 className="title-md mt-2 drop-shadow-sm">{categoryName(c, locale)}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="border-t border-hairline bg-surface-soft py-16">
        <div className="container-page">
          <div className="mb-6 max-w-2xl">
            <h2 className="section-title">{t.featured}</h2>
            <p className="mt-2 text-[14px] text-muted">
              {locale === "zh"
                ? "餐巾纸、热敏纸、打包盒、菜单灯箱等高频耗材，适合全美中餐厅稳定补货。"
                : "Napkins, thermal paper, packaging, menus and lightboxes — built for steady replenishment."}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} locale={locale} t={t} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Custom CTA band */}
      <section className="container-page py-16">
        <div className="overflow-hidden rounded-[20px] border border-hairline bg-canvas shadow-float">
          <div className="grid gap-8 p-8 md:grid-cols-[1.4fr_0.8fr] md:items-center md:p-12">
            <div>
              <h2 className="display-md">
                {locale === "zh" ? "菜单、灯箱、包装都可定制" : "Menus, lightboxes & packaging — customizable"}
              </h2>
              <p className="mt-3 max-w-xl text-[16px] text-body">
                {locale === "zh"
                  ? "常规耗材箱规批发，同时承接菜单印刷、灯箱画面与打包物料定制。"
                  : "Case wholesale for daily consumables, plus custom menu printing and lightbox graphics."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href={`${base}/custom`} className="btn btn-primary">
                {t.hero.ctaCustom}
              </Link>
              <Link href={`${base}/apply`} className="btn btn-secondary">
                {t.hero.ctaApply}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-hairline py-8 text-center text-[13px] text-muted">
        {locale === "zh" ? "服务热线" : "Sales"}：{siteContact.phoneDisplay} · {siteContact.email}
      </section>
    </div>
  );
}
