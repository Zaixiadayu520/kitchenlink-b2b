import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { categoryName, getDict, isLocale, type Locale } from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";
import { siteContact, whatsappUrl } from "@/lib/contact";

const categoryVisual: Record<string, { emoji: string; tone: string }> = {
  "sauces-seasonings": { emoji: "🫙", tone: "from-[#3a1d18] to-[#7a3b2e]" },
  "rice-noodles": { emoji: "🍚", tone: "from-[#2a2418] to-[#6b5a3a]" },
  "oils-fats": { emoji: "🫒", tone: "from-[#1f2a1a] to-[#4f6b3c]" },
  "frozen-proteins": { emoji: "🍗", tone: "from-[#1a222c] to-[#3d5168]" },
  disposables: { emoji: "🥡", tone: "from-[#222018] to-[#5a5344]" },
  beverages: { emoji: "🍵", tone: "from-[#163028] to-[#2f6b57]" },
};

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
      ? "您好，我想了解厨联批发供货。"
      : "Hi, I want to learn about KitchenLink wholesale supply.";

  return (
    <div>
      {/* Full-bleed hero — one composition */}
      <section className="relative min-h-[88vh] overflow-hidden bg-ink text-white">
        <div
          className="hero-pan absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(900px 500px at 75% 20%, rgba(196,164,106,0.28), transparent 55%), radial-gradient(700px 420px at 15% 80%, rgba(158,43,30,0.35), transparent 50%), linear-gradient(135deg, #0a1018 0%, #152033 45%, #1a2838 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="container-page relative flex min-h-[88vh] flex-col justify-end pb-14 pt-28 md:justify-center md:pb-20 md:pt-24">
          <p className="anim-rise mb-4 text-xs font-semibold tracking-[0.28em] text-gold uppercase">
            KitchenLink · U.S. Foodservice Wholesale
          </p>
          <h1 className="anim-rise max-w-4xl font-[family-name:var(--font-display)] text-[clamp(2.6rem,6vw,4.8rem)] leading-[1.02] tracking-[-0.03em]">
            {t.brand}
          </h1>
          <p className="anim-rise-delay mt-5 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">
            {t.hero.title}
          </p>
          <p className="anim-rise-delay mt-3 max-w-xl text-base text-white/55">{t.hero.subtitle}</p>
          <div className="anim-rise-delay mt-9 flex flex-wrap gap-3">
            <Link href={`${base}/catalog`} className="btn btn-primary">
              {t.hero.ctaCatalog}
            </Link>
            <Link
              href={`${base}/apply`}
              className="btn border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10"
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

      {/* Trust strip */}
      <section className="border-b border-line bg-white">
        <div className="container-page grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[t.trust.t1, t.trust.t2, t.trust.t3, t.trust.t4].map((item, i) => (
            <div key={item} className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
                  0{i + 1}
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug text-ink">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories as large visual tiles */}
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
          {categories.map((c) => {
            const visual = categoryVisual[c.slug] || {
              emoji: "📦",
              tone: "from-[#1c2430] to-[#3a4658]",
            };
            return (
              <Link
                key={c.id}
                href={`${base}/catalog?category=${c.slug}`}
                className={`group relative min-h-44 overflow-hidden rounded-2xl bg-gradient-to-br ${visual.tone} p-6 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <span className="absolute -right-2 -bottom-3 text-7xl opacity-25 transition duration-300 group-hover:scale-110 group-hover:opacity-40">
                  {visual.emoji}
                </span>
                <p className="relative text-xs tracking-[0.18em] text-white/55 uppercase">Wholesale</p>
                <h3 className="relative mt-3 font-[family-name:var(--font-display)] text-2xl">
                  {categoryName(c, locale)}
                </h3>
                <p className="relative mt-8 text-sm font-semibold text-white/80">
                  {locale === "zh" ? "进入品类" : "Browse"} →
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured products */}
      <section className="border-y border-line bg-white py-16 md:py-20">
        <div className="container-page">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">Featured</p>
            <h2 className="section-title mt-2 text-ink">{t.featured}</h2>
            <p className="mt-3 text-muted">
              {locale === "zh"
                ? "餐厅高频刚需，箱规清晰，适合稳定补货。"
                : "High-velocity kitchen staples with clear case packs for replenishment."}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} locale={locale} t={t} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(600px 280px at 20% 50%, rgba(196,164,106,0.25), transparent), radial-gradient(500px 260px at 90% 30%, rgba(158,43,30,0.3), transparent)",
          }}
        />
        <div className="container-page relative grid gap-8 py-16 md:grid-cols-[1.3fr_0.7fr] md:items-center md:py-20">
          <div>
            <h2 className="section-title">
              {locale === "zh" ? "成为厨联批发客户" : "Become a wholesale partner"}
            </h2>
            <p className="mt-4 max-w-xl text-white/65">
              {locale === "zh"
                ? "提交开户资料后开通采购单；特殊规格与定制需求也可单独询价。"
                : "Apply for an account to unlock order sheets. Custom sourcing available on request."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href={`${base}/apply`} className="btn btn-primary">
              {t.hero.ctaApply}
            </Link>
            <Link href={`${base}/custom`} className="btn border border-white/25 text-white">
              {t.hero.ctaCustom}
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
