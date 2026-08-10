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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[color-mix(in_srgb,var(--ink)_78%,transparent)] text-white backdrop-blur-xl">
      <div className="container-page flex items-center justify-between gap-4 py-3.5">
        <Link href={base} className="min-w-0">
          <div className="font-[family-name:var(--font-display)] text-xl tracking-tight md:text-2xl">
            {t.brand}
          </div>
          <div className="truncate text-[11px] tracking-wide text-white/55">{t.tagline}</div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-white/75 lg:flex">
          <Link className="hover:text-white" href={`${base}/catalog`}>
            {t.nav.catalog}
          </Link>
          <Link className="hover:text-white" href={`${base}/custom`}>
            {t.nav.custom}
          </Link>
          <Link className="hover:text-white" href={`${base}/apply`}>
            {t.nav.apply}
          </Link>
          <Link className="hover:text-white" href={`${base}/about`}>
            {t.nav.about}
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitch locale={locale} />
          <Link
            href={`${base}/cart`}
            className="rounded-full border border-white/20 px-3 py-2 text-sm text-white/90 hover:bg-white/10"
          >
            <CartBadge label={t.nav.cart} />
          </Link>
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link href={`${base}/admin`} className="hidden text-sm font-semibold text-gold sm:inline">
                  {t.nav.admin}
                </Link>
              )}
              <Link href={`${base}/account`} className="hidden text-sm text-white/80 sm:inline">
                {user.name}
              </Link>
              <form action={`/api/auth/logout?locale=${locale}`} method="post">
                <button className="text-sm text-white/55" type="submit">
                  {t.nav.logout}
                </button>
              </form>
            </>
          ) : (
            <Link
              href={`${base}/login`}
              className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-ink"
            >
              {t.nav.login}
            </Link>
          )}
        </div>
      </div>
      <div className="container-page flex gap-4 overflow-x-auto pb-3 text-sm font-medium text-white/70 lg:hidden">
        <Link href={`${base}/catalog`}>{t.nav.catalog}</Link>
        <Link href={`${base}/custom`}>{t.nav.custom}</Link>
        <Link href={`${base}/apply`}>{t.nav.apply}</Link>
        <Link href={`${base}/about`}>{t.nav.about}</Link>
      </div>
    </header>
  );
}

export function SiteFooter({ locale, t }: { locale: Locale; t: Dictionary }) {
  const waText =
    locale === "zh"
      ? "您好，我想咨询美国中餐/商超批发供货。"
      : "Hi, I am interested in wholesale supply for a Chinese restaurant / market.";

  return (
    <footer className="mt-auto border-t border-line bg-ink text-paper">
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr_1fr]">
        <div>
          <div className="font-[family-name:var(--font-display)] text-2xl">{t.brand}</div>
          <p className="mt-2 max-w-md text-sm text-paper/75">{t.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a className="btn btn-primary !py-2 text-sm" href={`tel:${siteContact.phoneTel}`}>
              {t.footer.phone}
            </a>
            <a
              className="btn btn-ghost !border-paper/30 !py-2 text-sm !text-paper"
              href={whatsappUrl(waText)}
              target="_blank"
              rel="noreferrer"
            >
              {t.footer.whatsapp}
            </a>
            <a
              className="btn btn-ghost !border-paper/30 !py-2 text-sm !text-paper"
              href={`mailto:${siteContact.email}`}
            >
              {t.footer.email}
            </a>
          </div>
          <p className="mt-6 text-xs text-paper/55">{t.footer.rights}</p>
        </div>
        <div className="text-sm text-paper/80">
          <div className="font-semibold text-paper">{t.footer.contact}</div>
          <ul className="mt-3 space-y-2">
            <li>
              <span className="text-paper/55">{t.footer.phone}：</span>
              <a className="hover:text-white" href={`tel:${siteContact.phoneTel}`}>
                {siteContact.phoneDisplay}
              </a>
            </li>
            <li>
              <span className="text-paper/55">{t.footer.email}：</span>
              <a className="hover:text-white" href={`mailto:${siteContact.email}`}>
                {siteContact.email}
              </a>
            </li>
            <li>
              <span className="text-paper/55">{t.footer.wechat}：</span>
              <span className="text-paper">{siteContact.wechat}</span>
            </li>
            <li>
              <span className="text-paper/55">{t.footer.qq}：</span>
              <span className="text-paper">{siteContact.qq}</span>
            </li>
            <li>
              <span className="text-paper/55">{t.footer.hours}：</span>
              {locale === "zh" ? siteContact.hoursZh : siteContact.hoursEn}
            </li>
          </ul>
        </div>
        <div>
          <PaymentMethods locale={locale} t={t} />
        </div>
      </div>
    </footer>
  );
}
