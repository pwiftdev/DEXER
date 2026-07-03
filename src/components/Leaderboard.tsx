"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import type { TokenListing } from "@/types";
import { TokenCard } from "./TokenCard";
import { TokenProfileModal } from "./TokenProfileModal";
import { EagleLogo } from "./EagleLogo";
import { getVoterFingerprint } from "@/hooks/useVoterFingerprint";
import { SectionHeader } from "./ui/SectionHeader";
import { Button } from "./ui/Button";

const VOTED_KEY = "eagle-voted-tokens";

export function Leaderboard() {
  const [tokens, setTokens] = useState<TokenListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [selectedToken, setSelectedToken] = useState<TokenListing | null>(null);

  const fetchTokens = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tokens");
      const data = await res.json();
      if (data.success) setTokens(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
    const stored = localStorage.getItem(VOTED_KEY);
    if (stored) {
      try {
        setVotedIds(new Set(JSON.parse(stored)));
      } catch {
        /* ignore */
      }
    }
  }, [fetchTokens]);

  const handleVote = async (tokenId: string) => {
    setVotingId(tokenId);
    try {
      const res = await fetch(`/api/tokens/${tokenId}/vote`, {
        method: "POST",
        headers: { "x-voter-fingerprint": getVoterFingerprint() },
      });
      const data = await res.json();
      if (data.success) {
        setTokens((prev) =>
          prev
            .map((t) => (t.id === tokenId ? data.data : t))
            .sort((a, b) => b.upvotes - a.upvotes)
        );
        setSelectedToken((prev) =>
          prev?.id === tokenId ? data.data : prev
        );
        const next = new Set(votedIds).add(tokenId);
        setVotedIds(next);
        localStorage.setItem(VOTED_KEY, JSON.stringify([...next]));
      }
    } finally {
      setVotingId(null);
    }
  };

  const payoutLeaderId =
    tokens.find((t) => t.qualified)?.id ?? null;

  return (
    <section id="leaderboard" className="py-20 sm:py-28">
      <TokenProfileModal
        token={selectedToken}
        onClose={() => setSelectedToken(null)}
        onVote={handleVote}
        isVoting={selectedToken ? votingId === selectedToken.id : false}
        hasVoted={selectedToken ? votedIds.has(selectedToken.id) : false}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="section-divider mb-20 sm:mb-16" />

        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            label="Leaderboard"
            title="Community votes"
            description="Any token can list and collect votes. Only tokens with $10K+ market cap can win the next DexScreener payout when the fees pool reaches $299."
          />
          <Button
            onClick={fetchTokens}
            disabled={loading}
            variant="outline"
            size="sm"
            className="shrink-0 self-start"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Table header — desktop */}
        {!loading && tokens.length > 0 && (
          <div className="mb-2 hidden px-5 lg:grid lg:grid-cols-[32px_44px_1fr_80px_64px_64px_auto] lg:items-center lg:gap-4">
            <span />
            <span />
            <span className="text-[10px] uppercase tracking-wider text-zinc-600">
              Token
            </span>
            <span className="text-right text-[10px] uppercase tracking-wider text-zinc-600">
              Market cap
            </span>
            <span className="text-right text-[10px] uppercase tracking-wider text-zinc-600">
              24h
            </span>
            <span className="text-right text-[10px] uppercase tracking-wider text-zinc-600">
              Votes
            </span>
            <span className="w-[88px]" />
          </div>
        )}

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[72px] animate-shimmer rounded-2xl border border-white/[0.05]"
              />
            ))}
          </div>
        ) : tokens.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.01] py-20 text-center">
            <div className="mx-auto mb-4 flex justify-center opacity-60">
              <EagleLogo size="lg" />
            </div>
            <p className="text-sm text-zinc-400">No tokens listed yet.</p>
            <p className="mt-1 text-xs text-zinc-600">
              Be the first to submit your contract address below.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {tokens.map((token, i) => (
              <TokenCard
                key={token.id}
                token={token}
                rank={i + 1}
                isPayoutLeader={token.id === payoutLeaderId}
                onVote={handleVote}
                onSelect={setSelectedToken}
                isVoting={votingId === token.id}
                hasVoted={votedIds.has(token.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
