import { PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { solanaRpc } from "./solanaRpc";

const PUMP_PROGRAM_ID = new PublicKey(
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
);
const PUMP_AMM_PROGRAM_ID = new PublicKey(
  "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
);
const LAMPORTS_PER_SOL = 1_000_000_000;

export type CreatorVaultSnapshot = {
  sol: number;
  lamports: string;
  fetchedAt: string;
  error: string | null;
};

let cachedVault: CreatorVaultSnapshot | null = null;
let vaultCacheExpiry = 0;

function pumpPda(seeds: Buffer[]): PublicKey {
  return PublicKey.findProgramAddressSync(seeds, PUMP_PROGRAM_ID)[0];
}

function pumpAmmPda(seeds: Buffer[]): PublicKey {
  return PublicKey.findProgramAddressSync(seeds, PUMP_AMM_PROGRAM_ID)[0];
}

function creatorVaultPda(creator: PublicKey): PublicKey {
  return pumpPda([Buffer.from("creator-vault"), creator.toBuffer()]);
}

function coinCreatorVaultAuthorityPda(coinCreator: PublicKey): PublicKey {
  return pumpAmmPda([Buffer.from("creator_vault"), coinCreator.toBuffer()]);
}

export function lamportsToSol(lamports: bigint): number {
  return Number(lamports) / LAMPORTS_PER_SOL;
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

export function getSolanaRpcUrl(): string | null {
  const url = process.env.SOLANA_RPC_URL?.trim();
  return url || null;
}

type AccountInfoResult = {
  lamports: number;
  data: [string, string];
  owner: string;
};

async function getPumpCreatorVaultLamports(
  rpcUrl: string,
  creator: PublicKey
): Promise<bigint> {
  const creatorVault = creatorVaultPda(creator);
  const result = await solanaRpc<{ value: AccountInfoResult | null }>(
    rpcUrl,
    "getAccountInfo",
    [creatorVault.toBase58(), { encoding: "base64" }]
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
  creator: PublicKey
): Promise<bigint> {
  const authority = coinCreatorVaultAuthorityPda(creator);
  const ata = getAssociatedTokenAddressSync(
    NATIVE_MINT,
    authority,
    true,
    TOKEN_PROGRAM_ID
  );

  try {
    const result = await solanaRpc<{ value: { amount: string } }>(
      rpcUrl,
      "getTokenAccountBalance",
      [ata.toBase58()]
    );
    return BigInt(result.value.amount);
  } catch {
    return BigInt(0);
  }
}

/** Same result as OnlinePumpSdk.getCreatorVaultBalanceBothPrograms — HTTP RPC only. */
export async function fetchCreatorVaultBalanceBothPrograms(
  rpcUrl: string,
  creator: PublicKey
): Promise<bigint> {
  const [pumpLamports, ammLamports] = await Promise.all([
    getPumpCreatorVaultLamports(rpcUrl, creator),
    getAmmCreatorVaultLamports(rpcUrl, creator),
  ]);
  return pumpLamports + ammLamports;
}

export async function fetchCreatorVaultBalance(): Promise<CreatorVaultSnapshot | null> {
  const creatorPk = getCreatorPublicKey();
  const rpcUrl = getSolanaRpcUrl();
  if (!creatorPk || !rpcUrl) return null;

  const now = Date.now();
  const cacheMs = Number(process.env.CREATOR_VAULT_CACHE_MS) || 4_000;
  if (cachedVault && !cachedVault.error && now < vaultCacheExpiry) {
    return cachedVault;
  }

  try {
    const lamports = await fetchCreatorVaultBalanceBothPrograms(
      rpcUrl,
      creatorPk
    );
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
