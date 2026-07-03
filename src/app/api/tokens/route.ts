import { NextRequest, NextResponse } from "next/server";
import { fetchTokenFromDexScreener, pairToTokenData } from "@/lib/dexscreener";
import {
  createToken,
  getAllTokens,
  getTokenByAddress,
} from "@/lib/db";
import {
  normalizeDexProfile,
  validateDexProfile,
} from "@/lib/validateProfile";
import { isValidSolanaAddress } from "@/lib/utils";
import type { ApiResponse, DexScreenerProfile, TokenListing } from "@/types";

export async function GET() {
  try {
    const tokens = await getAllTokens();
    return NextResponse.json<ApiResponse<TokenListing[]>>({
      success: true,
      data: tokens,
    });
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const contractAddress = body.contractAddress?.trim();
    const profileInput = body.profile as Partial<DexScreenerProfile> | undefined;

    if (!contractAddress) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Contract address is required" },
        { status: 400 }
      );
    }

    if (!profileInput) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "DexScreener profile is required" },
        { status: 400 }
      );
    }

    const validation = validateDexProfile(profileInput);
    if (!validation.valid) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: Object.values(validation.errors)[0] ?? "Invalid profile",
        },
        { status: 400 }
      );
    }

    if (!isValidSolanaAddress(contractAddress)) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Invalid Solana contract address" },
        { status: 400 }
      );
    }

    const existing = await getTokenByAddress(contractAddress);
    if (existing) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "This token is already listed" },
        { status: 409 }
      );
    }

    const result = await fetchTokenFromDexScreener(contractAddress);
    if (!result) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error:
            "Token not found on DexScreener. Make sure it has an active trading pair on Solana.",
        },
        { status: 404 }
      );
    }

    const tokenData = pairToTokenData(
      contractAddress,
      result.pair,
      result.qualified
    );

    const profile = normalizeDexProfile(profileInput);

    const token = await createToken({
      ...tokenData,
      profile,
    });

    return NextResponse.json<ApiResponse<TokenListing>>(
      { success: true, data: token },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Failed to list token" },
      { status: 500 }
    );
  }
}
