"use client";

import { siteContact, whatsappUrl } from "@/lib/contact";
import type { Locale } from "@/lib/i18n";

export function WhatsAppFloat({ locale }: { locale: Locale }) {
  const text =
    locale === "zh"
      ? "您好，我想咨询美国中餐/商超批发供货。"
      : "Hi, I am interested in wholesale supply for a Chinese restaurant / market.";

  return (
    <a
      href={whatsappUrl(text)}
      target="_blank"
      rel="noreferrer"
      aria-label={locale === "zh" ? "WhatsApp 咨询" : "Chat on WhatsApp"}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition hover:scale-105 hover:bg-[#1ebe57] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] max-md:bottom-[calc(1.25rem+env(safe-area-inset-bottom))]"
      title={locale === "zh" ? `WhatsApp ${siteContact.phoneDisplay}` : `WhatsApp ${siteContact.phoneDisplay}`}
    >
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.01 3C9.39 3 4.02 8.36 4.02 14.98c0 2.64.86 5.09 2.33 7.08L4 29l7.14-2.29A11.9 11.9 0 0 0 16.01 27c6.62 0 11.99-5.37 11.99-11.99C28 8.38 22.63 3 16.01 3zm0 21.82c-2.17 0-4.19-.64-5.89-1.74l-.42-.26-4.24 1.36 1.38-4.13-.27-.43a9.72 9.72 0 0 1-1.5-5.14c0-5.38 4.38-9.76 9.76-9.76s9.76 4.38 9.76 9.76-4.38 9.76-9.76 9.76zm5.36-7.31c-.29-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.19.29-.76.95-.93 1.14-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.15-.17.19-.29.29-.49.1-.19.05-.37-.02-.52-.07-.15-.66-1.59-.9-2.18-.24-.57-.48-.49-.66-.5h-.56c-.19 0-.5.07-.76.37-.26.29-1 1-1 2.43s1.02 2.82 1.17 3.01c.14.19 2.01 3.07 4.87 4.31.68.29 1.21.47 1.62.6.68.21 1.3.18 1.79.11.55-.08 1.73-.71 1.97-1.39.24-.68.24-1.27.17-1.39-.07-.12-.26-.19-.55-.34z"
        />
      </svg>
    </a>
  );
}
