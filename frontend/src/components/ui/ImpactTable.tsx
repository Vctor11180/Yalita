import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { Users, Watch, Landmark, Zap, ShieldCheck, Clock } from "lucide-react";

export function ImpactTable({ monto, plazo }: { monto: number; plazo: number }) {
  const tasaPrestamista = 0.15; // 15% mensual
  const tasaEmpeno = 0.08; // 8% mensual
  const tasaBanco = 0.045; // 4.5% mensual (típico para microcréditos sin garantía)
  const tasaYalita = 0.015; // 1.5% mensual (~18% anual)

  const calcTotal = (tasa: number) => Math.round(monto + (monto * tasa * plazo));

  const totalPrestamistaRaw = calcTotal(tasaPrestamista);
  const totalEmpenoRaw = calcTotal(tasaEmpeno);
  const totalBancoRaw = calcTotal(tasaBanco);
  const totalYalitaRaw = calcTotal(tasaYalita);
  const ahorroRaw = totalPrestamistaRaw - totalYalitaRaw;

  const totalPrestamista = useAnimatedNumber(totalPrestamistaRaw);
  const totalEmpeno = useAnimatedNumber(totalEmpenoRaw);
  const totalBanco = useAnimatedNumber(totalBancoRaw);
  const totalYalita = useAnimatedNumber(totalYalitaRaw);
  const ahorro = useAnimatedNumber(ahorroRaw);

  return (
    <div className="bg-white rounded-2xl border border-quipu-text/10 overflow-hidden shadow-sm animate-fadeIn">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-quipu-light/30 border-b border-quipu-text/10">
            <th className="p-3"></th>
            <th className="p-3 text-center">
              <div className="flex flex-col items-center">
                <Users size={18} className="text-red-500 mb-1" />
                <span className="text-[10px] uppercase tracking-tighter font-bold text-red-600">Prestamista</span>
              </div>
            </th>
            <th className="p-3 text-center">
              <div className="flex flex-col items-center">
                <Watch size={18} className="text-amber-600 mb-1" />
                <span className="text-[10px] uppercase tracking-tighter font-bold text-amber-700">Empeño</span>
              </div>
            </th>
            <th className="p-3 text-center">
              <div className="flex flex-col items-center">
                <Landmark size={18} className="text-quipu-dark mb-1" />
                <span className="text-[10px] uppercase tracking-tighter font-bold text-quipu-dark">Bancos</span>
              </div>
            </th>
            <th className="p-3 text-center bg-quipu-accent/5">
              <div className="flex flex-col items-center">
                <Zap size={20} className="text-quipu-accent mb-1 fill-quipu-accent/20" />
                <span className="text-[10px] uppercase tracking-tighter font-bold text-quipu-accent">Yalita</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="text-[11px] font-medium">
          <tr className="border-b border-quipu-text/5">
            <td className="p-3 text-quipu-text/60">Tasa mensual</td>
            <td className="p-3 text-center text-red-500">15.0%</td>
            <td className="p-3 text-center text-amber-600">8.0%</td>
            <td className="p-3 text-center text-quipu-dark">4.5%</td>
            <td className="p-3 text-center font-bold text-quipu-accent bg-quipu-accent/5">1.5%</td>
          </tr>
          <tr className="border-b border-quipu-text/5">
            <td className="p-3 text-quipu-text/60">Tiempo espera</td>
            <td className="p-3 text-center">Hoy mismo</td>
            <td className="p-3 text-center">Hoy mismo</td>
            <td className="p-3 text-center">7-15 días</td>
            <td className="p-3 text-center font-bold text-quipu-accent bg-quipu-accent/5">1 min</td>
          </tr>
          <tr className="border-b border-quipu-text/5">
            <td className="p-3 text-quipu-text/60 flex items-center gap-1">
              <ShieldCheck size={12} /> Seguridad
            </td>
            <td className="p-3 text-center text-red-500">Baja</td>
            <td className="p-3 text-center text-amber-600">Media</td>
            <td className="p-3 text-center">Alta</td>
            <td className="p-3 text-center font-bold text-quipu-accent bg-quipu-accent/5">Alta</td>
          </tr>
          <tr className="font-bold bg-quipu-light/20">
            <td className="p-3 text-quipu-dark text-sm">Pagas en total</td>
            <td className="p-3 text-center text-red-600">Bs {totalPrestamista.toLocaleString()}</td>
            <td className="p-3 text-center text-amber-700">Bs {totalEmpeno.toLocaleString()}</td>
            <td className="p-3 text-center text-quipu-dark">Bs {totalBanco.toLocaleString()}</td>
            <td className="p-3 text-center text-quipu-accent text-sm bg-quipu-accent/10 border-2 border-quipu-accent/20">
              Bs {totalYalita.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="bg-quipu-accent p-3 text-center text-white flex items-center justify-center gap-2">
        <Zap size={16} className="fill-white" />
        <span className="text-xs font-bold uppercase tracking-wide">
          Ahorras Bs {ahorro.toLocaleString()} con Yalita
        </span>
      </div>
    </div>
  );
}
