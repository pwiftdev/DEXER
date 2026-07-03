import { NextResponse } from "next/server";
import { getFeesPool } from "@/lib/db";
import type { ApiResponse, CreatorFeesPool } from "@/types";

export async function GET() {
  try {
    const pool = await getFeesPool();
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
