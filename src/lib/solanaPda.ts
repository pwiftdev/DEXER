import { createHash } from "crypto";
import bs58 from "bs58";
import { ed25519 } from "@noble/curves/ed25519.js";

const PDA_MARKER = Buffer.from("ProgramDerivedAddress");

export const PUMP_PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
export const PUMP_AMM_PROGRAM_ID = "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA";
export const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
export const ASSOCIATED_TOKEN_PROGRAM_ID =
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
export const NATIVE_MINT = "So11111111111111111111111111111111111111112";

function decodeAddress(address: string): Uint8Array {
  const bytes = bs58.decode(address);
  if (bytes.length !== 32) {
    throw new Error(`Invalid address length: ${address}`);
  }
  return bytes;
}

function isOnCurve(publicKey: Uint8Array): boolean {
  try {
    ed25519.Point.fromBytes(publicKey);
    return true;
  } catch {
    return false;
  }
}

export function findProgramAddressSync(
  seeds: Buffer[],
  programId: string
): string {
  const programBytes = decodeAddress(programId);

  for (let bump = 255; bump >= 0; bump--) {
    const hash = createHash("sha256");
    for (const seed of seeds) {
      hash.update(seed);
    }
    hash.update(Buffer.from([bump]));
    hash.update(programBytes);
    hash.update(PDA_MARKER);

    const address = new Uint8Array(hash.digest());
    if (!isOnCurve(address)) {
      return bs58.encode(address);
    }
  }

  throw new Error("Unable to find a valid program address");
}

export function getAssociatedTokenAddressSync(
  mint: string,
  owner: string,
  tokenProgramId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): string {
  return findProgramAddressSync(
    [
      Buffer.from(decodeAddress(owner)),
      Buffer.from(decodeAddress(tokenProgramId)),
      Buffer.from(decodeAddress(mint)),
    ],
    associatedTokenProgramId
  );
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    decodeAddress(address.trim());
    return true;
  } catch {
    return false;
  }
}

export function creatorVaultPda(creator: string): string {
  return findProgramAddressSync(
    [Buffer.from("creator-vault"), Buffer.from(decodeAddress(creator))],
    PUMP_PROGRAM_ID
  );
}

export function coinCreatorVaultAuthorityPda(coinCreator: string): string {
  return findProgramAddressSync(
    [Buffer.from("creator_vault"), Buffer.from(decodeAddress(coinCreator))],
    PUMP_AMM_PROGRAM_ID
  );
}

export function coinCreatorVaultAta(coinCreator: string): string {
  const authority = coinCreatorVaultAuthorityPda(coinCreator);
  return getAssociatedTokenAddressSync(NATIVE_MINT, authority);
}
