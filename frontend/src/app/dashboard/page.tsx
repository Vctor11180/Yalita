"use client";

import { useState, useEffect, useCallback } from "react";
import { QRBottomSheet } from "@/components/ui/QRBottomSheet";
import { Bell, ArrowRight, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useQuipuStore } from "@/stores/quipu.store";

// ─── HELPER: Relative time in Modo Doña ───
function timeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "ayer";
  return `hace ${days} días`;
}

const TX_ICONS: Record<string, string> = {
  loan_received: "💰",
  qr_received: "📲",
  loan_payment: "✅",
  qr_sent: "📤",
};

const BANNERS = [
  {
    emoji: "💡",
    title: "Tu historial de pagos ES tu garantía",
    text: "No necesitas casa, carro ni aval. Si cobras seguido por QR, Yalita lo sabe y te presta a tasa justa.",
    cta: "Ver cómo se calcula →",
    href: "/como-funciona",
    accent: "bg-quipu-primary/10",
  },
  {
    emoji: "📱",
    title: "Muestra el QR, cobra al instante",
    text: "Tu cliente escanea tu código y te paga en segundos. Sin efectivo, sin vuelto, sin riesgo.",
    cta: "Ver mi QR →",
    href: "__qr__",
    accent: "bg-quipu-secondary/10",
  },
  {
    emoji: "🔄",
    title: "Cada cobro que haces paga tu deuda solo",
    text: "Cuando activas el repago automático, un pequeño porcentaje de cada cobro QR se descuenta de tu cuota.",
    cta: "Activar repago automático →",
    href: "/prestamos/activo",
    accent: "bg-quipu-accent/10",
  },
  {
    emoji: "🔒",
    title: "Tus datos no se venden ni se guardan",
    text: "Solo vemos qué tanto cobras, no a quién ni qué vendes. Tú controlas tu información en todo momento.",
    cta: "Leer más →",
    href: "/como-funciona",
    accent: "bg-blue-100",
  },
];

