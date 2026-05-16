import { create } from "zustand";
import {
  WalletTransaction,
  ScoreEvent,
  ActiveLoan,
  PastLoan,
  EXCHANGE_RATE,
  usdcToBs,
  bsToUsdc,
} from "@/types/quipu.types";

// ─── CREDIT LIMIT CALCULATOR ───
function calcCreditLimitBs(score: number): number {
  if (score >= 750) return 8000;
  if (score >= 680) return 6000;
  if (score >= 600) return 4000;
  if (score >= 500) return 2000;
  return 1000;
}

// ─── STATE INTERFACE ───
interface QuipuState {
  // Identity
  userId: string;
  userName: string;
  userPhone: string;

  // Wallet
  balanceUsdc: number;
  transactions: WalletTransaction[];

  // Score
  score: number;
  scoreHistory: ScoreEvent[];
  isScoreLoaded: boolean;
  dataSource: "external" | "internal" | "hybrid";

  // Credit
  activeLoan: ActiveLoan | null;
  loanHistory: PastLoan[];

  // ─── COMPUTED GETTERS ───
  getBalanceBs: () => number;
  getCreditLimitBs: () => number;
  getAvailableCreditBs: () => number;

  // ─── IDENTITY ACTIONS ───
  setUserName: (name: string) => void;

  // ─── SCORE ACTIONS ───
  setScore: (score: number) => void;
  setScoreLoaded: (loaded: boolean) => void;

  // ─── WALLET ACTIONS ───
  receiveLoan: (principalBs: number, termMonths: number) => void;
  receiveQRPayment: (amountBs: number, merchant?: string) => void;
  payInstallment: (amountBs?: number) => void;

  // Legacy compat — used by solicitar page
  setActiveLoan: (loan: ActiveLoan) => void;
}

