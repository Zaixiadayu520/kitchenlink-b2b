import Image from "next/image";
import type { Dictionary, Locale } from "@/lib/i18n";
import { siteContact } from "@/lib/contact";

export function PaymentMethods({
  locale,
  t,
  orderId,
  compact = false,
}: {
  locale: Locale;
  t: Dictionary;
  orderId?: string;
  compact?: boolean;
}) {
  const tip =
    locale === "zh"
      ? orderId
        ? `付款时请备注订单号：${orderId}`
        : t.payment.tip
      : orderId
        ? `Please note order ID when paying: ${orderId}`
        : t.payment.tip;

  return (
    <div className={compact ? "mt-4" : ""}>
      <div className="text-[16px] font-medium text-ink">{t.payment.title}</div>
      <p className="mt-1 text-[13px] text-muted">{tip}</p>
      <div className={`mt-4 grid gap-3 ${compact ? "grid-cols-2" : "max-w-md grid-cols-2"}`}>
        <figure className="overflow-hidden rounded-[14px] border border-hairline bg-white p-2">
          <Image
            src={siteContact.wechatPayQr}
            alt={t.payment.wechat}
            width={280}
            height={360}
            className="h-auto w-full rounded-lg"
          />
          <figcaption className="mt-1.5 text-center text-xs font-medium text-ink">
            {t.payment.wechat}
          </figcaption>
        </figure>
        <figure className="overflow-hidden rounded-[14px] border border-hairline bg-white p-2">
          <Image
            src={siteContact.alipayQr}
            alt={t.payment.alipay}
            width={280}
            height={360}
            className="h-auto w-full rounded-lg"
          />
          <figcaption className="mt-1.5 text-center text-xs font-medium text-ink">
            {t.payment.alipay}
          </figcaption>
        </figure>
      </div>
      <p className="mt-2 text-[13px] text-muted">
        {t.payment.wechatId}：{siteContact.wechat}
      </p>
    </div>
  );
}

export function PaymentMethodsLight({
  locale,
  t,
  orderId,
}: {
  locale: Locale;
  t: Dictionary;
  orderId?: string;
}) {
  const tip =
    locale === "zh"
      ? orderId
        ? `付款时请备注订单号：${orderId}`
        : t.payment.tip
      : orderId
        ? `Please note order ID when paying: ${orderId}`
        : t.payment.tip;

  return (
    <div className="card-elevated mt-6">
      <h2 className="display-md">{t.payment.title}</h2>
      <p className="mt-1 text-sm text-muted">{tip}</p>
      <div className="mt-4 grid max-w-lg grid-cols-2 gap-4">
        <figure>
          <Image
            src={siteContact.wechatPayQr}
            alt={t.payment.wechat}
            width={320}
            height={400}
            className="h-auto w-full rounded-[14px] border border-hairline"
          />
          <figcaption className="mt-2 text-center text-sm font-medium">{t.payment.wechat}</figcaption>
        </figure>
        <figure>
          <Image
            src={siteContact.alipayQr}
            alt={t.payment.alipay}
            width={320}
            height={400}
            className="h-auto w-full rounded-[14px] border border-hairline"
          />
          <figcaption className="mt-2 text-center text-sm font-medium">{t.payment.alipay}</figcaption>
        </figure>
      </div>
      <p className="mt-3 text-sm text-muted">
        {t.payment.wechatId}：<span className="font-medium text-ink">{siteContact.wechat}</span>
      </p>
    </div>
  );
}
