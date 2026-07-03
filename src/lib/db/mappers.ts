import type { CreatorFeesPool, TokenListing } from "@/types";

export type TokenRow = {
  id: string;
  contract_address: string;
  name: string;
  symbol: string;
  image_url: string | null;
  market_cap: number;
  price_usd: number;
  price_change_24h: number;
  volume_24h: number;
  liquidity_usd: number;
  dexscreener_url: string;
  chain_id: string;
  upvotes: number;
  qualified: boolean;
  created_at: string;
  updated_at: string;
};

export type FeesPoolRow = {
  id: number;
  current_balance: number;
  target_amount: number;
  total_collected: number;
  total_paid_out: number;
  last_payout_at: string | null;
  next_payout_token_id: string | null;
};

export function mapTokenRow(row: TokenRow): TokenListing {
  return {
    id: row.id,
    contractAddress: row.contract_address,
    name: row.name,
    symbol: row.symbol,
    imageUrl: row.image_url,
    marketCap: Number(row.market_cap),
    priceUsd: Number(row.price_usd),
    priceChange24h: Number(row.price_change_24h),
    volume24h: Number(row.volume_24h),
    liquidityUsd: Number(row.liquidity_usd),
    dexscreenerUrl: row.dexscreener_url,
    chainId: row.chain_id,
    upvotes: row.upvotes,
    qualified: row.qualified,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapTokenInsert(
  data: Omit<TokenListing, "id" | "upvotes" | "createdAt" | "updatedAt">
) {
  return {
    contract_address: data.contractAddress,
    name: data.name,
    symbol: data.symbol,
    image_url: data.imageUrl,
    market_cap: data.marketCap,
    price_usd: data.priceUsd,
    price_change_24h: data.priceChange24h,
    volume_24h: data.volume24h,
    liquidity_usd: data.liquidityUsd,
    dexscreener_url: data.dexscreenerUrl,
    chain_id: data.chainId,
    qualified: data.qualified,
  };
}

export function mapFeesPoolRow(
  row: FeesPoolRow,
  nextPayoutTokenId: string | null
): CreatorFeesPool {
  return {
    currentBalance: Number(row.current_balance),
    targetAmount: Number(row.target_amount),
    totalCollected: Number(row.total_collected),
    totalPaidOut: Number(row.total_paid_out),
    lastPayoutAt: row.last_payout_at,
    nextPayoutTokenId,
  };
}
