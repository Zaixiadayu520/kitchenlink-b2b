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
      className="rounded-md border border-white/20 px-2.5 py-1 text-[12px] font-semibold uppercase text-white/80 hover:bg-white/10"
    >
      {other === "zh" ? "中文" : "EN"}
    </Link>
  );
}
