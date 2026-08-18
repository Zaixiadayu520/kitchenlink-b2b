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
      ? "您好，我想了解全美中餐厅耗材批发。"
      : "Hi, I want wholesale restaurant consumables.";

  const advantages = locale === "zh"
    ? [
        { icon: "🏭", title: "中国源头直供", desc: "工厂直发，减少中间环节，批发价更低" },
        { icon: "📦", title: "餐厅高频耗材齐全", desc: "餐巾纸、热敏纸、打包盒、餐具一站配齐" },
        { icon: "🎨", title: "菜单灯箱可定制", desc: "菜单印刷、灯箱画面、包装贴牌均可定制" },
        { icon: "🌐", title: "中英双语服务", desc: "华人团队对接，沟通零障碍" },
        { icon: "🚚", title: "稳定补货", desc: "箱规标准化，支持周期性批量补货" },
        { icon: "💬", title: "微信/WhatsApp 在线", desc: "随时联系，快速报价与售后" },
      ]
    : [
        { icon: "🏭", title: "China Direct Supply", desc: "Factory-direct, cutting out middlemen for lower bulk prices" },
        { icon: "📦", title: "Full Range", desc: "Napkins, thermal paper, packaging, utensils — all in one place" },
        { icon: "🎨", title: "Custom Print & Signage", desc: "Menu printing, lightbox graphics, packaging branding" },
        { icon: "🌐", title: "Bilingual Support", desc: "Chinese team handles everything in your language" },
        { icon: "🚚", title: "Reliable Replenishment", desc: "Standardized case packs for recurring bulk orders" },
        { icon: "💬", title: "WeChat / WhatsApp", desc: "Quick quotes and after-sales support online" },
      ];

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-nav-bg">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-warehouse.jpg" alt="" className="h-full w-full object-cover opacity-30" />
        </div>
        <div className="container-page relative z-10 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="anim-rise mb-4 inline-block rounded bg-primary px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-white">
              {locale === "zh" ? "美国中餐厅用品 · 一站式从中国直供" : "Chinese restaurant supplies · Direct from China"}
            </div>
            <h1 className="anim-rise text-[32px] font-bold leading-[1.2] text-white md:text-[42px]">
              {t.hero.title}
            </h1>
            <p className="anim-rise-delay mt-4 text-[16px] leading-relaxed text-white/75 md:text-[18px]">
              {t.hero.subtitle}
            </p>
            <div className="anim-rise-delay mt-8 flex flex-wrap gap-3">
              <Link href={`${base}/catalog`} className="btn btn-primary !px-8 !text-[16px]">
                {t.hero.ctaCatalog}
              </Link>
              <Link href={`${base}/apply`} className="btn !border-white/40 !bg-white/10 !text-white hover:!bg-white/20">
                {t.hero.ctaApply}
              </Link>
              <a href={whatsappUrl(waText)} target="_blank" rel="noreferrer"
                className="btn !border-[#25D366]/60 !bg-[#25D366]/15 !text-[#25D366] hover:!bg-[#25D366]/25">
                WhatsApp {locale === "zh" ? "咨询" : "Chat"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ADVANTAGES ═══ */}
      <section className="border-b border-hairline bg-white py-14">
        <div className="container-page">
          <div className="mb-8 text-center">
            <h2 className="section-title">{locale === "zh" ? "为什么选择厨联" : "Why KitchenLink"}</h2>
            <p className="mt-2 text-[14px] text-muted">
              {locale === "zh" ? "专注服务全美中餐厅与华人商超，从源头到门店的一站式供应链" : "Dedicated supply chain from Chinese factories to your restaurant door"}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((a) => (
              <div key={a.title} className="flex gap-4 rounded-lg border border-hairline bg-white p-5 transition hover:border-primary/30 hover:shadow-float">
                <span className="text-[28px]">{a.icon}</span>
                <div>
                  <h3 className="title-md text-ink">{a.title}</h3>
                  <p className="mt-1 text-[13px] text-muted">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="bg-surface-soft py-14">
        <div className="container-page">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="section-title">{t.categories}</h2>
            <Link href={`${base}/catalog`} className="text-[14px] font-semibold text-primary hover:underline">
              {t.viewAll} →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`${base}/catalog?category=${c.slug}`}
                className="group relative aspect-[3/2] overflow-hidden rounded-lg bg-surface-strong"
              >
                {c.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.imageUrl} alt={categoryName(c, locale)}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="text-[16px] font-bold text-white drop-shadow-sm">{categoryName(c, locale)}</h3>
                  <p className="mt-0.5 text-[12px] font-medium text-white/70">
                    {locale === "zh" ? "进入品类 →" : "Browse →"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <section className="bg-white py-14">
        <div className="container-page">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">{t.featured}</h2>
              <p className="mt-1 text-[14px] text-muted">
                {locale === "zh"
                  ? "餐巾纸、热敏纸、打包盒、菜单灯箱等高频耗材，适合全美中餐厅稳定补货。"
                  : "Napkins, thermal paper, packaging, menus and lightboxes — built for steady replenishment."}
              </p>
            </div>
            <Link href={`${base}/catalog`} className="hidden text-[14px] font-semibold text-primary hover:underline sm:inline">
              {t.viewAll} →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} locale={locale} t={t} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CUSTOM CTA ═══ */}
      <section className="bg-nav-bg py-14">
        <div className="container-page grid gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-center">
          <div>
            <h2 className="text-[26px] font-bold leading-tight text-white">
              {locale === "zh" ? "不只是现有产品，更是供货链上的合作伙伴" : "More than products — your supply chain partner"}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/65">
              {locale === "zh"
                ? "菜单印刷、灯箱画面、打包物料贴牌定制。常规耗材箱规批发，也支持特殊规格下单。"
                : "Custom menu printing, lightbox graphics, and packaging branding. Standard case wholesale plus special specs."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href={`${base}/custom`} className="btn btn-primary">
              {t.hero.ctaCustom}
            </Link>
            <Link href={`${base}/apply`} className="btn !border-white/30 !text-white hover:!bg-white/10">
              {t.hero.ctaApply}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT STRIP ═══ */}
      <section className="border-t border-hairline bg-primary-light py-10">
        <div className="container-page grid gap-6 text-center sm:grid-cols-3">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-wider text-primary">
              {locale === "zh" ? "微信" : "WeChat"}
            </p>
            <p className="mt-1 text-[16px] font-semibold text-ink">{siteContact.wechat}</p>
          </div>
          <div>
            <p className="text-[13px] font-bold uppercase tracking-wider text-primary">WhatsApp</p>
            <p className="mt-1 text-[16px] font-semibold text-ink">{siteContact.phoneDisplay}</p>
          </div>
          <div>
            <p className="text-[13px] font-bold uppercase tracking-wider text-primary">
              {locale === "zh" ? "邮箱" : "Email"}
            </p>
            <p className="mt-1 text-[16px] font-semibold text-ink">{siteContact.email}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
