import { getFeesPool } from "@/lib/db";
import { fetchCreatorVaultBalance, isCreatorVaultConfigured } from "@/lib/creatorVault";
import { fetchSolPriceUsd } from "@/lib/solPrice";
import { DEXSCREENER_UPDATE_COST } from "@/lib/utils";
import type { CreatorFeesPool } from "@/types";

export function getDefaultFeesPool(): CreatorFeesPool {
  return {
    currentBalance: 0,
    targetAmount: DEXSCREENER_UPDATE_COST,
    totalCollected: 0,
    totalPaidOut: 0,
    lastPayoutAt: null,
    nextPayoutTokenId: null,
    isLive: false,
  };
}

async function getDbFeesPool(): Promise<CreatorFeesPool> {
  try {
    return await getFeesPool();
  } catch (err) {
    console.error("[feesPool] Supabase fetch failed:", err);
    return getDefaultFeesPool();
  }
}

export async function getFeesPoolStatus(): Promise<CreatorFeesPool> {
  const dbPool = await getDbFeesPool();

  if (!isCreatorVaultConfigured()) {
    return {
      ...dbPool,
      isLive: false,
      targetAmount: dbPool.targetAmount || DEXSCREENER_UPDATE_COST,
    };
  }

  let vault;
  let solPriceUsd: number | null = null;

  try {
    [vault, solPriceUsd] = await Promise.all([
      fetchCreatorVaultBalance(),
      fetchSolPriceUsd(),
    ]);
  } catch (err) {
    console.error("[feesPool] On-chain fetch failed:", err);
    return {
      ...dbPool,
      isLive: false,
      creatorVaultError:
        err instanceof Error ? err.message : "Failed to fetch vault balance",
    };
  }

  if (!vault) {
    return { ...dbPool, isLive: false };
  }

  const creatorVaultUsd =
    solPriceUsd !== null ? vault.sol * solPriceUsd : null;

  return {
    ...dbPool,
    currentBalance: creatorVaultUsd ?? dbPool.currentBalance,
    targetAmount: dbPool.targetAmount || DEXSCREENER_UPDATE_COST,
    totalCollected: creatorVaultUsd ?? dbPool.totalCollected,
    creatorVaultSol: vault.sol,
    creatorVaultUsd,
    creatorVaultFetchedAt: vault.fetchedAt,
    creatorVaultError: vault.error,
    solPriceUsd,
    isLive: !vault.error,
  };
}
