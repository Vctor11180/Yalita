"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SplashPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-quipu-dark relative flex flex-col items-center justify-center overflow-hidden p-6">
      {/* Patrón de fondo SVG */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="aguayo-bg" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 L10 0 L20 10 L10 20 Z" fill="#F5F0E8" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#aguayo-bg)" />
        </svg>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-sm mx-auto">
        {/* Logo animado */}
        <div className="animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
          <div className="w-24 h-24 mx-auto mb-6 bg-quipu-primary rounded-2xl rotate-45 flex items-center justify-center shadow-lg shadow-quipu-primary/20">
            <div className="-rotate-45">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20" />
                <path d="M12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                <path d="M12 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                <path d="M8 6h4" />
                <path d="M8 14h4" />
                <path d="M12 22h4" />
              </svg>
            </div>
          </div>
          <h1 className="font-serif text-5xl text-quipu-light text-center mb-4 tracking-tight">Yalita</h1>
        </div>

        {/* Tagline */}
        <div className="text-center animate-fadeInUp" style={{ animationDelay: "0.5s" }}>
          <p className="text-quipu-light/90 text-lg font-medium max-w-[280px]">Tu reputación es tu mayor activo</p>
          <p className="text-quipu-light/50 text-sm mt-2">Rápido, simple y justo</p>
        </div>
      </div>

      <div className="w-full max-w-sm z-10 flex flex-col space-y-4 animate-fadeInUp" style={{ animationDelay: "0.8s" }}>
        <Link 
          href="/onboarding" 
          className="w-full bg-quipu-primary hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl text-center transition-colors shadow-lg shadow-quipu-primary/30"
        >
          Empieza gratis
        </Link>
        <Link 
          href="/login" 
          className="w-full text-quipu-light/60 hover:text-quipu-light font-medium py-2 px-6 text-center transition-colors"
        >
          Ya tengo cuenta → Entrar
        </Link>
      </div>
    </main>
  );
}
