import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { ToastContainer } from "@/components/ui";
import { BottomTabBar } from "@/components/ui/BottomTabBar";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const dmSerif = DM_Serif_Display({ weight: "400", subsets: ["latin"], variable: "--font-dm-serif" });

export const metadata: Metadata = {
  title: { default: "Quipu — Decentralized Payment Identity", template: "%s · Quipu" },
  description:
    "El primer protocolo que convierte tu historial de pagos QR en crédito justo. Sin banco. Sin colateral. Para los 210M de latinos sin acceso a crédito formal.",
  keywords: ["DPI", "Avalanche", "DeFi", "crédito", "Bolivia", "Latam", "Tigo Money", "zkTLS"],
  authors: [{ name: "Quipu Team" }],
  openGraph: {
    title: "Quipu Protocol",
    description: "Crédito justo para los 210M de latinos sin historial bancario.",
    type: "website",
    locale: "es_BO",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${dmSerif.variable} font-sans antialiased bg-quipu-dark text-quipu-text min-h-screen max-w-[430px] mx-auto relative shadow-2xl overflow-x-hidden bg-quipu-light`}>
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
