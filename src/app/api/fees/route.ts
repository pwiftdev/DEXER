import { NextResponse } from "next/server";
import { getFeesPoolStatus } from "@/lib/feesPool";
import type { ApiResponse, CreatorFeesPool } from "@/types";

export async function GET() {
  try {
    const pool = await getFeesPoolStatus();
    return NextResponse.json<ApiResponse<CreatorFeesPool>>({
      success: true,
      data: pool,
    });
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Failed to fetch fees pool" },
      { status: 500 }
    );
  }
}
