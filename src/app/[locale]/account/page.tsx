import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatUsd, getDict, isLocale, type Locale } from "@/lib/i18n";

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const session = await getSession();
  if (!session) redirect(`/${locale}/login`);

  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="container-page py-10">
      <h1 className="section-title">{t.nav.account}</h1>
      <div className="card mt-6 p-5">
        <p className="font-semibold">{session.name}</p>
        <p className="text-sm text-muted">{session.email}</p>
        <p className="mt-1 text-sm text-muted">{session.companyName}</p>
        <p className="mt-3 inline-flex rounded-full bg-highlight/80 px-3 py-1 text-xs font-semibold">
          {session.role}
        </p>
        {session.role === "ADMIN" && (
          <div className="mt-4">
            <Link href={`/${locale}/admin`} className="btn btn-secondary !py-2 text-sm">
              {t.nav.admin}
            </Link>
          </div>
        )}
      </div>

      <h2 className="mt-10 display-md">{t.admin.orders}</h2>
      <div className="mt-4 space-y-3">
        {orders.length === 0 && <p className="text-muted">{t.cart.empty}</p>}
        {orders.map((o) => (
          <div key={o.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-semibold">#{o.id.slice(-8).toUpperCase()}</div>
              <div className="text-sm text-muted">
                {o.status} · {formatUsd(o.totalAmount)}
              </div>
            </div>
            <ul className="mt-2 text-sm text-ink-soft">
              {o.items.map((i) => (
                <li key={i.id}>
                  {(locale === "zh" ? i.product.nameZh : i.product.nameEn) + ` × ${i.quantity}`}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
