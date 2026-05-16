"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, ShieldCheck } from "lucide-react";
import { getMockTransactions } from "@/lib/mock-data";
import { useQuipuStore } from "@/stores/quipu.store";

export default function Historial() {
  const [filter, setFilter] = useState("Todos");
  
  const storeTransactions = useQuipuStore((state) => state.transactions);
  const isScoreLoaded = useQuipuStore((state) => state.isScoreLoaded);
  
  // Use store txs if any exist, else use fallback mock txs
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (storeTransactions.length > 0) {
      // Map WalletTransaction to display format
      setTransactions(storeTransactions.map(tx => ({
        id: tx.id,
        type: tx.description,
        amount: tx.amountBs,
        date: new Date(tx.timestamp).toLocaleDateString("es-BO", { day: "2-digit", month: "2-digit" }),
        source: tx.merchant || "Yalita",
        isIncome: tx.type === "loan_received" || tx.type === "qr_received",
      })));
    } else {
      setTransactions(getMockTransactions());
    }
  }, [storeTransactions]);

  const filters = ["Todos", "Yalita", "Tigo Money", "SIMPLE", "Banco Unión"];

  const filteredTransactions = transactions.filter(t => 
    filter === "Todos" ? true : t.source === filter
  );

  return (
    <main className="bg-quipu-light min-h-screen pb-6">
      <header className="p-6 bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b border-quipu-text/5">
        <div className="flex items-center mb-4">
          <Link href="/dashboard" className="mr-4 text-quipu-text hover:text-quipu-primary transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex-1">
            <h1 className="font-serif text-2xl text-quipu-dark">Tu historial verificado</h1>
            <div className="flex items-center space-x-1 text-quipu-accent mt-1">
              <ShieldCheck size={14} />
              <span className="text-xs font-bold">Protegido por zkTLS</span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === f 
                  ? "bg-quipu-dark text-white shadow-md" 
                  : "bg-white border border-quipu-text/10 text-quipu-text hover:bg-quipu-text/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Resumen */}
        <section className="bg-white rounded-2xl p-5 border border-quipu-text/10 shadow-sm animate-fadeInUp">
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-sm">
              <span className="text-quipu-text/60 font-medium">Promedio mensual:</span>
              <span className="font-bold text-quipu-dark">Bs 7.240</span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span className="text-quipu-text/60 font-medium">Transacciones este mes:</span>
              <span className="font-bold text-quipu-dark">34</span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span className="text-quipu-text/60 font-medium">Racha activa:</span>
              <span className="font-bold text-quipu-secondary">6 meses consecutivos 🔥</span>
            </li>
          </ul>
        </section>

        {/* Lista */}
        <section>
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-50">
              <Search size={48} className="mb-4 text-quipu-text/30" />
              <p className="text-center font-medium">No hay transacciones<br/>para este filtro</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((tx, index) => (
                <div 
                  key={tx.id} 
                  className="bg-white rounded-2xl p-4 border border-quipu-text/10 shadow-sm flex items-center justify-between animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-quipu-light rounded-full flex items-center justify-center text-lg font-serif text-quipu-primary">
                      {tx.source.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-quipu-dark text-sm">{tx.type}</p>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-quipu-text/50">{tx.date}</span>
                        <span className="text-quipu-text/20">•</span>
                        <span className="text-quipu-text/70 font-medium">{tx.source}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.isIncome ? 'text-quipu-accent' : 'text-quipu-primary'}`}>
                      {tx.isIncome ? '+' : '-'} Bs {tx.amount}
                    </p>
                    <div className="inline-flex items-center space-x-1 bg-quipu-accent/10 px-2 py-0.5 rounded-full mt-1 animate-pulse-slow">
                      <span className="text-[10px] font-bold text-quipu-accent">Verificado ✓</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
