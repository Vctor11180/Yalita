"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Lock } from "lucide-react";

export default function OnboardingProfile() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [ci, setCi] = useState("");

  const handleCiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 4) setCi(val);
  };

  const isValid = name.trim().length > 2 && ci.length === 4;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) router.push("/onboarding/connect");
  };

  return (
    <main className="min-h-screen bg-quipu-light flex flex-col p-6">
      <header className="mb-8 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-quipu-text/50 uppercase tracking-wider">Paso 3 de 4</span>
          <Link href="/onboarding/otp" className="text-quipu-text/50 hover:text-quipu-text text-sm">Atrás</Link>
        </div>
        <ProgressBar progress={75} />
      </header>

      <div className="flex-1 animate-fade-in">
        <h1 className="font-serif text-3xl text-quipu-dark mb-2">Cuéntanos un poco de ti</h1>
        <p className="text-quipu-text/70 mb-8 leading-relaxed">
          Esto nos ayuda a crear tu identidad financiera única.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-quipu-text mb-2">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. María Choque"
                className="w-full px-4 py-4 bg-white border-2 border-quipu-text/10 rounded-xl text-lg font-semibold text-quipu-text focus:outline-none focus:border-quipu-primary transition-colors placeholder:text-quipu-text/30 shadow-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-quipu-text mb-2">Últimos 4 dígitos de tu CI</label>
              <input
                type="text"
                inputMode="numeric"
                value={ci}
                onChange={handleCiChange}
                placeholder="Ej. 4567"
                className="w-full px-4 py-4 bg-white border-2 border-quipu-text/10 rounded-xl text-lg font-semibold text-quipu-text focus:outline-none focus:border-quipu-primary transition-colors placeholder:text-quipu-text/30 shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-quipu-accent/10 p-3 rounded-lg mb-8">
            <Lock size={16} className="text-quipu-accent" />
            <p className="text-xs font-medium text-quipu-text/80">
              Tus datos viajan cifrados y nunca se venden.
            </p>
          </div>

          <div className="mt-auto pb-4">
            <button
              type="submit"
              disabled={!isValid}
              className="w-full bg-quipu-primary hover:bg-red-700 disabled:bg-quipu-text/10 disabled:text-quipu-text/40 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
