"use client";

import { mockProviders } from "@/lib/mock-data";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { QuipuCard } from "@/components/ui/QuipuCard";
import { useQuipuStore } from "@/stores/quipu.store";
import { Settings, LogOut, ChevronRight, Share2, Globe, Bell, MessageSquare, Mail, Smartphone, QrCode, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";

export default function Perfil() {
  const { userName, userPhone, isCiVerified, verifyCi } = useQuipuStore();
  
  const verificationLevel = isCiVerified ? 100 : 40;
  const memberSince = "Octubre 2023";
  const avatarInitial = userName.charAt(0);

  return (
    <main className="bg-quipu-light min-h-screen pb-6">
      {/* Header Avatar */}
      <header className="flex flex-col items-center pt-10 pb-6 bg-white border-b border-quipu-text/5">
        <div className="w-20 h-20 bg-gradient-to-br from-quipu-primary to-[#F39C12] rounded-full flex items-center justify-center text-white text-3xl font-serif shadow-lg mb-4">
          {avatarInitial}
        </div>
        <h1 className="font-serif text-2xl text-quipu-dark">{userName}</h1>
        <p className="text-sm font-bold text-quipu-primary mt-1">{userPhone}</p>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-xs font-medium text-quipu-text/50">Miembro desde {memberSince}</span>
          {isCiVerified && <span className="bg-quipu-accent/10 text-quipu-accent text-[10px] font-bold px-2 py-0.5 rounded-full border border-quipu-accent/20">Verificada ✓</span>}
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* NIVEL DE SEGURIDAD */}
        <section className="bg-white rounded-2xl p-5 border border-quipu-text/10 shadow-sm animate-fade-up">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-quipu-dark uppercase tracking-wider">Seguridad de Identidad</h2>
            <span className="text-xs font-bold text-quipu-primary">{verificationLevel}%</span>
          </div>
          
          <div className="w-full h-3 bg-quipu-text/5 rounded-full overflow-hidden mb-4">
            <div 
              className={`h-full transition-all duration-1000 ${isCiVerified ? 'bg-quipu-accent' : 'bg-quipu-primary'}`}
              style={{ width: `${verificationLevel}%` }}
            />
          </div>

          {!isCiVerified ? (
            <div className="bg-quipu-primary/5 border border-quipu-primary/10 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-quipu-primary/10 rounded-lg">
                  <UserCheck size={20} className="text-quipu-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-quipu-dark">Verifica tu C.I.</p>
                  <p className="text-xs text-quipu-text/60 mt-0.5">Desbloquea préstamos de hasta Bs 8,000 verificando tu identidad nacional.</p>
                  <button 
                    onClick={() => verifyCi()}
                    className="mt-3 bg-quipu-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Verificar ahora
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-quipu-accent bg-quipu-accent/5 p-3 rounded-xl border border-quipu-accent/10">
              <ShieldCheck size={18} />
              <span className="text-xs font-bold">Tu identidad está plenamente protegida y verificada on-chain.</span>
            </div>
          )}
        </section>

        {/* Fuentes Conectadas */}
        <section className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-lg font-bold text-quipu-dark mb-4">Fuentes conectadas</h3>
          <div className="space-y-3">
            {mockProviders.map((provider) => {
              let Icon = Smartphone;
              if (provider.id === "sms") Icon = MessageSquare;
              if (provider.id === "email") Icon = Mail;
              if (provider.id === "simple") Icon = QrCode;

              return (
                <ProviderCard
                  key={provider.id}
                  name={provider.name}
                  icon={<Icon size={20} className="text-quipu-primary" />}
                  status={provider.status}
                />
              );
            })}
          </div>
        </section>

        {/* Configuración */}
        <section className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-lg font-bold text-quipu-dark mb-4">Configuración</h2>
          <div className="bg-white rounded-2xl border border-quipu-text/10 overflow-hidden shadow-sm">
            <button className="w-full flex items-center justify-between p-4 border-b border-quipu-text/5 hover:bg-quipu-light/50 transition-colors text-left">
              <div className="flex items-center space-x-3 text-quipu-dark">
                <Globe size={20} className="text-quipu-text/50" />
                <span className="font-semibold">Idioma</span>
              </div>
              <div className="flex items-center text-quipu-text/50">
                <span className="text-sm font-medium mr-2">Español</span>
                <ChevronRight size={18} />
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 border-b border-quipu-text/5 hover:bg-quipu-light/50 transition-colors text-left">
              <div className="flex items-center space-x-3 text-quipu-dark">
                <Bell size={20} className="text-quipu-text/50" />
                <span className="font-semibold">Notificaciones</span>
              </div>
              <ChevronRight size={18} className="text-quipu-text/50" />
            </button>
            <button className="w-full flex items-center justify-between p-4 border-b border-quipu-text/5 hover:bg-quipu-light/50 transition-colors text-left">
              <div className="flex items-center space-x-3 text-quipu-dark">
                <Settings size={20} className="text-quipu-text/50" />
                <span className="font-semibold">Seguridad</span>
              </div>
              <ChevronRight size={18} className="text-quipu-text/50" />
            </button>
            <button className="w-full flex items-center p-4 hover:bg-red-50 transition-colors text-left text-red-600">
              <LogOut size={20} className="mr-3" />
              <span className="font-semibold">Cerrar sesión</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
