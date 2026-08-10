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
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas text-ink">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link href={base} className="min-w-0 shrink-0">
          <div className="text-[18px] font-semibold tracking-tight text-primary md:text-[20px]">
            {t.brand}
          </div>
          <div className="hidden truncate text-[12px] font-medium text-muted sm:block">{t.tagline}</div>
        </Link>
        <nav className="hidden items-center gap-7 text-[16px] font-semibold text-ink lg:flex">
          <Link className="hover:text-muted" href={`${base}/catalog`}>
            {t.nav.catalog}
          </Link>
          <Link className="hover:text-muted" href={`${base}/custom`}>
            {t.nav.custom}
          </Link>
          <Link className="hover:text-muted" href={`${base}/apply`}>
            {t.nav.apply}
          </Link>
          <Link className="hover:text-muted" href={`${base}/about`}>
            {t.nav.about}
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitch locale={locale} />
          <Link
            href={`${base}/cart`}
            className="rounded-full border border-hairline px-3.5 py-2 text-sm font-medium text-ink hover:bg-surface-soft"
          >
            <CartBadge label={t.nav.cart} />
          </Link>
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link href={`${base}/admin`} className="hidden text-sm font-semibold text-primary sm:inline">
                  {t.nav.admin}
                </Link>
              )}
              <Link href={`${base}/account`} className="hidden text-sm font-medium text-ink sm:inline">
                {user.name}
              </Link>
              <form action={`/api/auth/logout?locale=${locale}`} method="post">
                <button className="text-sm font-medium text-muted hover:text-ink" type="submit">
                  {t.nav.logout}
                </button>
              </form>
            </>
          ) : (
            <Link href={`${base}/login`} className="btn-pill !min-h-0">
              {t.nav.login}
            </Link>
          )}
        </div>
      </div>
      <div className="container-page flex gap-5 overflow-x-auto border-t border-hairline-soft pb-3 pt-2 text-sm font-semibold text-muted lg:hidden">
        <Link className="whitespace-nowrap hover:text-ink" href={`${base}/catalog`}>
          {t.nav.catalog}
        </Link>
        <Link className="whitespace-nowrap hover:text-ink" href={`${base}/custom`}>
          {t.nav.custom}
        </Link>
        <Link className="whitespace-nowrap hover:text-ink" href={`${base}/apply`}>
          {t.nav.apply}
        </Link>
        <Link className="whitespace-nowrap hover:text-ink" href={`${base}/about`}>
          {t.nav.about}
        </Link>
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
    <footer className="mt-auto border-t border-hairline bg-canvas text-ink">
      <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-3 lg:gap-8">
        <div>
          <div className="text-[16px] font-medium">{t.brand}</div>
          <p className="mt-3 max-w-sm text-sm text-muted">{t.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a className="btn btn-primary !min-h-10 !px-5 !py-2 !text-sm" href={`tel:${siteContact.phoneTel}`}>
              {t.footer.phone}
            </a>
            <a
              className="btn btn-ghost !min-h-10 !px-5 !py-2 !text-sm"
              href={whatsappUrl(waText)}
              target="_blank"
              rel="noreferrer"
            >
              {t.footer.whatsapp}
            </a>
            <a className="btn btn-ghost !min-h-10 !px-5 !py-2 !text-sm" href={`mailto:${siteContact.email}`}>
              {t.footer.email}
            </a>
          </div>
        </div>
        <div className="text-sm">
          <div className="text-[16px] font-medium">{t.footer.contact}</div>
          <ul className="mt-4 space-y-3 text-ink">
            <li>
              <span className="text-muted">{t.footer.phone}：</span>
              <a className="underline-offset-2 hover:underline" href={`tel:${siteContact.phoneTel}`}>
                {siteContact.phoneDisplay}
              </a>
            </li>
            <li>
              <span className="text-muted">{t.footer.email}：</span>
              <a className="underline-offset-2 hover:underline" href={`mailto:${siteContact.email}`}>
                {siteContact.email}
              </a>
            </li>
            <li>
              <span className="text-muted">{t.footer.wechat}：</span>
              {siteContact.wechat}
            </li>
            <li>
              <span className="text-muted">{t.footer.qq}：</span>
              {siteContact.qq}
            </li>
            <li className="text-muted">
              <span>{t.footer.hours}：</span>
              {locale === "zh" ? siteContact.hoursZh : siteContact.hoursEn}
            </li>
          </ul>
        </div>
        <div>
          <PaymentMethods locale={locale} t={t} />
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-4 text-[13px] text-muted">
          <p>{t.footer.rights}</p>
          <p>
            {siteContact.phoneDisplay} · {siteContact.email}
          </p>
        </div>
      </div>
    </footer>
  );
}
