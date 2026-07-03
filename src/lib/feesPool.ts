import { getFeesPool } from "@/lib/db";
import { fetchCreatorVaultBalance, isCreatorVaultConfigured } from "@/lib/creatorVault";
import { fetchSolPriceUsd } from "@/lib/solPrice";
import { DEXSCREENER_UPDATE_COST } from "@/lib/utils";
import type { CreatorFeesPool } from "@/types";

export async function getFeesPoolStatus(): Promise<CreatorFeesPool> {
  const dbPool = await getFeesPool();

  if (!isCreatorVaultConfigured()) {
    return {
      ...dbPool,
      isLive: false,
      targetAmount: dbPool.targetAmount || DEXSCREENER_UPDATE_COST,
    };
  }

  const [vault, solPriceUsd] = await Promise.all([
    fetchCreatorVaultBalance(),
    fetchSolPriceUsd(),
  ]);

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
    isLive: true,
  };
}
