"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Crown,
  ExternalLink,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import type { TokenListing } from "@/types";
import { cn, formatUsd, truncateAddress } from "@/lib/utils";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

interface TokenCardProps {
  token: TokenListing;
  rank: number;
  onVote: (id: string) => void;
  isVoting: boolean;
  hasVoted: boolean;
}

export function TokenCard({
  token,
  rank,
  onVote,
  isVoting,
  hasVoted,
}: TokenCardProps) {
  const isPositive = token.priceChange24h >= 0;
  const isLeader = rank === 1 && token.qualified;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.04, duration: 0.3 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-[#0a0a0d] transition-all duration-300",
        isLeader
          ? "border-emerald-500/30 shadow-[inset_0_1px_0_rgba(52,211,153,0.12),0_0_48px_-12px_rgba(52,211,153,0.2)]"
          : "border-white/[0.07] hover:border-white/[0.14] hover:bg-zinc-900/40 hover:shadow-[0_8px_32px_-16px_rgba(0,0,0,0.6)]",
        !token.qualified && "opacity-60"
      )}
    >
      {isLeader && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
      )}

      <div className="flex items-center gap-4 p-4 sm:p-5">
        {/* Rank */}
        <div className="hidden w-8 shrink-0 text-center sm:block">
          {isLeader ? (
            <Crown className="mx-auto h-4 w-4 text-emerald-400 [filter:drop-shadow(0_0_8px_rgba(52,211,153,0.5))]" />
          ) : (
            <span className="font-mono text-sm text-zinc-600">
              {String(rank).padStart(2, "0")}
            </span>
          )}
        </div>

        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border bg-zinc-900",
              isLeader
                ? "border-emerald-500/30 shadow-[0_0_16px_-4px_rgba(52,211,153,0.4)]"
                : "border-white/[0.08]"
            )}
          >
            {token.imageUrl ? (
              <Image
                src={token.imageUrl}
                alt={token.name}
                width={44}
                height={44}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <span className="text-sm font-medium text-zinc-400">
                {token.symbol.slice(0, 2)}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-medium text-white">
              {token.name}
            </h3>
            <span className="shrink-0 font-mono text-xs text-zinc-500">
              ${token.symbol}
            </span>
            {isLeader && (
              <Badge variant="accent" className="hidden sm:inline-flex">
                Leading
              </Badge>
            )}
            {token.qualified ? (
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400/70" />
            ) : (
              <ShieldX className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
            )}
          </div>
          <p className="mt-0.5 font-mono text-[11px] text-zinc-600">
            {truncateAddress(token.contractAddress, 6)}
          </p>
        </div>

        {/* Stats — desktop */}
        <div className="hidden items-center gap-6 lg:flex">
          <div className="text-right">
            <p className="font-mono text-sm text-white">
              {formatUsd(token.marketCap)}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-zinc-600">
              MCap
            </p>
          </div>
          <div className="text-right">
            <p
              className={cn(
                "flex items-center justify-end gap-0.5 font-mono text-sm",
                isPositive ? "text-emerald-400" : "text-red-400"
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(token.priceChange24h).toFixed(1)}%
            </p>
            <p className="text-[10px] uppercase tracking-wider text-zinc-600">
              24h
            </p>
          </div>
          <div className="w-16 text-right">
            <p
              className={cn(
                "font-mono text-sm font-medium",
                isLeader
                  ? "text-emerald-400 [text-shadow:0_0_16px_rgba(52,211,153,0.35)]"
                  : "text-white"
              )}
            >
              {token.upvotes}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-zinc-600">
              Votes
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={token.dexscreenerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-zinc-500 transition-all duration-200 hover:border-white/[0.16] hover:bg-white/[0.05] hover:text-zinc-200"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <Button
            onClick={() => onVote(token.id)}
            disabled={isVoting || hasVoted || !token.qualified}
            variant={hasVoted ? "secondary" : "primary"}
            size="sm"
            className={cn(
              hasVoted && "text-emerald-400",
              !token.qualified && "opacity-40"
            )}
          >
            {hasVoted ? "Voted" : isVoting ? "..." : "Vote"}
          </Button>
        </div>
      </div>

      {/* Mobile stats row */}
      <div className="flex items-center gap-4 border-t border-white/[0.05] bg-white/[0.01] px-4 py-2.5 lg:hidden">
        <span className="font-mono text-xs text-zinc-500">
          MCap {formatUsd(token.marketCap)}
        </span>
        <span className="text-zinc-700">·</span>
        <span
          className={cn(
            "font-mono text-xs",
            isPositive ? "text-emerald-400" : "text-red-400"
          )}
        >
          {isPositive ? "+" : "-"}
          {Math.abs(token.priceChange24h).toFixed(1)}%
        </span>
        <span className="text-zinc-700">·</span>
        <span className="font-mono text-xs text-zinc-400">
          {token.upvotes} votes
        </span>
      </div>
    </motion.div>
  );
}
