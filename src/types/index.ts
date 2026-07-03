export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity?: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
  info?: {
    imageUrl?: string;
    websites?: { url: string }[];
    socials?: { type: string; url: string }[];
  };
}

export interface DexScreenerResponse {
  schemaVersion: string;
  pairs: DexScreenerPair[] | null;
}

/** v1 API returns pairs array directly */
export type DexScreenerTokensV1Response = DexScreenerPair[];

export interface TokenListing {
  id: string;
  contractAddress: string;
  name: string;
  symbol: string;
  imageUrl: string | null;
  marketCap: number;
  priceUsd: number;
  priceChange24h: number;
  volume24h: number;
  liquidityUsd: number;
  dexscreenerUrl: string;
  chainId: string;
  upvotes: number;
  qualified: boolean;
  createdAt: string;
  updatedAt: string;
  profile: DexScreenerProfile | null;
}

export interface DexScreenerProfile {
  coinImageUrl: string;
  bannerUrl: string;
  description: string;
  website: string | null;
  docs: string | null;
  twitter: string | null;
  telegram: string | null;
  discord: string | null;
  tiktok: string | null;
  instagram: string | null;
  extraLink: string | null;
}

export interface CreatorFeesPool {
  currentBalance: number;
  targetAmount: number;
  totalCollected: number;
  totalPaidOut: number;
  lastPayoutAt: string | null;
  nextPayoutTokenId: string | null;
  /** Unclaimed creator vault balance in SOL (on-chain) */
  creatorVaultSol?: number;
  /** Vault balance converted to USD */
  creatorVaultUsd?: number | null;
  creatorVaultFetchedAt?: string | null;
  creatorVaultError?: string | null;
  solPriceUsd?: number | null;
  isLive?: boolean;
}

export interface VoteRecord {
  id: string;
  tokenId: string;
  voterFingerprint: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
