import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export async function POST(req: Request) {
  await clearSession();
  const url = new URL(req.url);
  const locale = url.searchParams.get("locale") === "en" ? "en" : "zh";
  return NextResponse.redirect(new URL(`/${locale}`, url.origin), 303);
}
