import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

/** DESIGN.md: Airbnb Cereal VF unavailable → Inter is the specified open-source substitute */
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
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
    <html lang="zh" className={`${body.variable} ${noto.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
