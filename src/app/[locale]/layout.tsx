import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { TawkChat } from "@/components/TawkChat";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const user = await getSession();

  return (
    <>
      <SiteHeader locale={locale} t={t} user={user} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} t={t} />
      <WhatsAppFloat locale={locale} />
      <TawkChat />
    </>
  );
}