export default function Dashboard() {
  const userName = useQuipuStore((s) => s.userName);
  const score = useQuipuStore((s) => s.score);
  const balanceUsdc = useQuipuStore((s) => s.balanceUsdc);
  const getBalanceBs = useQuipuStore((s) => s.getBalanceBs);
  const getCreditLimitBs = useQuipuStore((s) => s.getCreditLimitBs);
  const getAvailableCreditBs = useQuipuStore((s) => s.getAvailableCreditBs);
  const activeLoan = useQuipuStore((s) => s.activeLoan);
  const transactions = useQuipuStore((s) => s.transactions);

  const [mounted, setMounted] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrMode, setQrMode] = useState<"cobrar" | "pagar_cuota" | "pagar_qr" | undefined>();
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [mounted]);

  const handleBannerCta = useCallback((href: string) => {
    if (href === "__qr__") {
      setQrMode("cobrar");
      setQrOpen(true);
    }
  }, []);

  const openQr = (mode: "cobrar" | "pagar_cuota" | "pagar_qr") => {
    setQrMode(mode);
    setQrOpen(true);
  };

  if (!mounted) return <div className="bg-quipu-light min-h-screen" />;

  const balanceBs = getBalanceBs();
  const hasActiveLoan = activeLoan && activeLoan.status === "active";
  const creditLimitBs = getCreditLimitBs();
  const availableCreditBs = getAvailableCreditBs();
  const recentTx = transactions.slice(0, 3);

  const daysUntilDue = hasActiveLoan
    ? Math.max(
        0,
        28 -
          (Math.floor(
            (Date.now() - new Date(activeLoan!.createdAt).getTime()) / 86400000
          ) %
            30)
      )
    : 0;

  return (
    <main className="bg-quipu-light min-h-screen pb-24">
      {/* ─── HEADER ─── */}
      <header className="flex justify-between items-center p-6 bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b border-quipu-text/5">
        <div>
          <h1 className="font-serif text-2xl text-quipu-dark">
            Buenos días, {userName.split(" ")[0]} ☀️
          </h1>
          <p className="text-sm font-medium text-quipu-text/60">
            Tu billetera Yalita
          </p>
        </div>
        <button className="relative w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-quipu-text/10 text-quipu-text">
          <Bell size={20} />
          {transactions.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-quipu-primary rounded-full border-2 border-white" />
          )}
        </button>
      </header>

      <div className="p-6 space-y-5">
        {/* ─── SALDO PRINCIPAL ─── */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-quipu-text/5 animate-fadeInUp">
          <p className="text-xs font-bold text-quipu-text/40 uppercase tracking-wider mb-1">
            Tu saldo Yalita
          </p>
          <p className="font-serif text-5xl text-quipu-dark tracking-tight">
            Bs{" "}
            {balanceBs.toLocaleString("es-BO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-quipu-text/30 mt-1">
            ≈ {balanceUsdc.toFixed(2)} USDC
          </p>
          <div className="flex items-center mt-3 space-x-2">
            {balanceBs > 0 ? (
              <span className="text-[10px] font-bold text-quipu-accent flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-quipu-accent rounded-full" />
                <span>Activo</span>
              </span>
            ) : !activeLoan ? (
              <Link
                href="/prestamos/calculadora"
                className="text-xs font-bold text-quipu-primary"
              >
                Pide tu primer préstamo →
              </Link>
            ) : null}
          </div>
        </section>

        {/* ─── SCORE COMPACTO ─── */}
        <section
          className="rounded-2xl p-4 text-white relative overflow-hidden animate-fadeInUp shadow-lg"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #1A1A2E 0%, #2D1B69 100%)",
            animationDelay: "0.1s",
          }}
        >
          <div className="flex items-center space-x-4">
            {/* Mini score */}
            <div className="w-16 h-16 rounded-full border-[3px] border-quipu-secondary flex items-center justify-center shrink-0 bg-white/5 shadow-[0_0_15px_rgba(243,156,18,0.2)]">
              <span className="font-serif text-2xl text-quipu-secondary">
                {score}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-white flex items-center gap-1">
                Tu Poder Yalita <ShieldCheck size={14} className="text-quipu-accent" />
              </p>
              <p className="text-[11px] text-white/60 mt-0.5 leading-tight">
                Este número es tu llave: a mayor puntaje, podrás pedir préstamos más grandes y baratos.
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-white/50">
                  Crédito:{" "}
                  <span className="text-quipu-secondary font-bold">
                    Bs {availableCreditBs.toLocaleString()}
                  </span>
                </p>
                <Link
                  href="/como-funciona"
                  className="text-[10px] bg-white/10 px-2 py-1 rounded-lg text-quipu-secondary font-bold hover:bg-white/20 transition-all"
                >
                  Subir mi límite →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── ACTIVE LOAN CARD (conditional) ─── */}
        {hasActiveLoan && (
          <section
            className="rounded-2xl p-5 text-white relative overflow-hidden animate-fadeInUp"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #1A1A2E 0%, #2D1B69 100%)",
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-medium text-white/50 uppercase tracking-wider">
                Tu préstamo activo
              </p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-quipu-accent/20 text-quipu-accent">
                Al día ✓
              </span>
            </div>

            <p className="font-serif text-3xl text-quipu-secondary mb-1">
              Bs {activeLoan!.monthlyPaymentBs.toLocaleString()}
            </p>
            <p className="text-sm text-white/60 mb-4">
              próxima cuota · vence en {daysUntilDue} días
            </p>

            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-quipu-accent rounded-full transition-all duration-700"
                  style={{
                    width: `${
                      (activeLoan!.paidInstallments /
                        activeLoan!.termMonths) *
                      100
                    }%`,
                  }}
                />
              </div>
              <span className="text-xs font-bold text-white/70">
                {activeLoan!.paidInstallments}/{activeLoan!.termMonths}
              </span>
            </div>

            <button
              onClick={() => openQr("pagar_cuota")}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 active:scale-[0.97]"
            >
              <CreditCard size={16} />
              <span>Pagar ahora</span>
            </button>
          </section>
        )}

        {/* ─── ACTION BUTTONS 2×2 ─── */}
        <section>
          <h2 className="text-lg font-bold text-quipu-dark mb-4">
            ¿Qué quieres hacer?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* COBRAR */}
            <button
              onClick={() => openQr("cobrar")}
              className="rounded-2xl p-5 text-left transition-all active:scale-[0.97]"
              style={{ backgroundColor: "#C0392B", minHeight: "110px" }}
            >
              <span className="text-3xl block mb-2">💳</span>
              <p className="font-bold text-white text-[15px]">Cobrar</p>
              <p className="text-[11px] text-white/70 mt-0.5">
                Muestra tu QR y recibe pagos
              </p>
            </button>

            {/* PAGAR QR */}
            <button
              onClick={() => openQr("pagar_qr")}
              className="rounded-2xl p-5 text-left transition-all active:scale-[0.97]"
              style={{ backgroundColor: "#2D2D4E", minHeight: "110px" }}
            >
              <span className="text-3xl block mb-2">📤</span>
              <p className="font-bold text-white text-[15px]">Pagar QR</p>
              <p className="text-[11px] text-white/70 mt-0.5">
                Escanea o paga cuotas
              </p>
            </button>

            {/* PEDIR PRÉSTAMO */}
            <Link
              href="/prestamos/calculadora"
              className="rounded-2xl p-5 text-left transition-all active:scale-[0.97]"
              style={{ backgroundColor: "#F39C12", minHeight: "110px" }}
            >
              <span className="text-3xl block mb-2">💰</span>
              <p className="font-bold text-[#1A1A2E] text-[15px]">
                Pedir préstamo
              </p>
              <p className="text-[11px] text-[#1A1A2E]/60 mt-0.5">
                Hasta Bs {creditLimitBs.toLocaleString()}
              </p>
            </Link>

            {/* MI HISTORIAL o PAGAR DEUDA */}
            {hasActiveLoan ? (
              <button
                onClick={() => openQr("pagar_cuota")}
                className="rounded-2xl p-5 text-left transition-all active:scale-[0.97]"
                style={{ backgroundColor: "#27AE60", minHeight: "110px" }}
              >
                <span className="text-3xl block mb-2">✅</span>
                <p className="font-bold text-white text-[15px]">Pagar deuda</p>
                <p className="text-[11px] text-white/70 mt-0.5">
                  Cuota: Bs {activeLoan!.monthlyPaymentBs.toLocaleString()}
                </p>
              </button>
            ) : (
              <Link
                href="/historial"
                className="rounded-2xl p-5 text-left transition-all active:scale-[0.97]"
                style={{ backgroundColor: "#2D2D4E", minHeight: "110px" }}
              >
                <span className="text-3xl block mb-2">📊</span>
                <p className="font-bold text-white text-[15px]">Mi historial</p>
                <p className="text-[11px] text-white/70 mt-0.5">
                  Ver tus movimientos
                </p>
              </Link>
            )}
          </div>
        </section>


        {/* ─── ÚLTIMOS MOVIMIENTOS ─── */}
        {recentTx.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-quipu-dark mb-3">
              Últimos movimientos
            </h2>
            <div className="bg-white rounded-2xl border border-quipu-text/5 shadow-sm divide-y divide-quipu-text/5">
              {recentTx.map((tx) => {
                const isIncome =
                  tx.type === "loan_received" || tx.type === "qr_received";
                return (
                  <div key={tx.id} className="flex items-center p-4 space-x-3">
                    <span className="text-2xl shrink-0">
                      {TX_ICONS[tx.type] || "📋"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-quipu-dark truncate">
                        {tx.description}
                      </p>
                      <p className="text-[10px] text-quipu-text/40">
                        {timeAgo(tx.timestamp)}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-bold shrink-0 ${
                        isIncome ? "text-quipu-accent" : "text-quipu-primary"
                      }`}
                    >
                      {isIncome ? "+" : "-"}Bs{" "}
                      {tx.amountBs.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
            <Link
              href="/historial"
              className="block text-center text-xs font-bold text-quipu-primary mt-3"
            >
              Ver todos los movimientos →
            </Link>
          </section>
        )}

        {/* ─── ROTATING BANNERS ─── */}
        <section>
          <div className="relative overflow-hidden rounded-2xl border border-[#E8E0D0] bg-white shadow-sm">
            {BANNERS.map((banner, i) => (
              <div
                key={i}
                className="p-5 transition-opacity duration-500"
                style={{
                  display: i === bannerIndex ? "block" : "none",
                  opacity: i === bannerIndex ? 1 : 0,
                }}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-11 h-11 rounded-full ${banner.accent} flex items-center justify-center text-xl shrink-0`}
                  >
                    {banner.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-[#2C2C2C] mb-1">
                      {banner.title}
                    </h4>
                    <p className="text-[12px] text-[#2C2C2C]/70 leading-relaxed mb-3">
                      {banner.text}
                    </p>
                    {banner.href === "__qr__" ? (
                      <button
                        onClick={() => handleBannerCta(banner.href)}
                        className="text-xs font-bold text-quipu-primary"
                      >
                        {banner.cta}
                      </button>
                    ) : (
                      <Link
                        href={banner.href}
                        className="text-xs font-bold text-quipu-primary"
                      >
                        {banner.cta}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center space-x-1.5 pb-4">
              {BANNERS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBannerIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === bannerIndex
                      ? "bg-quipu-primary w-4"
                      : "bg-quipu-text/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* QR Bottom Sheet */}
      <QRBottomSheet
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        {...(qrMode ? { mode: qrMode } : {})}
      />
    </main>
  );
}
