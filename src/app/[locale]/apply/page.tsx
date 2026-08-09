import { notFound } from "next/navigation";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { ApplyForm } from "@/components/Forms";

export default async function ApplyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  return (
    <div className="container-page py-10">
      <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl">{t.applyTitle}</h1>
      <p className="mt-2 max-w-2xl text-muted">{t.applyHint}</p>
      <div className="mt-8">
        <ApplyForm locale={locale} t={t} />
      </div>
    </div>
  );
}
