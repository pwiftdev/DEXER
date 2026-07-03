import { NextResponse } from "next/server";
import type { ApiResponse, CreatorFeesPool } from "@/types";
import { DEXSCREENER_UPDATE_COST } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FALLBACK_POOL: CreatorFeesPool = {
  currentBalance: 0,
  targetAmount: DEXSCREENER_UPDATE_COST,
  totalCollected: 0,
  totalPaidOut: 0,
  lastPayoutAt: null,
  nextPayoutTokenId: null,
  isLive: false,
};

export async function GET() {
  try {
    const { getFeesPoolStatus } = await import("@/lib/feesPool");
    const pool = await getFeesPoolStatus();
    return NextResponse.json<ApiResponse<CreatorFeesPool>>({
      success: true,
      data: pool,
    });
  } catch (err) {
    console.error("[api/fees] Unhandled error:", err);
    return NextResponse.json<ApiResponse<CreatorFeesPool>>({
      success: true,
      data: FALLBACK_POOL,
    });
  }
}
