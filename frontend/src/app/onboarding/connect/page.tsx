"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { mockProviders } from "@/lib/mock-data";

type ConnectionStatus = "disconnected" | "pending" | "connected";
type OnboardingProvider = {
  id: string;
  name: string;
  type: string;
  status: ConnectionStatus;
};

export default function OnboardingConnect() {
  const router = useRouter();
  const [providers, setProviders] = useState<OnboardingProvider[]>(
    mockProviders.map((p) => ({ ...p, status: "disconnected" })),
  );

  const hasConnected = providers.some(p => p.status === "connected");

  const handleConnect = (id: string) => {
    setProviders(prev => prev.map(p => {
      if (p.id === id) {
        if (p.status === "disconnected") return { ...p, status: "pending" };
        return p;
      }
      return p;
    }));

    // Simulate connection process
    setTimeout(() => {
      setProviders(prev => prev.map(p => p.id === id ? { ...p, status: "connected" } : p));
    }, 2000);
  };

  const handleFinish = () => {
    router.push("/onboarding/analyzing");
  };

  return (
    <main className="min-h-screen bg-quipu-light flex flex-col p-6">
      <header className="mb-8 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-quipu-text/50 uppercase tracking-wider">Paso 4 de 4</span>
          <Link href="/onboarding/profile" className="text-quipu-text/50 hover:text-quipu-text text-sm">Atrás</Link>
        </div>
        <ProgressBar progress={100} />
      </header>

      <div className="flex-1 animate-fade-in flex flex-col">
        <h1 className="font-serif text-3xl text-quipu-dark mb-2">Conecta tu historial de pagos</h1>
        <p className="text-quipu-text/70 mb-6 leading-relaxed">
          Así calculamos tu puntaje. Tus datos no se guardan en nuestros servidores.
        </p>

        <div className="space-y-3 mb-6">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              name={provider.name}
              icon={<span className="font-serif text-xl">{provider.name.charAt(0)}</span>}
              status={provider.status}
              onClick={() => handleConnect(provider.id)}
            />
          ))}
        </div>

        <p className="text-center text-sm font-medium text-quipu-text/50 mb-8">
          Puedes conectar más tarde desde tu perfil
        </p>

        <div className="mt-auto pb-4">
          <button
            onClick={handleFinish}
            disabled={!hasConnected}
            className="w-full bg-quipu-primary hover:bg-red-700 disabled:bg-quipu-text/10 disabled:text-quipu-text/40 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all flex justify-center items-center space-x-2"
          >
            <span>Calcular mi puntaje</span>
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </main>
  );
}
