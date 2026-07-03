import { NextRequest, NextResponse } from "next/server";
import { upvoteToken } from "@/lib/db";
import type { ApiResponse, TokenListing } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const voterFingerprint =
      request.headers.get("x-voter-fingerprint") ??
      request.headers.get("x-forwarded-for") ??
      "anonymous";

    const result = await upvoteToken(id, voterFingerprint);

    if (!result.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: result.error },
        { status: result.error === "Token not found" ? 404 : 409 }
      );
    }

    return NextResponse.json<ApiResponse<TokenListing>>({
      success: true,
      data: result.token,
    });
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Failed to upvote" },
      { status: 500 }
    );
  }
}
