import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { SessionUser } from "@/lib/auth";
import { siteContact, whatsappUrl } from "@/lib/contact";
import { LocaleSwitch } from "./LocaleSwitch";
import { CartBadge } from "./CartBadge";
import { PaymentMethods } from "./PaymentMethods";

export function SiteHeader({
  locale,
  t,
  user,
}: {
  locale: Locale;
  t: Dictionary;
  user: SessionUser | null;
}) {
  const base = `/${locale}`;
  return (
    <header className="sticky top-0 z-40 bg-nav-bg text-nav-text">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-black/20 text-[12px] text-white/70">
        <div className="container-page flex items-center justify-between py-1.5">
          <span>{locale === "zh" ? "中国源头 · 出口全美中餐厅" : "China source · Serving U.S. Chinese restaurants"}</span>
          <div className="flex items-center gap-4">
            <a href={`tel:${siteContact.phoneTel}`} className="hover:text-white">{siteContact.phoneDisplay}</a>
            <a href={`mailto:${siteContact.email}`} className="hidden hover:text-white sm:inline">{siteContact.email}</a>
          </div>
        </div>
      </div>
      {/* Main nav */}
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href={base} className="min-w-0 shrink-0">
          <span className="text-[20px] font-bold tracking-tight text-white">
            {locale === "zh" ? "厨联" : "KitchenLink"}
          </span>
          <span className="ml-1.5 text-[11px] font-medium text-white/50">
            {locale === "zh" ? "KITCHENLINK" : ""}
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {[
            { label: t.nav.catalog, href: `${base}/catalog` },
            { label: t.nav.custom, href: `${base}/custom` },
            { label: t.nav.apply, href: `${base}/apply` },
            { label: t.nav.about, href: `${base}/about` },
          ].map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded px-4 py-2 text-[14px] font-medium text-white/85 hover:bg-white/10 hover:text-white"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitch locale={locale} />
          <Link
            href={`${base}/cart`}
            className="rounded-md border border-white/20 px-3 py-1.5 text-[13px] font-medium text-white/90 hover:bg-white/10"
          >
            <CartBadge label={t.nav.cart} />
          </Link>
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link href={`${base}/admin`} className="hidden text-[13px] font-semibold text-white/80 sm:inline">
                  {t.nav.admin}
                </Link>
              )}
              <Link href={`${base}/account`} className="hidden text-[13px] text-white/70 sm:inline">
                {user.name}
              </Link>
              <form action={`/api/auth/logout?locale=${locale}`} method="post">
                <button className="text-[13px] text-white/50 hover:text-white" type="submit">
                  {t.nav.logout}
                </button>
              </form>
            </>
          ) : (
            <Link href={`${base}/login`} className="btn-pill !bg-primary !text-[13px]">
              {t.nav.login}
            </Link>
          )}
        </div>
      </div>
      {/* Mobile nav */}
      <div className="container-page flex gap-4 overflow-x-auto border-t border-white/10 pb-2 pt-2 text-[13px] font-medium text-white/70 lg:hidden">
        <Link className="whitespace-nowrap hover:text-white" href={`${base}/catalog`}>{t.nav.catalog}</Link>
        <Link className="whitespace-nowrap hover:text-white" href={`${base}/custom`}>{t.nav.custom}</Link>
        <Link className="whitespace-nowrap hover:text-white" href={`${base}/apply`}>{t.nav.apply}</Link>
        <Link className="whitespace-nowrap hover:text-white" href={`${base}/about`}>{t.nav.about}</Link>
      </div>
    </header>
  );
}

export function SiteFooter({ locale, t }: { locale: Locale; t: Dictionary }) {
  const base = `/${locale}`;
  const waText =
    locale === "zh"
      ? "您好，我想咨询美国中餐/商超批发供货。"
      : "Hi, I am interested in wholesale supply for a Chinese restaurant / market.";

  return (
    <footer className="mt-auto bg-footer-bg text-footer-text">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {/* Col 1 — Brand */}
        <div>
          <div className="text-[20px] font-bold text-white">{t.brand}</div>
          <p className="mt-3 text-[13px] leading-relaxed text-white/60">{t.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href={whatsappUrl(waText)} target="_blank" rel="noreferrer"
              className="rounded-md bg-[#25D366] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1ebe57]">
              WhatsApp
            </a>
            <a href={`tel:${siteContact.phoneTel}`}
              className="rounded-md border border-white/20 px-4 py-2 text-[13px] font-semibold text-white/80 hover:bg-white/10">
              {t.footer.phone}
            </a>
          </div>
        </div>
        {/* Col 2 — Quick Links */}
        <div>
          <div className="mb-4 text-[13px] font-bold uppercase tracking-wider text-white/40">
            {locale === "zh" ? "快速入口" : "Quick Links"}
          </div>
          <ul className="space-y-2 text-[14px]">
            <li><Link href={`${base}/catalog`} className="hover:text-white">{t.nav.catalog}</Link></li>
            <li><Link href={`${base}/custom`} className="hover:text-white">{t.nav.custom}</Link></li>
            <li><Link href={`${base}/apply`} className="hover:text-white">{t.nav.apply}</Link></li>
            <li><Link href={`${base}/about`} className="hover:text-white">{t.nav.about}</Link></li>
          </ul>
        </div>
        {/* Col 3 — Contact */}
        <div>
          <div className="mb-4 text-[13px] font-bold uppercase tracking-wider text-white/40">
            {t.footer.contact}
          </div>
          <ul className="space-y-2 text-[14px]">
            <li><span className="text-white/50">{t.footer.phone}：</span><a className="hover:text-white" href={`tel:${siteContact.phoneTel}`}>{siteContact.phoneDisplay}</a></li>
            <li><span className="text-white/50">{t.footer.email}：</span><a className="hover:text-white" href={`mailto:${siteContact.email}`}>{siteContact.email}</a></li>
            <li><span className="text-white/50">{t.footer.wechat}：</span>{siteContact.wechat}</li>
            <li><span className="text-white/50">{t.footer.qq}：</span>{siteContact.qq}</li>
            <li className="text-white/50">{t.footer.hours}：{locale === "zh" ? siteContact.hoursZh : siteContact.hoursEn}</li>
          </ul>
        </div>
        {/* Col 4 — Payment */}
        <div>
          <PaymentMethods locale={locale} t={t} />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-4 text-[12px] text-white/40">
          <p>{t.footer.rights}</p>
          <p>{siteContact.phoneDisplay} · {siteContact.email}</p>
        </div>
      </div>
    </footer>
  );
}
