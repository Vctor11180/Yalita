"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { OTPInput } from "@/components/ui/OTPInput";
import { CheckCircle2 } from "lucide-react";

export default function OnboardingOTP() {
  const router = useRouter();
  const [timer, setTimer] = useState(45);
  const [status, setStatus] = useState<"default" | "verifying" | "error" | "success">("default");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = (otp: string) => {
    setStatus("verifying");
    // Simulate verification
    setTimeout(() => {
      if (otp === "123456") { // Dummy correct OTP
        setStatus("success");
        setTimeout(() => router.push("/onboarding/profile"), 1500);
      } else {
        setStatus("error");
      }
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-quipu-light flex flex-col p-6">
      <header className="mb-8 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-quipu-text/50 uppercase tracking-wider">Paso 2 de 4</span>
          <Link href="/onboarding" className="text-quipu-text/50 hover:text-quipu-text text-sm">Atrás</Link>
        </div>
        <ProgressBar progress={50} />
      </header>

      <div className="flex-1 animate-fade-in flex flex-col">
        <h1 className="font-serif text-3xl text-quipu-dark mb-2">Ingresa el código que te enviamos</h1>
        <p className="text-quipu-text/70 mb-8 leading-relaxed">
          Lo enviamos al <span className="font-semibold text-quipu-text">+591 7X XXX XXXX</span>
        </p>

        <div className="mb-8 flex justify-center">
          {status === "verifying" ? (
            <div className="flex justify-between space-x-2 animate-pulse w-full max-w-[320px]">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-12 h-14 bg-quipu-text/10 rounded-xl" />
              ))}
            </div>
          ) : status === "success" ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-4 text-quipu-accent animate-fade-in">
              <CheckCircle2 size={48} className="animate-score-reveal" />
              <p className="font-bold text-lg">¡Código verificado!</p>
            </div>
          ) : (
            <OTPInput onComplete={handleComplete} isError={status === "error"} />
          )}
        </div>

        {status === "error" && (
          <p className="text-red-500 text-center text-sm font-medium mb-4 animate-fade-in">
            Código incorrecto. Intenta con "123456".
          </p>
        )}

        <div className="mt-auto pb-4 text-center">
          {timer > 0 ? (
            <p className="text-quipu-text/50 text-sm font-medium">Reenviar código en 0:{timer.toString().padStart(2, "0")}</p>
          ) : (
            <button 
              onClick={() => { setTimer(45); setStatus("default"); }} 
              className="text-quipu-primary font-bold text-sm hover:underline"
            >
              Reenviar código
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
