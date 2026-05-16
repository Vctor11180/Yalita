"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useQuipuStore } from "@/stores/quipu.store";

export default function AnalyzingState() {
  const router = useRouter();
  const setScore = useQuipuStore((state) => state.setScore);
  const setScoreLoaded = useQuipuStore((state) => state.setScoreLoaded);
  
  const [step, setStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [error, setError] = useState(false);
  const [txCount, setTxCount] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const analyzeData = async () => {
    try {
      setError(false);
      setStep(0);
      
      // Animate Step 1 (Conectando...) -> Step 2 (Leyendo historial...)
      setTimeout(() => setStep(1), 800);
      setTimeout(() => setStep(2), 1600);

      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proof: null, // Will use mock in backend
          userId: "user_123",
          walletAddress: "0xMockWalletAddress"
        })
      });

      if (!response.ok) throw new Error("API failed");

      const data = await response.json();
      
      setTxCount(data.transactionCount);
      setFinalScore(data.score);
      setScore(data.score);
      setScoreLoaded(true);

      // Advance steps with real data
      setStep(3);
      setTimeout(() => setStep(4), 1000);
      
      // Exit and navigate
      setTimeout(() => setIsExiting(true), 2500);
      setTimeout(() => router.push("/dashboard"), 3000);

    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  useEffect(() => {
    analyzeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps = [
    { text: "Conectando con Tigo Money...", doneText: "Conectado" },
    { text: "Leyendo tu historial de pagos...", doneText: `${txCount} transacciones encontradas` },
    { text: "Calculando tu puntaje...", doneText: "¡Puntaje calculado!" },
    { text: "Creando tu identidad financiera...", doneText: `¡Listo! Tu puntaje es ${finalScore}` },
  ];

  if (error) {
    return (
      <main className="min-h-screen bg-quipu-dark flex flex-col items-center justify-center p-6 text-white text-center">
        <AlertCircle size={64} className="text-red-500 mb-6" />
        <h1 className="font-serif text-2xl mb-2">Hubo un problema</h1>
        <p className="text-quipu-light/70 mb-8">No pudimos analizar tu historial.</p>
        <button 
          onClick={analyzeData}
          className="bg-quipu-primary px-6 py-3 rounded-xl font-bold w-full max-w-xs hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-quipu-dark flex flex-col items-center justify-center p-6 text-white transition-transform duration-500 ease-in-out ${isExiting ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
      {/* Animated Quipu Knot */}
      <div className="w-32 h-32 mb-12 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(243,156,18,0.4)]">
          <path 
            d="M50 10 C30 10, 20 30, 50 50 C80 70, 70 90, 50 90" 
            fill="none" 
            stroke="#C0392B" 
            strokeWidth="6" 
            strokeLinecap="round"
            className="animate-[draw_2s_ease-in-out_forwards]"
            style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
          />
          <path 
            d="M50 10 C70 10, 80 30, 50 50 C20 70, 30 90, 50 90" 
            fill="none" 
            stroke="#F39C12" 
            strokeWidth="6" 
            strokeLinecap="round"
            className="animate-[draw_2.5s_ease-in-out_forwards]"
            style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
          />
          <circle cx="50" cy="50" r="8" fill="#1A1A2E" stroke="#27AE60" strokeWidth="4" className={`transition-all duration-500 delay-2000 ${step >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
        </svg>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes draw {
            to { stroke-dashoffset: 0; }
          }
        `}} />
      </div>

      <div className="w-full max-w-xs space-y-6">
        {steps.map((s, idx) => (
          <div 
            key={idx} 
            className={`flex items-center space-x-3 transition-all duration-500 ${
              step >= idx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {step > idx ? (
              <CheckCircle2 size={24} className="text-quipu-accent shrink-0 animate-fadeInUp" />
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-quipu-secondary border-t-transparent animate-spin shrink-0" />
            )}
            <span className="font-serif text-[18px]">
              {step > idx ? <span className="text-quipu-accent">{s.doneText}</span> : s.text}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
