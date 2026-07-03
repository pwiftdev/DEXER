import { createClient } from "@/utils/supabase/server";
import type { CreatorFeesPool, TokenListing } from "@/types";
import {
  mapFeesPoolRow,
  mapTokenInsert,
  mapTokenRow,
  type TokenRow,
} from "./mappers";

export async function getAllTokens(): Promise<TokenListing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tokens")
    .select("*")
    .order("upvotes", { ascending: false });

  if (error) throw error;
  return (data as TokenRow[]).map(mapTokenRow);
}

export async function getTokenByAddress(
  address: string
): Promise<TokenListing | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tokens")
    .select("*")
    .eq("contract_address", address.trim())
    .maybeSingle();

  if (error) throw error;
  return data ? mapTokenRow(data as TokenRow) : null;
}

export async function getTokenById(id: string): Promise<TokenListing | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tokens")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapTokenRow(data as TokenRow) : null;
}

export async function createToken(
  data: Omit<TokenListing, "id" | "upvotes" | "createdAt" | "updatedAt"> & {
    profile: NonNullable<TokenListing["profile"]>;
  }
): Promise<TokenListing> {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("tokens")
    .insert(mapTokenInsert(data))
    .select("*")
    .single();

  if (error) throw error;
  return mapTokenRow(row as TokenRow);
}

export async function upvoteToken(
  tokenId: string,
  voterFingerprint: string
): Promise<{ success: boolean; token?: TokenListing; error?: string }> {
  const supabase = await createClient();

  const { data: existingVote } = await supabase
    .from("votes")
    .select("id")
    .eq("token_id", tokenId)
    .eq("voter_fingerprint", voterFingerprint)
    .maybeSingle();

  if (existingVote) {
    return { success: false, error: "You already voted for this token" };
  }

  const token = await getTokenById(tokenId);
  if (!token) {
    return { success: false, error: "Token not found" };
  }

  const { error: voteError } = await supabase.from("votes").insert({
    token_id: tokenId,
    voter_fingerprint: voterFingerprint,
  });

  if (voteError) {
    if (voteError.code === "23505") {
      return { success: false, error: "You already voted for this token" };
    }
    throw voteError;
  }

  const { data: updated, error: updateError } = await supabase
    .from("tokens")
    .update({ upvotes: token.upvotes + 1 })
    .eq("id", tokenId)
    .select("*")
    .single();

  if (updateError) throw updateError;

  return { success: true, token: mapTokenRow(updated as TokenRow) };
}

export async function getFeesPool(): Promise<CreatorFeesPool> {
  const supabase = await createClient();

  const [{ data: pool, error: poolError }, { data: topToken, error: topError }] =
    await Promise.all([
      supabase.from("creator_fees_pool").select("*").eq("id", 1).maybeSingle(),
      supabase
        .from("tokens")
        .select("id")
        .eq("qualified", true)
        .order("upvotes", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  if (poolError) throw poolError;
  if (topError) throw topError;

  if (!pool) {
    return {
      currentBalance: 0,
      targetAmount: 299,
      totalCollected: 0,
      totalPaidOut: 0,
      lastPayoutAt: null,
      nextPayoutTokenId: topToken?.id ?? null,
    };
  }

  return mapFeesPoolRow(pool, topToken?.id ?? null);
}
