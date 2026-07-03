import {
  coinCreatorVaultAta,
  creatorVaultPda,
  isValidSolanaAddress,
} from "./solanaPda";
import { solanaRpc } from "./solanaRpc";

const LAMPORTS_PER_SOL = 1_000_000_000;

export type CreatorVaultSnapshot = {
  sol: number;
  lamports: string;
  fetchedAt: string;
  error: string | null;
};

let cachedVault: CreatorVaultSnapshot | null = null;
let vaultCacheExpiry = 0;

export function lamportsToSol(lamports: bigint): number {
  return Number(lamports) / LAMPORTS_PER_SOL;
}

export function getCreatorPublicKey(): string | null {
  const key = process.env.CREATOR_PUBLIC_KEY ?? process.env.WATCH_ACCOUNT;
  if (!key?.trim()) return null;
  const trimmed = key.trim();
  return isValidSolanaAddress(trimmed) ? trimmed : null;
}

export function getSolanaRpcUrl(): string | null {
  const url = process.env.SOLANA_RPC_URL?.trim();
  return url || null;
}

type AccountInfoResult = {
  lamports: number;
  data: [string, string];
};

async function getPumpCreatorVaultLamports(
  rpcUrl: string,
  creator: string
): Promise<bigint> {
  const creatorVault = creatorVaultPda(creator);
  const result = await solanaRpc<{ value: AccountInfoResult | null }>(
    rpcUrl,
    "getAccountInfo",
    [creatorVault, { encoding: "base64" }]
  );

  const accountInfo = result.value;
  if (!accountInfo) return BigInt(0);

  const dataLength = Buffer.from(accountInfo.data[0], "base64").length;
  const rentExemption = BigInt(
    await solanaRpc<number>(rpcUrl, "getMinimumBalanceForRentExemption", [
      dataLength,
    ])
  );
  const lamports = BigInt(accountInfo.lamports);
  if (lamports <= rentExemption) return BigInt(0);
  return lamports - rentExemption;
}

async function getAmmCreatorVaultLamports(
  rpcUrl: string,
  creator: string
): Promise<bigint> {
  const ata = coinCreatorVaultAta(creator);

  try {
    const result = await solanaRpc<{ value: { amount: string } }>(
      rpcUrl,
      "getTokenAccountBalance",
      [ata]
    );
    return BigInt(result.value.amount);
  } catch {
    return BigInt(0);
  }
}

export async function fetchCreatorVaultBalanceBothPrograms(
  rpcUrl: string,
  creator: string
): Promise<bigint> {
  const [pumpLamports, ammLamports] = await Promise.all([
    getPumpCreatorVaultLamports(rpcUrl, creator),
    getAmmCreatorVaultLamports(rpcUrl, creator),
  ]);
  return pumpLamports + ammLamports;
}

export async function fetchCreatorVaultBalance(): Promise<CreatorVaultSnapshot | null> {
  const creator = getCreatorPublicKey();
  const rpcUrl = getSolanaRpcUrl();
  if (!creator || !rpcUrl) return null;

  const now = Date.now();
  const cacheMs = Number(process.env.CREATOR_VAULT_CACHE_MS) || 4_000;
  if (cachedVault && !cachedVault.error && now < vaultCacheExpiry) {
    return cachedVault;
  }

  try {
    const lamports = await fetchCreatorVaultBalanceBothPrograms(rpcUrl, creator);
    const snapshot: CreatorVaultSnapshot = {
      sol: lamportsToSol(lamports),
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
  return Boolean(getCreatorPublicKey() && getSolanaRpcUrl());
}
