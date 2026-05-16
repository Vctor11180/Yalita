import { CheckCircle2, ChevronRight, Clock } from "lucide-react";

interface ProviderCardProps {
  name: string;
  icon: React.ReactNode;
  status: "connected" | "pending" | "disconnected";
  onClick?: () => void;
}

export function ProviderCard({ name, icon, status, onClick }: ProviderCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={status === "connected"}
      className="w-full flex items-center justify-between p-4 bg-white border border-quipu-text/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow disabled:opacity-80 disabled:cursor-not-allowed"
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 flex items-center justify-center bg-quipu-light rounded-full text-quipu-primary">
          {icon}
        </div>
        <span className="font-semibold text-quipu-text">{name}</span>
      </div>
      
      <div>
        {status === "connected" && (
          <div className="flex items-center text-quipu-accent space-x-1 bg-quipu-accent/10 px-3 py-1 rounded-full">
            <CheckCircle2 size={16} />
            <span className="text-xs font-bold">Conectado</span>
          </div>
        )}
        {status === "pending" && (
          <div className="flex items-center text-quipu-secondary space-x-1 bg-quipu-secondary/10 px-3 py-1 rounded-full">
            <Clock size={16} />
            <span className="text-xs font-bold">Pendiente</span>
          </div>
        )}
        {status === "disconnected" && (
          <div className="flex items-center text-quipu-primary space-x-1">
            <span className="text-sm font-medium">Conectar</span>
            <ChevronRight size={16} />
          </div>
        )}
      </div>
    </button>
  );
}
