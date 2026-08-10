import { notFound } from "next/navigation";
import { getDict, isLocale, type Locale } from "@/lib/i18n";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  return (
    <div className="container-page py-10">
      <h1 className="section-title">{t.aboutTitle}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">{t.aboutBody}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[t.trust.t1, t.trust.t2, t.trust.t3].map((item) => (
          <div key={item} className="card p-5 font-semibold">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
