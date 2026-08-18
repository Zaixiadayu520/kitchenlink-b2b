import Image from "next/image";
import type { Dictionary, Locale } from "@/lib/i18n";
import { siteContact } from "@/lib/contact";

export function PaymentMethods({
  locale,
  t,
  orderId,
}: {
  locale: Locale;
  t: Dictionary;
  orderId?: string;
  compact?: boolean;
}) {
  const tip =
    locale === "zh"
      ? orderId ? `付款时请备注订单号：${orderId}` : t.payment.tip
      : orderId ? `Please note order ID when paying: ${orderId}` : t.payment.tip;

  return (
    <div>
      <div className="mb-4 text-[13px] font-bold uppercase tracking-wider text-white/40">
        {t.payment.title}
      </div>
      <p className="mb-3 text-[12px] text-white/50">{tip}</p>
      <div className="grid max-w-[280px] grid-cols-2 gap-2">
        <figure className="overflow-hidden rounded-md bg-white p-1.5">
          <Image src={siteContact.wechatPayQr} alt={t.payment.wechat} width={140} height={180} className="h-auto w-full rounded" />
          <figcaption className="mt-1 text-center text-[11px] font-semibold text-ink">{t.payment.wechat}</figcaption>
        </figure>
        <figure className="overflow-hidden rounded-md bg-white p-1.5">
          <Image src={siteContact.alipayQr} alt={t.payment.alipay} width={140} height={180} className="h-auto w-full rounded" />
          <figcaption className="mt-1 text-center text-[11px] font-semibold text-ink">{t.payment.alipay}</figcaption>
        </figure>
      </div>
      <p className="mt-2 text-[12px] text-white/50">{t.payment.wechatId}：{siteContact.wechat}</p>
    </div>
  );
}

export function PaymentMethodsLight({
  locale, t, orderId,
}: { locale: Locale; t: Dictionary; orderId?: string; }) {
  const tip =
    locale === "zh"
      ? orderId ? `付款时请备注订单号：${orderId}` : t.payment.tip
      : orderId ? `Please note order ID when paying: ${orderId}` : t.payment.tip;
  return (
    <div className="card-elevated mt-6">
      <h2 className="display-md">{t.payment.title}</h2>
      <p className="mt-1 text-sm text-muted">{tip}</p>
      <div className="mt-4 grid max-w-lg grid-cols-2 gap-4">
        <figure>
          <Image src={siteContact.wechatPayQr} alt={t.payment.wechat} width={320} height={400} className="h-auto w-full rounded-lg border border-hairline" />
          <figcaption className="mt-2 text-center text-sm font-medium">{t.payment.wechat}</figcaption>
        </figure>
        <figure>
          <Image src={siteContact.alipayQr} alt={t.payment.alipay} width={320} height={400} className="h-auto w-full rounded-lg border border-hairline" />
          <figcaption className="mt-2 text-center text-sm font-medium">{t.payment.alipay}</figcaption>
        </figure>
      </div>
      <p className="mt-3 text-sm text-muted">{t.payment.wechatId}：<span className="font-medium text-ink">{siteContact.wechat}</span></p>
    </div>
  );
}
