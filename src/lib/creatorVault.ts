import { Connection, PublicKey } from "@solana/web3.js";
import {
  getAccount,
  getAssociatedTokenAddressSync,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

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

export function getSolanaConnection(): Connection | null {
  const url = process.env.SOLANA_RPC_URL?.trim();
  if (!url) return null;
  return new Connection(url, "confirmed");
}

async function getPumpCreatorVaultLamports(
  connection: Connection,
  creator: PublicKey
): Promise<bigint> {
  const creatorVault = creatorVaultPda(creator);
  const accountInfo = await connection.getAccountInfo(creatorVault);
  if (!accountInfo) return BigInt(0);

  const rentExemption = BigInt(
    await connection.getMinimumBalanceForRentExemption(accountInfo.data.length)
  );
  const lamports = BigInt(accountInfo.lamports);
  if (lamports <= rentExemption) return BigInt(0);
  return lamports - rentExemption;
}

async function getAmmCreatorVaultLamports(
  connection: Connection,
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
    const tokenAccount = await getAccount(
      connection,
      ata,
      undefined,
      TOKEN_PROGRAM_ID
    );
    return tokenAccount.amount;
  } catch {
    return BigInt(0);
  }
}

/** Same result as OnlinePumpSdk.getCreatorVaultBalanceBothPrograms — RPC only, no Pump SDK. */
export async function fetchCreatorVaultBalanceBothPrograms(
  connection: Connection,
  creator: PublicKey
): Promise<bigint> {
  const [pumpLamports, ammLamports] = await Promise.all([
    getPumpCreatorVaultLamports(connection, creator),
    getAmmCreatorVaultLamports(connection, creator),
  ]);
  return pumpLamports + ammLamports;
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
    const lamports = await fetchCreatorVaultBalanceBothPrograms(
      connection,
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
  return Boolean(getCreatorPublicKey() && getSolanaConnection());
}
