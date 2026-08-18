"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export function LocaleSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "/zh";
  const rest = pathname.replace(/^\/(zh|en)/, "") || "";
  const other: Locale = locale === "zh" ? "en" : "zh";
  return (
    <Link
      href={`/${other}${rest}`}
      className="flex items-center gap-1.5 rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-[13px] font-semibold text-white transition hover:bg-white/20"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 opacity-70" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6.26 7.37 7H5.07c-.257-.344-.5-.678-.738-1 .001.009 0 .018 0 .027zM10 4c-.61.83-1.12 1.822-1.5 2.973h3c-.38-1.151-.89-2.142-1.5-2.973zM14.93 7h-2.3c.396-.74.858-1.27 1.126-1.679a6.012 6.012 0 011.912 2.706c-.001-.009-.001-.018-.001-.027H14.93zM15.748 9H13.4c.07.328.11.66.11 1s-.04.672-.11 1h2.349a5.96 5.96 0 000-2zm-3.36 0H7.612c-.078.323-.122.659-.122 1s.044.677.122 1h4.776c.078-.323.122-.659.122-1s-.044-.677-.122-1zM4.252 9a5.96 5.96 0 000 2H6.6c-.07-.328-.11-.66-.11-1s.04-.672.11-1H4.252zM7.37 13H5.07c.238-.322.481-.656.738-1h.001a6.012 6.012 0 01-1.912 2.706c-.268-.409-.614-.949-.83-1.706H7.37zm1.13 0h3c-.38 1.151-.89 2.142-1.5 2.973-.61-.83-1.12-1.822-1.5-2.973zm5.43 0h-2.3c-.268.409-.73.949-1.126 1.679a6.012 6.012 0 001.912-2.706H14.93c.257.344.5.678.738 1-.001-.009 0-.018 0 .027h.001z" clipRule="evenodd" />
      </svg>
      {locale === "zh" ? "EN" : "中文"}
    </Link>
  );
}
