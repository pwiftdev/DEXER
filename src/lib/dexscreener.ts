import type { DexScreenerPair } from "@/types";
import { MIN_MARKET_CAP } from "@/lib/utils";

const DEXSCREENER_API = "https://api.dexscreener.com/tokens/v1";
export const DEFAULT_CHAIN_ID = "solana";

export async function fetchTokenFromDexScreener(
  contractAddress: string,
  chainId: string = DEFAULT_CHAIN_ID
): Promise<{ pair: DexScreenerPair; qualified: boolean } | null> {
  const address = contractAddress.trim();
  const res = await fetch(`${DEXSCREENER_API}/${chainId}/${address}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;

  const pairs: DexScreenerPair[] = await res.json();
  if (!Array.isArray(pairs) || pairs.length === 0) return null;

  const chainPairs = pairs.filter((p) => p.chainId === chainId);
  const candidates = chainPairs.length > 0 ? chainPairs : pairs;

  const pair = candidates.reduce((best, current) => {
    const bestLiq = best.liquidity?.usd ?? 0;
    const currentLiq = current.liquidity?.usd ?? 0;
    return currentLiq > bestLiq ? current : best;
  });

  const marketCap = pair.marketCap ?? pair.fdv ?? 0;
  const qualified = marketCap >= MIN_MARKET_CAP;

  return { pair, qualified };
}

export function pairToTokenData(
  contractAddress: string,
  pair: DexScreenerPair,
  qualified: boolean
) {
  return {
    contractAddress: contractAddress.trim(),
    name: pair.baseToken.name,
    symbol: pair.baseToken.symbol,
    imageUrl: pair.info?.imageUrl ?? null,
    marketCap: pair.marketCap ?? pair.fdv ?? 0,
    priceUsd: parseFloat(pair.priceUsd) || 0,
    priceChange24h: pair.priceChange?.h24 ?? 0,
    volume24h: pair.volume?.h24 ?? 0,
    liquidityUsd: pair.liquidity?.usd ?? 0,
    dexscreenerUrl: pair.url,
    chainId: pair.chainId,
    qualified,
  };
}
