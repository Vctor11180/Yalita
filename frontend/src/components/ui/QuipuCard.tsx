export function QuipuCard({ name, score, date }: { name: string; score: number; date: string }) {
  return (
    <div 
      className="relative w-full aspect-[1.6/1] overflow-hidden p-6 flex flex-col justify-between text-white"
      style={{
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        border: "1px solid #F39C12",
        backgroundColor: "#1A1A2E"
      }}
    >
      {/* Patrón Andino SVG */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="andean-pattern" width="24" height="16" patternUnits="userSpaceOnUse">
              <path d="M6 0 L12 4 L6 8 L0 4 Z" fill="#C0392B" />
              <path d="M18 0 L24 4 L18 8 L12 4 Z" fill="#F39C12" />
              <path d="M0 8 L6 12 L0 16 L-6 12 Z" fill="#F39C12" />
              <path d="M12 8 L18 12 L12 16 L6 12 Z" fill="#C0392B" />
              <path d="M24 8 L30 12 L24 16 L18 12 Z" fill="#F39C12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#andean-pattern)" />
        </svg>
      </div>

      {/* Gradiente sutil encima del patrón para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E]/80 via-[#1A1A2E]/50 to-[#2D1B69]/80 pointer-events-none"></div>

      <div className="flex justify-between items-start z-10 relative">
        <div>
          <h3 className="font-serif text-2xl text-quipu-light drop-shadow-md">Yalita</h3>
          <p className="text-xs text-white/80 font-medium tracking-widest mt-1">CERTIFICADO FINANCIERO</p>
        </div>
        <div className="bg-quipu-accent/20 border border-quipu-accent/50 text-quipu-accent text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 backdrop-blur-sm">
          <span>Verificado</span>
          <span>✓</span>
        </div>
      </div>

      <div className="flex justify-between items-end z-10 relative">
        <div>
          <p className="text-xs text-white/60 mb-1">TITULAR</p>
          <p className="font-medium text-lg tracking-wide drop-shadow-sm">{name.toUpperCase()}</p>
          <p className="text-[10px] text-white/50 mt-1">EMISIÓN: {date}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/60 mb-1">SCORE</p>
          <p className="font-serif text-4xl text-quipu-secondary drop-shadow-[0_0_10px_rgba(243,156,18,0.5)]">{score}</p>
        </div>
      </div>
    </div>
  );
}
