const BREAKDOWN = [
  { label: "Volumen de pagos", weight: 35, description: "Cuánto dinero moviste en los últimos 6 meses" },
  { label: "Frecuencia", weight: 25, description: "Con qué regularidad realizas pagos" },
  { label: "Antigüedad", weight: 20, description: "Desde hace cuánto tiempo usás pagos digitales" },
  { label: "Consistencia", weight: 15, description: "Qué tan estables son tus ingresos mes a mes" },
  { label: "Riesgo de red", weight: 5, description: "Penalización por contrapartes sospechosas" },
];

export function ScoreBreakdown() {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl divide-y divide-white/5">
      {BREAKDOWN.map((item) => (
        <div key={item.label} className="px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-white font-medium">{item.label}</p>
            <span className="text-xs text-neutral-500">{item.weight}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-quipu-500 rounded-full" style={{ width: `${(item.weight / 35) * 100}%` }} />
          </div>
          <p className="text-xs text-neutral-600 mt-1">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
