"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

const STEPS = [
  {
    emoji: "📱",
    color: "bg-quipu-primary/10",
    border: "border-quipu-primary/20",
    title: "Conectas tu historial de pagos",
    text: "Autorizas a Quipu a ver cuánto cobras por QR cada mes. Nada más. No vemos tus contactos, fotos ni contraseñas.",
  },
  {
    emoji: "⭐",
    color: "bg-quipu-secondary/10",
    border: "border-quipu-secondary/20",
    title: "Calculamos tu puntaje",
    text: "Miramos cuánto cobras, con qué frecuencia y hace cuánto tiempo. Eso se convierte en tu Puntaje Quipu: un número entre 300 y 850.",
  },
  {
    emoji: "💰",
    color: "bg-quipu-accent/10",
    border: "border-quipu-accent/20",
    title: "Accedes a crédito justo",
    text: "Con tu puntaje, puedes pedir desde Bs 500 hasta Bs 8.000 a tasas mucho más bajas que cualquier prestamista del mercado.",
  },
  {
    emoji: "🔄",
    color: "bg-blue-50",
    border: "border-blue-200",
    title: "Pagas mientras cobras",
    text: "Cada vez que recibes un pago QR, una parte pequeña va a tu cuota automáticamente. Tu deuda se paga sola mientras trabajas.",
  },
];

const FAQS = [
  {
    q: "¿Qué pasa si no puedo pagar una cuota?",
    a: "Nos avisas y buscamos una solución juntos. No hay cobros ocultos ni penalizaciones abusivas.",
  },
  {
    q: "¿Quipu es un banco?",
    a: "No. Somos un protocolo de crédito descentralizado. Eso significa que el dinero viene de otras personas que prestan sus ahorros, no de un banco. Por eso podemos ofrecer mejores tasas.",
  },
  {
    q: "¿Mis datos están seguros?",
    a: "Sí. Usamos criptografía para verificar tus ingresos sin guardar tus datos en nuestros servidores. Tú eres dueño de tu información.",
  },
];

export default function ComoFunciona() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-quipu-light flex flex-col">
      {/* Header */}
      <header className="flex items-center p-6 bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b border-quipu-text/5">
        <Link
          href="/dashboard"
          className="mr-4 text-quipu-text hover:text-quipu-primary transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-serif text-2xl text-quipu-dark">
          Cómo funciona Quipu
        </h1>
      </header>

      <div className="flex-1 p-6 space-y-6 pb-24">
        <p className="text-center text-sm font-bold text-quipu-text/50 uppercase tracking-wider">
          En 4 pasos simples
        </p>

        {/* ─── 4 STEPS ─── */}
        <div className="space-y-4">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl p-5 border ${step.border} shadow-sm animate-fadeInUp`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-2xl shrink-0`}
                >
                  {step.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-bold text-quipu-text/30 uppercase">
                      Paso {i + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-quipu-dark mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-quipu-text/70 leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── SEPARATOR ─── */}
        <div className="flex items-center space-x-3">
          <div className="flex-1 h-px bg-quipu-text/10" />
          <span className="text-xs font-bold text-quipu-text/30 uppercase tracking-wider">
            ¿Más dudas?
          </span>
          <div className="flex-1 h-px bg-quipu-text/10" />
        </div>

        {/* ─── FAQS ─── */}
        <div className="space-y-2">
          <h3 className="font-bold text-quipu-dark text-lg mb-3">
            Preguntas frecuentes
          </h3>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-quipu-text/10 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-bold text-sm text-quipu-dark pr-4">
                  {faq.q}
                </span>
                {openFaq === i ? (
                  <ChevronUp
                    size={20}
                    className="text-quipu-text/40 shrink-0"
                  />
                ) : (
                  <ChevronDown
                    size={20}
                    className="text-quipu-text/40 shrink-0"
                  />
                )}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-quipu-text/70 leading-relaxed animate-fadeInUp">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ─── CTA ─── */}
        <div className="pt-4">
          <Link
            href="/prestamos/calculadora"
            className="w-full bg-quipu-primary hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all flex justify-center items-center space-x-2 shadow-lg shadow-quipu-primary/20 animate-shimmer-btn"
          >
            <span>Empezar ahora</span>
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
