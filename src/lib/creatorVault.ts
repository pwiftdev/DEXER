import { Connection, PublicKey } from "@solana/web3.js";
import { OnlinePumpSdk } from "@pump-fun/pump-sdk";
import BN from "bn.js";

const LAMPORTS_PER_SOL = 1_000_000_000;

export type CreatorVaultSnapshot = {
  sol: number;
  lamports: string;
  fetchedAt: string;
  error: string | null;
};

let cachedVault: CreatorVaultSnapshot | null = null;
let vaultCacheExpiry = 0;

export function lamportsBnToSol(lamports: BN): number {
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

export async function getCreatorVaultBalanceBothProgramsQuiet(
  sdk: OnlinePumpSdk,
  creatorPk: PublicKey
): Promise<BN> {
  try {
    return await sdk.getCreatorVaultBalanceBothPrograms(creatorPk);
  } catch {
    return new BN(0);
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

  try {
    const sdk = new OnlinePumpSdk(connection);
    const lamports = await getCreatorVaultBalanceBothProgramsQuiet(sdk, creatorPk);
    const snapshot: CreatorVaultSnapshot = {
      sol: lamportsBnToSol(lamports),
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
