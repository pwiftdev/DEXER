import { NextResponse } from "next/server";
import { getDefaultFeesPool, getFeesPoolStatus } from "@/lib/feesPool";
import type { ApiResponse, CreatorFeesPool } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pool = await getFeesPoolStatus();
    return NextResponse.json<ApiResponse<CreatorFeesPool>>({
      success: true,
      data: pool,
    });
  } catch (err) {
    console.error("[api/fees] Unhandled error:", err);
    return NextResponse.json<ApiResponse<CreatorFeesPool>>({
      success: true,
      data: getDefaultFeesPool(),
    });
  }
}
