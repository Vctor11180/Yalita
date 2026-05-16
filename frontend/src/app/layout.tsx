import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Serif_Display, Lora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { ToastContainer } from "@/components/ui";
import { BottomTabBar } from "@/components/ui/BottomTabBar";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const dmSerif = DM_Serif_Display({ weight: "400", subsets: ["latin"], variable: "--font-dm-serif" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lora" });

export const metadata: Metadata = {
  title: { default: "Yalita — Decentralized Payment Identity", template: "%s · Yalita" },
  description:
    "El primer protocolo que convierte tu historial de pagos QR en crédito justo. Sin banco. Sin colateral. Para los 210M de latinos sin acceso a crédito formal.",
  keywords: ["DPI", "Avalanche", "DeFi", "crédito", "Bolivia", "Latam", "Tigo Money", "zkTLS"],
  authors: [{ name: "Yalita Team" }],
  openGraph: {
    title: "Yalita Protocol",
    description: "Crédito justo para los 210M de latinos sin historial bancario.",
    type: "website",
    locale: "es_BO",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: `
          try {
            var t = localStorage.getItem('yalita-theme') || 'light';
            document.documentElement.setAttribute('data-theme', t);
          } catch(e) {}
        `}} />
      </head>
      <body className={`${jakarta.variable} ${dmSerif.variable} ${lora.variable} font-sans antialiased min-h-screen max-w-[430px] mx-auto relative shadow-2xl overflow-x-hidden`}
        style={{ backgroundColor: "var(--y-bg)", color: "var(--y-text-primary)" }}
      >
        <Providers>
          <div className="pb-16 min-h-screen">
            {children}
          </div>
          <BottomTabBar />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
