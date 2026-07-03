import { NextRequest, NextResponse } from "next/server";
import { fetchTokenFromDexScreener, pairToTokenData } from "@/lib/dexscreener";
import { isValidSolanaAddress } from "@/lib/utils";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");
  const chainId = request.nextUrl.searchParams.get("chainId") ?? "solana";

  if (!address) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Address parameter is required" },
      { status: 400 }
    );
  }

  if (chainId === "solana" && !isValidSolanaAddress(address)) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Invalid Solana contract address" },
      { status: 400 }
    );
  }

  const result = await fetchTokenFromDexScreener(address, chainId);
  if (!result) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Token not found on DexScreener" },
      { status: 404 }
    );
  }

  const preview = pairToTokenData(address, result.pair, result.qualified);

  return NextResponse.json({
    success: true,
    data: preview,
  });
}
