// Seed mínimo para tener datos en desarrollo.
// Ejecutar: pnpm db:seed

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.info("🌱 Seeding database...");

  const alice = await db.user.upsert({
    where: { walletAddress: "0xA1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1" },
    update: {},
    create: {
      walletAddress: "0xA1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1",
      phoneNumber: "+59171234567",
      firstName: "María",
      ci: "1234",
      scores: {
        create: {
          walletAddress: "0xA1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1",
          score: 712,
          totalTxs: 312,
          volumeBs: 4_800_000n, // 48,000 Bs
        },
      },
    },
  });

  console.info(`  ✓ Usuario demo creado: ${alice.firstName} (${alice.walletAddress})`);
  console.info("🌱 Seed completo");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void db.$disconnect());
