"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatUsd, getDict, type Locale } from "@/lib/i18n";

export default function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = use(params);
  const locale = (raw === "en" ? "en" : "zh") as Locale;
  const t = getDict(locale);
  const { lines, setQty, remove, total, clear } = useCart();
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit() {
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        note,
        items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMsg(data.error || "Failed");
      return;
    }
    clear();
    setMsg(t.form.success);
    router.refresh();
  }

  if (lines.length === 0) {
    return (
      <div className="container-page py-10">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">{t.cart.title}</h1>
        <p className="mt-4 text-muted">{t.cart.empty}</p>
        <Link href={`/${locale}/catalog`} className="btn btn-primary mt-6 inline-flex">
          {t.nav.catalog}
        </Link>
        {msg && <p className="mt-4 text-accent-2">{msg}</p>}
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">{t.cart.title}</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-3">
          {lines.map((l) => (
            <div key={l.productId} className="card flex flex-wrap items-center gap-4 p-4">
              <div className="text-3xl">{l.imageEmoji}</div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{locale === "zh" ? l.nameZh : l.nameEn}</div>
                <div className="text-sm text-muted">
                  {formatUsd(l.unitPrice)} / {locale === "zh" ? l.unitZh : l.unitEn}
                </div>
              </div>
              <label className="text-sm">
                {t.cart.qty}
                <input
                  type="number"
                  min={l.moq}
                  className="input ml-2 w-20"
                  value={l.quantity}
                  onChange={(e) => setQty(l.productId, Number(e.target.value))}
                />
              </label>
              <div className="w-24 text-right font-semibold">{formatUsd(l.unitPrice * l.quantity)}</div>
              <button className="text-sm text-accent" type="button" onClick={() => remove(l.productId)}>
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="card h-fit p-5">
          <div className="flex justify-between text-lg font-semibold">
            <span>{t.cart.total}</span>
            <span>{formatUsd(total)}</span>
          </div>
          <label className="label mt-4">{t.cart.note}</label>
          <textarea className="input min-h-24" value={note} onChange={(e) => setNote(e.target.value)} />
          <button className="btn btn-primary mt-4 w-full" disabled={loading} type="button" onClick={submit}>
            {loading ? t.form.submitting : t.cart.submit}
          </button>
          {msg && <p className="mt-3 text-sm text-accent-2">{msg}</p>}
          <p className="mt-3 text-xs text-muted">{t.cart.needLogin}</p>
        </div>
      </div>
    </div>
  );
}
