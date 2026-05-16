# Quipu — Decentralized Payment Identity Protocol

> _"Hace 600 años los incas registraban deudas y transacciones en nudos de colores sin necesidad de bancos. Hoy lo hacemos con criptografía."_

Quipu convierte el historial de pagos QR de los **210M de latinos sin acceso a crédito formal** en una identidad financiera on-chain verificable. Sin banco. Sin colateral. En 3 minutos desde un celular.

[![Built on Avalanche](https://img.shields.io/badge/Built%20on-Avalanche-E84142?style=flat-square)](https://avax.network)
[![Hackathon 2026](https://img.shields.io/badge/Hackathon-2026-22c55e?style=flat-square)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](#)

---

## 🏗️ Arquitectura

```
┌────────────────────────────────────────────────────────────────┐
│              frontend/  ── Next.js 14 + Privy + Wagmi          │
│              (deploy: Vercel)                                  │
└────────────────────────────┬───────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼───────────────────────────────────┐
│              backend/   ── Hono API + Prisma + Neon            │
│              (deploy: Vercel Serverless)                       │
└────────────┬───────────────────────────────┬───────────────────┘
             │                               │
             ▼                               ▼
   ┌──────────────────┐          ┌────────────────────────┐
   │  Reclaim zkTLS   │          │  Avalanche Fuji L1    │
   │  Oracle Provider │          │  (4 smart contracts)  │
   └──────────────────┘          └────────────────────────┘
```

## 📁 Estructura del repositorio

```
team1/
├── frontend/         → Next.js 14 + Tailwind + Privy + Wagmi
├── backend/          → Hono + Prisma + Neon Postgres
├── contracts/        → Foundry: ScoreRegistry, AttestationRegistry, ScoringEngine, LendingPool
├── shared/           → Tipos TypeScript + ABIs compartidos
├── docs/             → Arquitectura, deployment, demo script
└── scripts/          → Generador de datos sintéticos, helpers
```

## 🚀 Quick start

```bash
# 1. Instalar dependencias
pnpm install

# 2. Copiar y configurar .env
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
cp contracts/.env.example contracts/.env

# 3. Levantar todo en paralelo (frontend en :3000, backend en :3001)
pnpm dev

# 4. Compilar y testear contratos
pnpm contracts:build
pnpm contracts:test

# 5. Desplegar contratos a Fuji testnet
pnpm contracts:deploy:fuji
```

## 🎯 Diferenciadores técnicos

1. **zkTLS en vivo** — extracción de datos de Tigo Money / SIMPLE sin API oficial, con privacidad criptográfica vía Reclaim Protocol.
2. **Subnet justificada** — datos sensibles en L1 propia (futuro KYC compliant); liquidez en C-Chain.
3. **Repago automático** — % de cada cobro QR va al pool. Intercepta el flujo en el origen.

## 🧪 Tests

```bash
pnpm contracts:test       # Foundry forge test
pnpm --filter @quipu/backend test
pnpm --filter @quipu/frontend test
```

## 🚢 Deploy

Ver [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) para instrucciones completas.

- **frontend** → Vercel
- **backend** → Vercel serverless
- **contracts** → Avalanche Fuji (testnet) / C-Chain (mainnet)

## 📚 Documentación

- [Arquitectura técnica](docs/ARCHITECTURE.md)
- [Guía de deployment](docs/DEPLOYMENT.md)
- [Script del demo](docs/DEMO_SCRIPT.md)

## 📄 Licencia

MIT
