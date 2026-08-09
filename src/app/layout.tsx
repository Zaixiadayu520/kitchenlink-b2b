import type { Metadata } from "next";
import { Fraunces, Source_Sans_3, Noto_Sans_SC } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
});

const noto = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: {
    default: "KitchenLink · 美国中餐商超批发",
    template: "%s · KitchenLink",
  },
  description:
    "B2B wholesale FMCG for Chinese restaurants and Asian markets in the United States. Case pricing, custom sourcing, bilingual support.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" className={`${display.variable} ${body.variable} ${noto.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
