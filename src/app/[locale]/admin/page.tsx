import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatUsd, getDict, isLocale, type Locale } from "@/lib/i18n";
import { ApproveButton } from "@/components/ApproveButton";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect(`/${locale}/login`);

  const [applications, customs, orders, products] = await Promise.all([
    prisma.wholesaleApplication.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.customRequest.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.order.findMany({
      include: { user: true, items: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.product.count({ where: { active: true } }),
  ]);

  return (
    <div className="container-page py-10">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">{t.admin.title}</h1>
      <p className="mt-2 text-muted">
        {t.admin.products}: {products}
      </p>

      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">{t.admin.applications}</h2>
        <div className="mt-4 space-y-3">
          {applications.map((a) => (
            <div key={a.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">
                    {a.companyName} · {a.contactName}
                  </div>
                  <div className="text-sm text-muted">
                    {a.email} · {a.phone} · {a.cityState} · {a.businessType}
                  </div>
                  {a.message && <p className="mt-2 text-sm">{a.message}</p>}
                  <p className="mt-1 text-xs text-muted">{a.status}</p>
                </div>
                {a.status === "NEW" && <ApproveButton applicationId={a.id} label={t.admin.approve} />}
              </div>
            </div>
          ))}
          {applications.length === 0 && <p className="text-muted">—</p>}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">{t.admin.customs}</h2>
        <div className="mt-4 space-y-3">
          {customs.map((c) => (
            <div key={c.id} className="card p-4">
              <div className="font-semibold">
                {c.companyName} · {c.contactName}
              </div>
              <div className="text-sm text-muted">
                {c.email} · {c.phone}
              </div>
              <p className="mt-2 text-sm">{c.productNeed}</p>
              <p className="mt-1 text-xs text-muted">
                qty {c.quantity} · {c.status}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">{t.admin.orders}</h2>
        <div className="mt-4 space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="card p-4">
              <div className="font-semibold">
                {o.user.companyName || o.user.name} · {formatUsd(o.totalAmount)}
              </div>
              <div className="text-sm text-muted">
                {o.status} · {o.items.length} lines · {o.createdAt.toISOString().slice(0, 10)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