// ─── STORE ───
export const useQuipuStore = create<QuipuState>((set, get) => ({
  // ─── INITIAL STATE ───
  userId: "user_mock",
  userName: "María Choque",
  userPhone: "+591 71234567",
  isCiVerified: false,

  balanceUsdc: 0,
  transactions: [],

  score: 680,
  scoreHistory: [],
  isScoreLoaded: false,
  dataSource: "external",

  activeLoan: null,
  loanHistory: [],

  // ─── COMPUTED ───
  getBalanceBs: () => usdcToBs(get().balanceUsdc),

  getCreditLimitBs: () => {
    const { score, isCiVerified } = get();
    const base = calcCreditLimitBs(score);
    return isCiVerified ? base : Math.min(base, 1500);
  },

  getAvailableCreditBs: () => {
    const { activeLoan, score, isCiVerified } = get();
    const limit = isCiVerified ? calcCreditLimitBs(score) : Math.min(calcCreditLimitBs(score), 1500);
    if (!activeLoan) return limit;
    if (
      activeLoan.status === "active" &&
      activeLoan.paidInstallments >= Math.ceil(activeLoan.termMonths / 2)
    ) {
      return Math.round(limit * 0.5);
    }
    return 0;
  },

  // ─── IDENTITY ───
  setUserName: (userName) => set({ userName }),
  verifyCi: () => set({ isCiVerified: true }),

  // ─── SCORE ───
  setScore: (score) => set({ score }),
  setScoreLoaded: (isScoreLoaded) => set({ isScoreLoaded }),

  // ─── LEGACY COMPAT ───
  setActiveLoan: (loan) => set({ activeLoan: loan }),

  // ─── RECEIVE LOAN ───
  receiveLoan: (principalBs, termMonths) => {
    const principalUsdc = bsToUsdc(principalBs);
    const annualRate = 0.18;
    const monthlyRate = annualRate / 12;
    const totalPayableBs = Math.round(principalBs * (1 + monthlyRate * termMonths));
    const totalPayableUsdc = bsToUsdc(totalPayableBs);
    const monthlyPaymentBs = Math.round(totalPayableBs / termMonths);
    const monthlyPaymentUsdc = bsToUsdc(monthlyPaymentBs);

    const now = new Date();
    const loanId = `loan_${Date.now()}`;

    const loan: ActiveLoan = {
      loanId,
      principalUsdc,
      principalBs,
      totalPayableUsdc,
      totalPayableBs,
      monthlyPaymentUsdc,
      monthlyPaymentBs,
      termMonths,
      paidInstallments: 0,
      paidTowardsNextUsdc: 0,
      status: "active",
      createdAt: now,
    };

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}_loan`,
      type: "loan_received",
      amountUsdc: principalUsdc,
      amountBs: principalBs,
      description: `Préstamo aprobado — Bs ${principalBs.toLocaleString()}`,
      timestamp: now,
      scoreImpact: -5,
    };

    const scoreEvt: ScoreEvent = {
      delta: -5,
      reason: "Nuevo préstamo recibido",
      timestamp: now,
    };

    set((s) => ({
      activeLoan: loan,
      balanceUsdc: s.balanceUsdc + principalUsdc,
      transactions: [tx, ...s.transactions],
      score: Math.max(s.score - 5, 300),
      scoreHistory: [scoreEvt, ...s.scoreHistory],
    }));
  },

  // ─── RECEIVE QR PAYMENT ───
  receiveQRPayment: (amountBs, merchant) => {
    const amountUsdc = bsToUsdc(amountBs);
    const now = new Date();

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}_qr`,
      type: "qr_received",
      amountUsdc,
      amountBs,
      description: merchant
        ? `Cobro de ${merchant}`
        : "Cobro de cliente",
      merchant,
      timestamp: now,
      scoreImpact: 3,
    };

    const scoreEvt: ScoreEvent = {
      delta: 3,
      reason: "Cobro QR registrado",
      timestamp: now,
    };

    set((s) => {
      let newBalance = s.balanceUsdc + amountUsdc;
      let newLoan = s.activeLoan;

      // Auto-repay 14.37% if there's an active loan
      if (newLoan && newLoan.status === "active") {
        const autoRepayUsdc = Math.round(amountUsdc * 0.1437 * 1000000) / 1000000;
        newBalance -= autoRepayUsdc;

        let paidTowards = newLoan.paidTowardsNextUsdc + autoRepayUsdc;
        let paidInstallments = newLoan.paidInstallments;

        if (paidTowards >= newLoan.monthlyPaymentUsdc) {
          paidInstallments += 1;
          paidTowards -= newLoan.monthlyPaymentUsdc;
        }

        const isFullyPaid = paidInstallments >= newLoan.termMonths;

        newLoan = {
          ...newLoan,
          paidInstallments,
          paidTowardsNextUsdc: paidTowards,
          status: isFullyPaid ? "paid" : "active",
        };
      }

      return {
        balanceUsdc: newBalance,
        transactions: [tx, ...s.transactions],
        score: Math.min(s.score + 3, 850),
        scoreHistory: [scoreEvt, ...s.scoreHistory],
        activeLoan: newLoan,
      };
    });
  },

  // ─── PAY INSTALLMENT ───
  payInstallment: (amountBs) => {
    const { activeLoan, balanceUsdc, score } = get();
    if (!activeLoan || activeLoan.status !== "active") return;

    const payBs = amountBs ?? activeLoan.monthlyPaymentBs;
    const payUsdc = bsToUsdc(payBs);

    // Can't pay more than balance
    if (payUsdc > balanceUsdc) return;

    const now = new Date();

    let paidTowards = activeLoan.paidTowardsNextUsdc + payUsdc;
    let paidInstallments = activeLoan.paidInstallments;

    while (paidTowards >= activeLoan.monthlyPaymentUsdc && paidInstallments < activeLoan.termMonths) {
      paidInstallments += 1;
      paidTowards -= activeLoan.monthlyPaymentUsdc;
    }

    const isFullyPaid = paidInstallments >= activeLoan.termMonths;

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}_pay`,
      type: "loan_payment",
      amountUsdc: payUsdc,
      amountBs: payBs,
      description: isFullyPaid
        ? "¡Préstamo completado! 🎉"
        : `Cuota pagada — Bs ${payBs.toLocaleString()}`,
      timestamp: now,
      scoreImpact: isFullyPaid ? 25 : 12,
    };

    const scoreEvt: ScoreEvent = {
      delta: isFullyPaid ? 25 : 12,
      reason: isFullyPaid ? "Préstamo pagado completamente" : "Cuota pagada",
      timestamp: now,
    };

    const newLoan: ActiveLoan = {
      ...activeLoan,
      paidInstallments,
      paidTowardsNextUsdc: paidTowards,
      status: isFullyPaid ? "paid" : "active",
    };

    const newLoanHistory = isFullyPaid
      ? [
          ...get().loanHistory,
          {
            loanId: activeLoan.loanId,
            principalBs: activeLoan.principalBs,
            totalPaidBs: activeLoan.totalPayableBs,
            termMonths: activeLoan.termMonths,
            completedAt: now,
          },
        ]
      : get().loanHistory;

    set({
      activeLoan: isFullyPaid ? null : newLoan,
      balanceUsdc: balanceUsdc - payUsdc,
      transactions: [tx, ...get().transactions],
      score: Math.min(score + (isFullyPaid ? 25 : 12), 850),
      scoreHistory: [scoreEvt, ...get().scoreHistory],
      loanHistory: newLoanHistory,
    });
  },
}));
