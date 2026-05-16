import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { 
  verifyProof, 
  parseTransactions, 
  calculateDpiScore, 
  generateMockPayload 
} from "../../../../../backend/src/services/reclaim.service";

// Initialize Prisma
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { proof, userId = "user_mock", walletAddress = "0xMockAddress" } = body;

    let payloadText = "";

    if (process.env.RECLAIM_MOCK === "true") {
      // 1. Use Mock
      payloadText = generateMockPayload();
    } else {
      // 2. Verify Proof
      if (!proof) {
        return NextResponse.json({ error: "Proof is required" }, { status: 400 });
      }
      
      const appId = process.env.RECLAIM_APP_ID || "";
      const appSecret = process.env.RECLAIM_APP_SECRET || "";
      
      const isValid = await verifyProof(proof, appId, appSecret);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid Reclaim proof" }, { status: 400 });
      }

      // Extract text from proof
      // Simplified: Assuming the proof contains the extracted text in a known field
      payloadText = proof.extractedParameterValues?.extracted_text || "";
    }

    // 3. Parse transactions
    const transactions = parseTransactions(payloadText);

    // 4. Calculate DPI Score
    const score = calculateDpiScore(transactions);
    
    const volumeScore = Math.min((transactions.filter(t => t.isIncome).reduce((sum, t) => sum + t.amount, 0) / 5000) * 100, 100);
    const frequencyScore = Math.min((transactions.length / 20) * 100, 100);
    const consistencyScore = transactions.filter(t => t.isIncome).length > 3 ? 85 : 40;

    // 5. Save to Prisma
    try {
      // We try to save it if the DB is connected, otherwise we just swallow the error for the hackathon demo if DB isn't ready
      await prisma.score.create({
        data: {
          userId,
          walletAddress,
          score,
          totalTxs: transactions.length,
          volumeBs: BigInt(Math.round(transactions.filter(t => t.isIncome).reduce((sum, t) => sum + t.amount, 0))),
        }
      });
    } catch (dbError) {
      console.warn("Could not save to DB (might not be initialized):", dbError);
    }

    // 6. Return JSON
    return NextResponse.json({
      score,
      transactionCount: transactions.length,
      breakdown: {
        volume: Math.round(volumeScore),
        frequency: Math.round(frequencyScore),
        consistency: Math.round(consistencyScore)
      },
      transactions
    });
  } catch (error) {
    console.error("Score API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
