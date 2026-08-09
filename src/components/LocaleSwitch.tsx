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
      className="rounded-full border border-white/25 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white/85"
    >
      {other === "zh" ? "中文" : "EN"}
    </Link>
  );
}
