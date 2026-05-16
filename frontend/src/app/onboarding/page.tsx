"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function OnboardingPhone() {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 8) {
      setPhone(val);
    }
  };

  const isValid = phone.length === 8 && /^[67]\d{7}$/.test(phone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        router.push("/onboarding/otp");
      }, 1000);
    }
  };

  return (
    <main className="min-h-screen bg-quipu-light flex flex-col p-6">
      <header className="mb-8 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-quipu-text/50 uppercase tracking-wider">Paso 1 de 4</span>
          <Link href="/" className="text-quipu-text/50 hover:text-quipu-text text-sm">Cancelar</Link>
        </div>
        <ProgressBar progress={25} />
      </header>

      <div className="flex-1 animate-fade-in">
        <h1 className="font-serif text-3xl text-quipu-dark mb-2">¿Cuál es tu número de celular?</h1>
        <p className="text-quipu-text/70 mb-8 leading-relaxed">
          Te enviaremos un código para confirmar que eres tú
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-quipu-text font-semibold text-lg">+591</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="71234567"
              className="w-full pl-16 pr-4 py-4 bg-white border-2 border-quipu-text/10 rounded-xl text-lg font-semibold text-quipu-text focus:outline-none focus:border-quipu-primary transition-colors placeholder:text-quipu-text/30 shadow-sm"
              autoFocus
            />
          </div>
          
          {phone.length > 0 && !isValid && phone.length === 8 && (
            <p className="text-red-500 text-sm mb-4 font-medium">Ingresa un número boliviano válido.</p>
          )}

          <div className="mt-auto pb-4 space-y-4">
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full bg-quipu-primary hover:bg-red-700 disabled:bg-quipu-text/10 disabled:text-quipu-text/40 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all flex justify-center items-center h-[56px]"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Enviar código"
              )}
            </button>
            <p className="text-center">
              <button type="button" className="text-quipu-primary font-medium text-sm">
                ¿No tienes celular? Usa tu email
              </button>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
