import type { CreatorFeesPool, DexScreenerProfile, TokenListing } from "@/types";

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
  profile_coin_image: string | null;
  profile_banner: string | null;
  profile_description: string | null;
  profile_website: string | null;
  profile_docs: string | null;
  profile_twitter: string | null;
  profile_telegram: string | null;
  profile_discord: string | null;
  profile_tiktok: string | null;
  profile_instagram: string | null;
  profile_extra_link: string | null;
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

export function mapProfileRow(row: TokenRow): DexScreenerProfile | null {
  if (!row.profile_coin_image || !row.profile_banner || !row.profile_description) {
    return null;
  }

  return {
    coinImageUrl: row.profile_coin_image,
    bannerUrl: row.profile_banner,
    description: row.profile_description,
    website: row.profile_website,
    docs: row.profile_docs,
    twitter: row.profile_twitter,
    telegram: row.profile_telegram,
    discord: row.profile_discord,
    tiktok: row.profile_tiktok,
    instagram: row.profile_instagram,
    extraLink: row.profile_extra_link,
  };
}

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
    profile: mapProfileRow(row),
  };
}

export function mapProfileInsert(profile: DexScreenerProfile) {
  return {
    profile_coin_image: profile.coinImageUrl,
    profile_banner: profile.bannerUrl,
    profile_description: profile.description,
    profile_website: profile.website,
    profile_docs: profile.docs,
    profile_twitter: profile.twitter,
    profile_telegram: profile.telegram,
    profile_discord: profile.discord,
    profile_tiktok: profile.tiktok,
    profile_instagram: profile.instagram,
    profile_extra_link: profile.extraLink,
  };
}

export function mapTokenInsert(
  data: Omit<TokenListing, "id" | "upvotes" | "createdAt" | "updatedAt"> & {
    profile: DexScreenerProfile;
  }
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
    ...mapProfileInsert(data.profile),
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
