"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Share2,
  Zap,
  CheckCircle2,
  CreditCard,
  X,
} from "lucide-react";
import { useQuipuStore } from "@/stores/quipu.store";

export default function PrestamoActivo() {
  const router = useRouter();
  const activeLoan = useQuipuStore((s) => s.activeLoan);
  const userName = useQuipuStore((s) => s.userName);
  const payInstallment = useQuipuStore((s) => s.payInstallment);
  const receiveQRPayment = useQuipuStore((s) => s.receiveQRPayment);

  const [autoRepay, setAutoRepay] = useState(true);
  const [showPayDrawer, setShowPayDrawer] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [qrSimStep, setQrSimStep] = useState<0 | 1 | 2 | 3>(0);
  const [toast, setToast] = useState("");
  const [chargeAmount, setChargeAmount] = useState("200");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !activeLoan) {
      router.replace("/prestamos/calculadora");
    }
  }, [activeLoan, router, mounted]);

  if (!mounted || !activeLoan)
    return <div className="min-h-screen bg-quipu-light" />;

  const progressPercent =
    (activeLoan.paidInstallments / activeLoan.termMonths) * 100;
  const nextPaymentBs = activeLoan.monthlyPaymentBs;
  const daysUntilDue =
    28 -
    (Math.floor(
      (Date.now() - new Date(activeLoan.createdAt).getTime()) / 86400000
    ) %
      30);
  const paidTowardsPercent = Math.min(
    (activeLoan.paidTowardsNextUsdc / activeLoan.monthlyPaymentUsdc) * 100,
    100
  );

  const qrPayload = JSON.stringify({
    type: "quipu_payment",
    userId: "user_mock",
    loanId: activeLoan.loanId,
    version: "1",
  });

  const handleManualPay = () => {
    const amount = Number(payAmount);
    if (!amount || amount <= 0) return;
    setPayLoading(true);
    setTimeout(() => {
      payInstallment(amount);
      setPayLoading(false);
      setPaySuccess(true);
      setTimeout(() => {
        setShowPayDrawer(false);
        setPaySuccess(false);
        setPayAmount("");
      }, 2500);
    }, 2000);
  };

  const handleSimulateQR = () => {
    const amount = Number(chargeAmount) || 200;
    setQrSimStep(1);

    setTimeout(() => {
      setQrSimStep(2);
      receiveQRPayment(amount, "Cliente");

      const autoAmount = Math.round(amount * 0.1437 * 100) / 100;
      setTimeout(() => {
        setQrSimStep(3);
        setToast(
          `Bs ${autoAmount} destinados a tu cuota automáticamente (14.37% del pago)`
        );
        setTimeout(() => {
          setQrSimStep(0);
          setToast("");
        }, 4000);
      }, 1500);
    }, 1500);
  };

  const handleShare = async () => {
    const shareData = {
      title: "Pago Quipu",
      text: `Pagame con QR Quipu — ${userName}`,
      url: `https://quipu.app/pay?data=${encodeURIComponent(qrPayload)}`,
    };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      setToast("Link copiado al portapapeles ✓");
      setTimeout(() => setToast(""), 2500);
    }
  };

  return (
    <main className="min-h-screen bg-quipu-light flex flex-col pb-24">
      <header className="flex items-center p-6 bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b border-quipu-text/5">
        <Link
          href="/dashboard"
          className="mr-4 text-quipu-text hover:text-quipu-primary transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-serif text-2xl text-quipu-dark">Tu préstamo</h1>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* === STATUS CARD === */}
        <section className="bg-white rounded-2xl p-5 border border-quipu-text/10 shadow-sm animate-fadeInUp">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-quipu-text/50 uppercase tracking-wider">
              Cuotas pagadas
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                activeLoan.status === "active"
                  ? "bg-quipu-accent/10 text-quipu-accent"
                  : activeLoan.status === "paid"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {activeLoan.status === "active"
                ? "Al día ✓"
                : activeLoan.status === "paid"
                ? "Pagado ✓"
                : "Vencido"}
            </span>
          </div>

          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-1 h-3 bg-quipu-text/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-quipu-accent rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-bold text-sm text-quipu-dark whitespace-nowrap">
              {activeLoan.paidInstallments}/{activeLoan.termMonths}
            </span>
          </div>

          <p className="text-sm text-quipu-text/70">
            <span className="font-bold text-quipu-dark">
              Próxima cuota: Bs {nextPaymentBs.toLocaleString()}
            </span>{" "}
            · vence en {daysUntilDue} días
          </p>

          {activeLoan.paidTowardsNextUsdc > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-quipu-text/50 mb-1">
                <span>Abonado a la siguiente cuota</span>
                <span className="font-bold text-quipu-accent">
                  Bs{" "}
                  {Math.round(
                    activeLoan.paidTowardsNextUsdc * 6.96 * 100
                  ) / 100}
                </span>
              </div>
              <div className="h-1.5 bg-quipu-text/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-quipu-secondary/60 rounded-full transition-all duration-700"
                  style={{ width: `${paidTowardsPercent}%` }}
                />
              </div>
            </div>
          )}
        </section>

        {/* === QR SECTION === */}
        <section
          className="bg-white rounded-2xl p-6 border border-quipu-text/10 shadow-sm animate-fadeInUp"
          style={{ animationDelay: "0.1s" }}
        >
          <h3 className="font-bold text-quipu-dark text-lg mb-1">
            Cobra con tu QR Quipu
          </h3>
          <p className="text-sm text-quipu-text/60 mb-6 leading-relaxed">
            Cada vez que cobres, parte de tu ingreso se destina automáticamente
            a tu cuota.
          </p>

          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-2xl border-2 border-quipu-dark/10 shadow-lg">
              <QRCodeSVG
                value={qrPayload}
                size={180}
                bgColor="#ffffff"
                fgColor="#1A1A2E"
                level="M"
                includeMargin={false}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-quipu-text/50 uppercase tracking-wider mb-2 text-center">
              Monto sugerido de cobro
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-quipu-text/40">
                Bs
              </span>
              <input
                type="number"
                value={chargeAmount}
                onChange={(e) => setChargeAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-quipu-light rounded-xl border border-quipu-text/10 text-center font-bold text-lg text-quipu-dark focus:outline-none focus:border-quipu-primary"
              />
            </div>
          </div>

          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-quipu-dark/5 hover:bg-quipu-dark/10 rounded-xl text-sm font-bold text-quipu-dark transition-colors"
          >
            <Share2 size={16} />
            <span>Compartir mi QR</span>
          </button>
        </section>

        {/* === REPAYMENT SECTION === */}
        <section
          className="space-y-4 animate-fadeInUp"
          style={{ animationDelay: "0.2s" }}
        >
          <button
            onClick={() => {
              setPayAmount(String(nextPaymentBs));
              setShowPayDrawer(true);
            }}
            className="w-full bg-quipu-primary hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all flex justify-center items-center space-x-2 shadow-lg shadow-quipu-primary/20"
          >
            <CreditCard size={20} />
            <span>Pagar cuota ahora</span>
          </button>

          <div className="bg-white rounded-2xl p-5 border border-quipu-text/10 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Zap size={18} className="text-quipu-secondary" />
                <span className="font-bold text-sm text-quipu-dark">
                  Repago automático
                </span>
              </div>
              <button
                onClick={() => setAutoRepay(!autoRepay)}
                className={`w-12 h-7 rounded-full transition-all duration-300 relative ${
                  autoRepay ? "bg-quipu-accent" : "bg-quipu-text/20"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm ${
                    autoRepay ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            {autoRepay && (
              <div className="space-y-3">
                <div
                  className={`rounded-xl p-3 text-sm font-medium transition-all duration-500 ${
                    qrSimStep === 0
                      ? "bg-quipu-accent/10 text-quipu-accent"
                      : qrSimStep === 1
                      ? "bg-quipu-secondary/10 text-quipu-secondary"
                      : "bg-quipu-accent/10 text-quipu-accent"
                  }`}
                >
                  {qrSimStep === 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-quipu-accent rounded-full animate-pulse" />
                      <span>🔄 Detectando pagos QR entrantes...</span>
                    </div>
                  )}
                  {qrSimStep === 1 && (
                    <span>
                      💳 Pago detectado: Bs {chargeAmount || 200} de Cliente
                    </span>
                  )}
                  {qrSimStep >= 2 && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 size={16} />
                      <span>✅ Repago aplicado exitosamente</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSimulateQR}
                  disabled={qrSimStep > 0}
                  className="w-full py-3 bg-quipu-dark/5 hover:bg-quipu-dark/10 disabled:opacity-40 rounded-xl text-sm font-bold text-quipu-dark transition-colors"
                >
                  Simular pago QR entrante (Bs {chargeAmount || 200})
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* === TOAST === */}
      {toast && (
        <div className="fixed bottom-20 left-4 right-4 max-w-[430px] mx-auto bg-quipu-dark text-white py-3 px-4 rounded-xl shadow-xl text-sm font-medium text-center animate-fadeInUp z-50">
          {toast}
        </div>
      )}

      {/* === BOTTOM SHEET: PAGAR CUOTA === */}
      {showPayDrawer && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !payLoading && setShowPayDrawer(false)}
          />
          <div className="relative w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-10 animate-slideUp z-10">
            <div className="w-12 h-1 bg-quipu-text/20 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl text-quipu-dark">
                Pagar cuota
              </h3>
              <button
                onClick={() => !payLoading && setShowPayDrawer(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-quipu-text/5"
              >
                <X size={18} />
              </button>
            </div>

            {paySuccess ? (
              <div className="text-center py-6 animate-fadeInUp">
                <CheckCircle2
                  size={56}
                  className="text-quipu-accent mx-auto mb-4"
                />
                <p className="font-serif text-2xl text-quipu-dark mb-2">
                  ¡Pagaste Bs {Number(payAmount).toLocaleString()}!
                </p>
                <p className="text-sm text-quipu-text/60">
                  Tu score subió 12 puntos 🎉
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-xs font-bold text-quipu-text/50 uppercase tracking-wider mb-2">
                    Monto a pagar
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-quipu-text/40">
                      Bs
                    </span>
                    <input
                      type="number"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-quipu-light rounded-xl border border-quipu-text/10 font-bold text-xl text-quipu-dark focus:outline-none focus:border-quipu-primary"
                    />
                  </div>
                </div>
                <button
                  onClick={handleManualPay}
                  disabled={payLoading || !Number(payAmount)}
                  className="w-full bg-quipu-primary hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition-all flex justify-center items-center space-x-2"
                >
                  {payLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Confirmar pago</span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
