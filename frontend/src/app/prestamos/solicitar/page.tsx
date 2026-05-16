"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { useQuipuStore } from "@/stores/quipu.store";

type OverlayState = "verifying" | "confirmed" | "receipt";

function generateMockTxHash(): string {
  return "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
}

function truncateHash(hash: string): string {
  return hash.slice(0, 8) + "..." + hash.slice(-4);
}

function SolicitarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const receiveLoan = useQuipuStore((s) => s.receiveLoan);
  const score = useQuipuStore((s) => s.score);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [overlayState, setOverlayState] = useState<OverlayState | null>(null);
  const [txHash, setTxHash] = useState("");
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

  if (!mounted) return <div style={{ background: "var(--y-bg)" }} className="min-h-screen" />;

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
    setOverlayState("verifying");

    setTimeout(() => {
      setOverlayState("confirmed");
    }, 1200);

    setTimeout(() => {
      const hash = generateMockTxHash();
      setTxHash(hash);
      receiveLoan(monto, plazo);
      setOverlayState("receipt");
    }, 2500);
  };

  const today = new Date().toLocaleDateString("es-BO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ─── OVERLAY DE TRANSACCIÓN BLOCKCHAIN ───
  if (overlayState) {
    return (
      <main
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
        style={{ backgroundColor: "rgba(13,17,23,0.97)" }}
      >
        {overlayState === "verifying" && (
          <div className="flex flex-col items-center text-center animate-fadeInUp">
            <div className="w-20 h-20 mb-6 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: "2s" }}>
                <polygon points="50,10 90,80 10,80" fill="none" stroke="var(--y-primary)" strokeWidth="4" strokeLinejoin="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full animate-pulse" style={{ background: "var(--y-primary)" }} />
              </div>
            </div>
            <h2 className="font-serif text-2xl mb-2" style={{ color: "var(--y-text-on-dark)" }}>
              Asegurando fondos en Avalanche Fuji...
            </h2>
            <p className="text-sm" style={{ color: "var(--y-text-on-dark-muted)" }}>Verificando tu puntaje on-chain</p>
          </div>
        )}

        {overlayState === "confirmed" && (
          <div className="flex flex-col items-center text-center animate-fadeInUp">
            <div className="w-20 h-20 mb-6 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--y-green)" strokeWidth="4" strokeDasharray="283" strokeDashoffset="0" className="transition-all duration-700" />
                <path d="M30 50 L45 65 L70 35" fill="none" stroke="var(--y-green)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl mb-2" style={{ color: "var(--y-text-on-dark)" }}>
              ¡Puntaje verificado! ({score} puntos)
            </h2>
            <p className="text-sm" style={{ color: "var(--y-text-on-dark-muted)" }}>Transfiriendo fondos al instante...</p>
          </div>
        )}

        {overlayState === "receipt" && (
          <div className="w-full max-w-sm animate-fadeInUp">
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: "var(--y-surface)", border: "1px solid var(--y-border)" }}>
              <div className="p-5 text-center" style={{ background: "var(--y-green)" }}>
                <CheckCircle2 size={48} className="mx-auto mb-2" style={{ color: "var(--y-text-on-dark)" }} />
                <h2 className="font-serif text-2xl" style={{ color: "var(--y-text-on-dark)" }}>¡Préstamo aprobado!</h2>
              </div>

              <div className="p-6 space-y-4">
                <p className="font-lora text-4xl text-center" style={{ color: "var(--y-text-primary)" }}>
                  Bs {monto.toLocaleString()}
                </p>
                <p className="text-center text-sm" style={{ color: "var(--y-text-tertiary)" }}>en tu cuenta</p>

                <div style={{ borderTop: "1px dashed var(--y-border)" }} className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--y-text-tertiary)" }}>Transacción</span>
                    <span className="font-mono text-xs font-bold" style={{ color: "var(--y-text-secondary)" }}>{truncateHash(txHash)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--y-text-tertiary)" }}>Red</span>
                    <span className="font-bold" style={{ color: "var(--y-text-primary)" }}>Avalanche Fuji</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--y-text-tertiary)" }}>Fecha</span>
                    <span className="font-bold" style={{ color: "var(--y-text-primary)" }}>{today}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--y-text-tertiary)" }}>Estado</span>
                    <span className="font-bold" style={{ color: "var(--y-green)" }}>Confirmada ✓</span>
                  </div>
                </div>

                <div style={{ borderTop: "1px dashed var(--y-border)" }} className="my-4" />

                <a
                  href={`https://testnet.snowtrace.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-sm font-bold hover:underline"
                  style={{ color: "var(--y-primary)" }}
                >
                  Ver en Snowtrace ↗
                </a>
              </div>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full mt-5 font-semibold py-4 rounded-xl transition-all shadow-lg active:scale-[0.97]"
              style={{ background: "var(--y-primary)", color: "var(--y-text-on-dark)" }}
            >
              Ir a mi billetera →
            </button>
          </div>
        )}
      </main>
    );
  }

  return (
    <main style={{ background: "var(--y-bg)" }} className="min-h-screen flex flex-col">
      <header
        className="flex items-center p-6 backdrop-blur-md sticky top-0 z-10"
        style={{
          background: "color-mix(in srgb, var(--y-surface) 80%, transparent)",
          borderBottom: "1px solid var(--y-border)",
        }}
      >
        <Link href="/prestamos/calculadora" className="mr-4 transition-colors" style={{ color: "var(--y-text-primary)" }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-serif text-2xl" style={{ color: "var(--y-text-primary)" }}>Confirmar préstamo</h1>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Resumen Card */}
        <section
          className="rounded-3xl p-6 shadow-xl relative overflow-hidden animate-gradientMove"
          style={{
            backgroundImage: `linear-gradient(135deg, var(--y-card-dark) 0%, #2D1B69 50%, var(--y-card-dark) 100%)`,
            backgroundSize: "200% 200%",
            color: "var(--y-text-on-dark)",
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <p className="text-xs font-medium uppercase tracking-wider text-center mb-2" style={{ color: "var(--y-text-on-dark-muted)" }}>Solicitando</p>
          <p className="font-lora text-5xl text-center mb-1" style={{ color: "var(--y-amber)" }}>
            Bs {monto.toLocaleString()}
          </p>
          <p className="text-center text-sm font-medium mb-6" style={{ color: "var(--y-text-on-dark-muted)" }}>
            {plazo} {plazo === 1 ? "mes" : "meses"} · 18% anual
          </p>

          <div className="w-full h-px mb-4" style={{ background: "rgba(255,255,255,0.1)" }} />

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--y-text-on-dark-muted)" }}>Cuota mensual</span>
              <span className="font-bold text-lg">Bs {monthlyPayment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--y-text-on-dark-muted)" }}>Total a pagar</span>
              <span className="font-bold text-lg">Bs {totalPayable.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--y-text-on-dark-muted)" }}>Ahorras vs informal</span>
              <span className="font-bold text-lg" style={{ color: "var(--y-green)" }}>Bs {savings.toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* Trust builders */}
        <section
          className="rounded-2xl p-5 shadow-sm"
          style={{ background: "var(--y-surface)", border: "1px solid var(--y-border)" }}
        >
          <h3 className="font-bold mb-4" style={{ color: "var(--y-text-primary)" }}>¿Tienes dudas?</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-xl shrink-0">🔒</span>
              <p className="text-sm leading-relaxed" style={{ color: "var(--y-text-secondary)" }}>
                <span className="font-bold" style={{ color: "var(--y-text-primary)" }}>Sin letra chica.</span>{" "}
                La tasa que ves es la que pagas.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl shrink-0">⚡</span>
              <p className="text-sm leading-relaxed" style={{ color: "var(--y-text-secondary)" }}>
                <span className="font-bold" style={{ color: "var(--y-text-primary)" }}>El dinero llega</span>{" "}
                en menos de 1 minuto.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl shrink-0">📞</span>
              <p className="text-sm leading-relaxed" style={{ color: "var(--y-text-secondary)" }}>
                <span className="font-bold" style={{ color: "var(--y-text-primary)" }}>Si algo sale mal, estamos aquí.</span>{" "}
                WhatsApp disponible.
              </p>
            </div>
          </div>
        </section>

        {/* How you receive */}
        <section
          className="rounded-2xl p-5 shadow-sm"
          style={{ background: "var(--y-surface)", border: "1px solid var(--y-border)" }}
        >
          <h3 className="font-bold mb-2" style={{ color: "var(--y-text-primary)" }}>¿Cómo recibirás el dinero?</h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--y-text-secondary)" }}>
            El dinero llega a tu cuenta digital Yalita en segundos. Puedes usarlo directamente
            para pagar con tu QR o retirarlo en efectivo en cualquier punto autorizado.
          </p>
        </section>

        {/* FAQs */}
        <section className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl shadow-sm overflow-hidden"
              style={{ background: "var(--y-surface)", border: "1px solid var(--y-border)" }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-bold text-sm" style={{ color: "var(--y-text-primary)" }}>{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp size={20} className="shrink-0" style={{ color: "var(--y-text-tertiary)" }} />
                ) : (
                  <ChevronDown size={20} className="shrink-0" style={{ color: "var(--y-text-tertiary)" }} />
                )}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm leading-relaxed animate-fadeInUp" style={{ color: "var(--y-text-secondary)" }}>
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
            className="w-full disabled:opacity-60 font-semibold py-4 px-6 rounded-xl text-center transition-all flex justify-center items-center space-x-2 shadow-lg animate-shimmer-btn"
            style={{ background: "var(--y-primary)", color: "var(--y-text-on-dark)" }}
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
            className="block w-full text-center py-3 text-sm font-medium transition-colors"
            style={{ color: "var(--y-text-tertiary)" }}
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
      <main style={{ background: "var(--y-bg)" }} className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(232,65,66,0.3)", borderTopColor: "var(--y-primary)" }} />
      </main>
    }>
      <SolicitarContent />
    </Suspense>
  );
}
