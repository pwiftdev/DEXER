import { Connection, PublicKey } from "@solana/web3.js";

const LAMPORTS_PER_SOL = 1_000_000_000;

export type CreatorVaultSnapshot = {
  sol: number;
  lamports: string;
  fetchedAt: string;
  error: string | null;
};

let cachedVault: CreatorVaultSnapshot | null = null;
let vaultCacheExpiry = 0;

export function lamportsToSol(lamports: bigint | string | number): number {
  return Number(lamports.toString()) / LAMPORTS_PER_SOL;
}

export function getCreatorPublicKey(): PublicKey | null {
  const key = process.env.CREATOR_PUBLIC_KEY ?? process.env.WATCH_ACCOUNT;
  if (!key?.trim()) return null;

  try {
    return new PublicKey(key.trim());
  } catch {
    return null;
  }
}

export function getSolanaConnection(): Connection | null {
  const url = process.env.SOLANA_RPC_URL?.trim();
  if (!url) return null;
  return new Connection(url, "confirmed");
}

async function loadOnlinePumpSdk() {
  try {
    const mod = await import("@pump-fun/pump-sdk");
    return mod.OnlinePumpSdk;
  } catch (err) {
    console.error("[creatorVault] Failed to load @pump-fun/pump-sdk:", err);
    return null;
  }
}

export async function fetchCreatorVaultBalance(): Promise<CreatorVaultSnapshot | null> {
  const creatorPk = getCreatorPublicKey();
  const connection = getSolanaConnection();
  if (!creatorPk || !connection) return null;

  const now = Date.now();
  const cacheMs = Number(process.env.CREATOR_VAULT_CACHE_MS) || 4_000;
  if (cachedVault && !cachedVault.error && now < vaultCacheExpiry) {
    return cachedVault;
  }

  const OnlinePumpSdk = await loadOnlinePumpSdk();
  if (!OnlinePumpSdk) {
    const error = "Pump SDK unavailable on server";
    if (cachedVault) return { ...cachedVault, error };
    return {
      sol: 0,
      lamports: "0",
      fetchedAt: new Date().toISOString(),
      error,
    };
  }

  try {
    const sdk = new OnlinePumpSdk(connection);
    const lamports = await sdk.getCreatorVaultBalanceBothPrograms(creatorPk);
    const snapshot: CreatorVaultSnapshot = {
      sol: lamportsToSol(lamports.toString()),
      lamports: lamports.toString(),
      fetchedAt: new Date().toISOString(),
      error: null,
    };
    cachedVault = snapshot;
    vaultCacheExpiry = now + cacheMs;
    return snapshot;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch creator vault balance";
    console.error("[creatorVault] RPC fetch failed:", err);

    if (cachedVault) {
      return { ...cachedVault, error: message };
    }

    return {
      sol: 0,
      lamports: "0",
      fetchedAt: new Date().toISOString(),
      error: message,
    };
  }
}

export function isCreatorVaultConfigured(): boolean {
  return Boolean(getCreatorPublicKey() && getSolanaConnection());
}
