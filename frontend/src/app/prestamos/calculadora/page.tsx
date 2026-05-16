"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ImpactTable } from "@/components/ui/ImpactTable";

export default function CalculadoraPrestamos() {
  const [mounted, setMounted] = useState(false);
  const [monto, setMonto] = useState(1000);
  const [plazo, setPlazo] = useState(3);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-quipu-light" />;

  const plazos = [1, 2, 3, 6];

  return (
    <main className="min-h-screen bg-quipu-light flex flex-col">
      <header className="flex items-center p-6 bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b border-quipu-text/5">
        <Link href="/dashboard" className="mr-4 text-quipu-text hover:text-quipu-primary transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-serif text-2xl text-quipu-dark">Calculadora</h1>
      </header>

      <div className="flex-1 p-6 space-y-8 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold text-quipu-dark mb-6">¿Cuánto necesitas?</h2>
          
          {/* Monto Slider */}
          <div className="bg-white p-6 rounded-2xl border border-quipu-text/10 shadow-sm mb-6">
            <div className="text-center mb-4">
              <span className="text-sm font-bold text-quipu-text/50 uppercase tracking-wider">Monto a solicitar</span>
              <div className="font-serif text-4xl text-quipu-primary mt-1">Bs {monto.toLocaleString()}</div>
            </div>
            
            <input 
              type="range" 
              min="500" 
              max="10000" 
              step="500"
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              className="w-full h-2 bg-quipu-text/10 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-xs font-bold text-quipu-text/40 mb-4">
              <span>Bs 500</span>
              <span>Bs 10,000</span>
            </div>
            
            <p className="text-[11px] font-medium text-quipu-text/50 text-center">
              La mayoría de usuarios similares piden entre Bs 2.000 y Bs 5.000
            </p>
          </div>

          {/* Plazo Selector */}
          <div className="bg-white p-6 rounded-2xl border border-quipu-text/10 shadow-sm">
            <span className="block text-sm font-bold text-quipu-text/50 uppercase tracking-wider mb-4 text-center">¿En cuánto tiempo lo pagarás?</span>
            <div className="flex space-x-2">
              {plazos.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlazo(p)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    plazo === p 
                      ? "bg-quipu-dark text-white shadow-md scale-105" 
                      : "bg-quipu-light text-quipu-text hover:bg-quipu-text/5"
                  }`}
                >
                  {p} {p === 1 ? "mes" : "meses"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Table */}
        <div className="animate-fade-up">
          <h3 className="text-lg font-bold text-quipu-dark mb-4">Compara y decide</h3>
          <ImpactTable monto={monto} plazo={plazo} />
        </div>

        <div className="pb-8 pt-4">
          <Link
            href={`/prestamos/solicitar?monto=${monto}&plazo=${plazo}`}
            className="w-full bg-quipu-primary hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all flex justify-center items-center space-x-2 shadow-lg shadow-quipu-primary/20 animate-shimmer-btn"
          >
            <span>Solicitar este préstamo</span>
            <span className="text-xl">→</span>
          </Link>
          <p className="text-center text-xs font-medium text-quipu-text/50 mt-4">
            Sujeto a verificación final del contrato inteligente.
          </p>
        </div>
      </div>
    </main>
  );
}
