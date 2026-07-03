"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  AtSign,
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  Globe,
  Instagram,
  Link2,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import type { DexScreenerProfile } from "@/types";
import type { TokenListing } from "@/types";
import { SOCIAL_LINK_FIELDS } from "@/lib/dexProfile";
import { cn, formatUsd, truncateAddress } from "@/lib/utils";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

const SOCIAL_ICONS: Record<keyof DexScreenerProfile, typeof Globe | null> = {
  coinImageUrl: null,
  bannerUrl: null,
  description: null,
  website: Globe,
  docs: BookOpen,
  twitter: AtSign,
  telegram: Send,
  discord: MessageCircle,
  tiktok: Link2,
  instagram: Instagram,
  extraLink: Link2,
};

function getSocialLinks(profile: DexScreenerProfile) {
  return SOCIAL_LINK_FIELDS.filter(({ key }) => profile[key]?.trim());
}

interface TokenProfileModalProps {
  token: TokenListing | null;
  onClose: () => void;
  onVote?: (id: string) => void;
  isVoting?: boolean;
  hasVoted?: boolean;
}

export function TokenProfileModal({
  token,
  onClose,
  onVote,
  isVoting,
  hasVoted,
}: TokenProfileModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    setCopied(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [token, onClose]);

  const profile = token?.profile;
  const isPositive = (token?.priceChange24h ?? 0) >= 0;
  const socialLinks = profile ? getSocialLinks(profile) : [];
  const coinImage = profile?.coinImageUrl ?? token?.imageUrl;

  const copyAddress = async () => {
    if (!token) return;
    await navigator.clipboard.writeText(token.contractAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {token && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-white/[0.08] bg-[#09090b] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.85)] sm:max-w-lg sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Banner — contained, no overlap with content below */}
            <div className="relative h-28 shrink-0 overflow-hidden bg-zinc-900 sm:h-32">
              {profile?.bannerUrl ? (
                <Image
                  src={profile.bannerUrl}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950" />
              )}

              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-zinc-300 backdrop-blur-md transition-colors hover:bg-black/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <div className="px-5 pb-5 pt-4">
                {/* Identity — fully below banner */}
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-lg ring-1 ring-white/5 sm:h-[4.5rem] sm:w-[4.5rem]">
                    {coinImage ? (
                      <Image
                        src={coinImage}
                        alt={token.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-lg font-semibold text-zinc-500">
                        {token.symbol.slice(0, 2)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <h2 className="text-xl font-semibold leading-tight tracking-tight text-white">
                      {token.name}
                    </h2>
                    <p className="mt-1 font-mono text-sm text-zinc-500">
                      ${token.symbol}
                    </p>
                    <div className="mt-2.5">
                      <Badge
                        variant={token.qualified ? "success" : "warning"}
                        className="text-[11px]"
                      >
                        {token.qualified
                          ? "Eligible to win payout"
                          : "Below $10K — can't win yet"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Stats strip */}
                <div className="mt-5 flex overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  {[
                    { label: "Market cap", value: formatUsd(token.marketCap) },
                    {
                      label: "24h change",
                      value: `${isPositive ? "+" : "-"}${Math.abs(token.priceChange24h).toFixed(1)}%`,
                      colored: isPositive ? "text-emerald-400" : "text-red-400",
                      showArrow: true,
                    },
                    { label: "Votes", value: String(token.upvotes) },
                  ].map((stat, i) => (
                    <div
                      key={stat.label}
                      className={cn(
                        "flex flex-1 flex-col px-3 py-3 sm:px-4",
                        i > 0 && "border-l border-white/[0.06]"
                      )}
                    >
                      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                        {stat.label}
                      </p>
                      <p
                        className={cn(
                          "mt-1 font-mono text-sm font-medium tabular-nums text-white",
                          stat.colored
                        )}
                      >
                        {stat.showArrow &&
                          (isPositive ? (
                            <ArrowUpRight className="mr-0.5 inline h-3.5 w-3.5" />
                          ) : (
                            <ArrowDownRight className="mr-0.5 inline h-3.5 w-3.5" />
                          ))}
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Contract */}
                <button
                  type="button"
                  onClick={copyAddress}
                  className="group mt-3 flex w-full items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-left transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]"
                >
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                    CA
                  </span>
                  <span className="min-w-0 flex-1 truncate font-mono text-xs text-zinc-400 group-hover:text-zinc-300">
                    {truncateAddress(token.contractAddress, 10)}
                  </span>
                  {copied ? (
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 shrink-0 text-zinc-600 group-hover:text-zinc-400" />
                  )}
                </button>

                {/* Description */}
                {profile?.description && (
                  <div className="mt-5">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                      About
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                      {profile.description}
                    </p>
                  </div>
                )}

                {/* Social — compact chips */}
                {socialLinks.length > 0 && (
                  <div className="mt-5">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                      Links
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {socialLinks.map(({ key, label }) => {
                        const Icon = SOCIAL_ICONS[key] ?? Link2;
                        const href = profile![key]!;
                        return (
                          <a
                            key={key}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-zinc-300 transition-all hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white"
                          >
                            <Icon className="h-3.5 w-3.5 text-zinc-500" />
                            {label}
                            <ExternalLink className="h-3 w-3 text-zinc-600" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 gap-2 border-t border-white/[0.06] bg-[#09090b]/95 p-4 backdrop-blur-sm">
              <a
                href={token.dexscreenerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm font-medium text-zinc-300 transition-colors hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                Chart
              </a>
              {onVote && (
                <Button
                  onClick={() => onVote(token.id)}
                  disabled={isVoting || hasVoted}
                  variant={hasVoted ? "secondary" : "primary"}
                  size="md"
                  className={cn("h-11 flex-1 rounded-xl", hasVoted && "text-emerald-400")}
                >
                  {hasVoted ? "Voted ✓" : isVoting ? "Voting…" : "Vote"}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
