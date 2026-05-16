"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { useQuipuStore } from "@/stores/quipu.store";

function SolicitarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const receiveLoan = useQuipuStore((s) => s.receiveLoan);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const monto = Number(searchParams.get("monto")) || 0;
  const plazo = Number(searchParams.get("plazo")) || 3;

  useEffect(() => {
    if (mounted && !monto) {
      router.replace("/prestamos/calculadora");
    }
  }, [mounted, monto, router]);

  const annualRate = 0.18;
  const monthlyRate = annualRate / 12;
  const totalPayable = Math.round(monto * (1 + monthlyRate * plazo));
  const monthlyPayment = Math.round(totalPayable / plazo);
  const informalTotal = Math.round(monto * (1 + 0.15 * plazo));
  const savings = informalTotal - totalPayable;

  if (!mounted) return <div className="min-h-screen bg-quipu-light" />;

  const faqs = [
    {
      q: "¿Qué pasa si no pago?",
      a: "Tu puntaje Yalita bajará y se reducirá tu acceso a futuros préstamos. No cobramos penalidades extra, pero sí se notificará a la red de prestamistas.",
    },
    {
      q: "¿Cómo se calcula mi tasa?",
      a: "Tu tasa se basa directamente en tu puntaje Yalita. Mientras más alto tu puntaje (más historial verificado), menor es tu tasa. El 18% anual es la tasa para scores entre 500-700.",
    },
    {
      q: "¿Puedo pagar antes?",
      a: "¡Sí! Puedes adelantar cuotas o pagar el total en cualquier momento sin ninguna penalización. Además, pagar antes mejora tu puntaje.",
    },
  ];

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      receiveLoan(monto, plazo);
      setSuccess(true);
      setTimeout(() => {
        router.push("/prestamos/activo");
      }, 1500);
    }, 2000);
  };

  if (success) {
    return (
      <main className="min-h-screen bg-quipu-dark flex flex-col items-center justify-center p-6 text-white text-center">
        <CheckCircle2 size={72} className="text-quipu-accent mb-6 animate-fadeInUp" />
        <h1 className="font-serif text-3xl mb-2 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
          ¡Préstamo aprobado!
        </h1>
        <p className="text-quipu-light/70 animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
          Bs {monto.toLocaleString()} ya están en tu cuenta
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-quipu-light flex flex-col">
      <header className="flex items-center p-6 bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b border-quipu-text/5">
        <Link href="/prestamos/calculadora" className="mr-4 text-quipu-text hover:text-quipu-primary transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-serif text-2xl text-quipu-dark">Confirmar préstamo</h1>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Resumen Card */}
        <section
          className="rounded-3xl p-6 text-white shadow-xl relative overflow-hidden animate-gradientMove"
          style={{
            backgroundImage: "linear-gradient(135deg, #1A1A2E 0%, #2D1B69 50%, #1A1A2E 100%)",
            backgroundSize: "200% 200%",
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider text-center mb-2">Solicitando</p>
          <p className="font-serif text-5xl text-center text-quipu-secondary mb-1">
            Bs {monto.toLocaleString()}
          </p>
          <p className="text-center text-sm font-medium text-white/60 mb-6">
            {plazo} {plazo === 1 ? "mes" : "meses"} · 18% anual
          </p>

          <div className="w-full h-px bg-white/10 mb-4" />

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Cuota mensual</span>
              <span className="font-bold text-lg">Bs {monthlyPayment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Total a pagar</span>
              <span className="font-bold text-lg">Bs {totalPayable.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Ahorras vs informal</span>
              <span className="font-bold text-lg text-quipu-accent">Bs {savings.toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* Trust builders */}
        <section className="bg-white rounded-2xl p-5 border border-quipu-text/10 shadow-sm">
          <h3 className="font-bold text-quipu-dark mb-4">¿Tienes dudas?</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-xl shrink-0">🔒</span>
              <p className="text-sm text-quipu-text/70 leading-relaxed">
                <span className="font-bold text-quipu-dark">Sin letra chica.</span>{" "}
                La tasa que ves es la que pagas.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl shrink-0">⚡</span>
              <p className="text-sm text-quipu-text/70 leading-relaxed">
                <span className="font-bold text-quipu-dark">El dinero llega</span>{" "}
                en menos de 1 minuto.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl shrink-0">📞</span>
              <p className="text-sm text-quipu-text/70 leading-relaxed">
                <span className="font-bold text-quipu-dark">Si algo sale mal, estamos aquí.</span>{" "}
                WhatsApp disponible.
              </p>
            </div>
          </div>
        </section>

        {/* How you receive */}
        <section className="bg-white rounded-2xl p-5 border border-quipu-text/10 shadow-sm">
          <h3 className="font-bold text-quipu-dark mb-2">¿Cómo recibirás el dinero?</h3>
          <p className="text-sm text-quipu-text/70 leading-relaxed">
            El dinero llega a tu cuenta digital Yalita en segundos. Puedes usarlo directamente
            para pagar con tu QR o retirarlo en efectivo en cualquier punto autorizado.
          </p>
        </section>

        {/* FAQs */}
        <section className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-quipu-text/10 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-bold text-sm text-quipu-dark">{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp size={20} className="text-quipu-text/40 shrink-0" />
                ) : (
                  <ChevronDown size={20} className="text-quipu-text/40 shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-quipu-text/70 leading-relaxed animate-fadeInUp">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Buttons */}
        <div className="pb-24 space-y-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-quipu-primary hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all flex justify-center items-center space-x-2 shadow-lg shadow-quipu-primary/20 animate-shimmer-btn"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Confirmar y recibir Bs {monto.toLocaleString()}</span>
                <span className="text-xl">→</span>
              </>
            )}
          </button>
          <Link
            href="/prestamos/calculadora"
            className="block w-full text-center py-3 text-sm font-medium text-quipu-text/60 hover:text-quipu-primary transition-colors"
          >
            ← Volver a calcular
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SolicitarPrestamo() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-quipu-light flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-quipu-primary/30 border-t-quipu-primary rounded-full animate-spin" />
      </main>
    }>
      <SolicitarContent />
    </Suspense>
  );
}
