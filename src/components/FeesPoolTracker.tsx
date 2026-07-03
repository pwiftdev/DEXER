"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CreatorFeesPool } from "@/types";
import { formatSol, formatUsd, DEXSCREENER_UPDATE_COST } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import { EagleLogo } from "./EagleLogo";
import { Badge } from "./ui/Badge";

const POLL_MS =
  Number(process.env.NEXT_PUBLIC_CREATOR_VAULT_POLL_MS) || 5_000;

export function FeesPoolTracker() {
  const [pool, setPool] = useState<CreatorFeesPool | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/fees", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setPool(data.data);
    } catch {
      /* keep last snapshot */
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, POLL_MS);
    return () => window.clearInterval(id);
  }, [refresh]);

  const balance = pool?.currentBalance ?? 0;
  const target = pool?.targetAmount ?? DEXSCREENER_UPDATE_COST;
  const progress = Math.min((balance / target) * 100, 100);
  const remaining = Math.max(target - balance, 0);
  const isLive = pool?.isLive ?? false;
  const vaultSol = pool?.creatorVaultSol;

  return (
    <div className="overflow-hidden rounded-2xl bg-[#0a0a0d] shadow-[0_32px_64px_-24px_rgba(0,0,0,0.7)]">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.015] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <EagleLogo size="xs" />
          <div className="flex gap-1.5 sm:hidden">
            <span className="h-2 w-2 rounded-full bg-zinc-700" />
            <span className="h-2 w-2 rounded-full bg-zinc-700" />
            <span className="h-2 w-2 rounded-full bg-zinc-700" />
          </div>
          <span className="font-mono text-[11px] text-zinc-500">
            {BRAND.tickerSymbol.toLowerCase()}-pool.live
          </span>
        </div>
        <Badge variant={isLive ? "accent" : "muted"} className="font-mono">
          {isLive && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
          )}
          {isLive ? "On-chain" : "Offline"}
        </Badge>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Creator fees pool
            </p>
            <p className="mt-1 font-mono text-3xl font-medium tracking-tight text-white sm:text-4xl">
              {formatUsd(balance)}
            </p>
            {isLive && vaultSol !== undefined && (
              <p className="mt-1 font-mono text-sm text-emerald-400/90">
                {formatSol(vaultSol)} unclaimed in vault
              </p>
            )}
            <p className="mt-1 text-sm text-zinc-500">
              {formatUsd(remaining)} until next payout
            </p>
            {pool?.creatorVaultError && (
              <p className="mt-1 text-xs text-amber-400/90">
                Vault sync issue — showing last known balance
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl font-medium text-emerald-400 [text-shadow:0_0_24px_rgba(52,211,153,0.35)]">
              {progress.toFixed(0)}%
            </p>
            <p className="text-xs text-zinc-500">of {formatUsd(target)}</p>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-800/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
          />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06]">
          {[
            {
              label: "In vault",
              value:
                isLive && vaultSol !== undefined
                  ? formatSol(vaultSol)
                  : formatUsd(pool?.totalCollected ?? 0),
            },
            { label: "Paid out", value: formatUsd(pool?.totalPaidOut ?? 0) },
            { label: "Update cost", value: formatUsd(target) },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0a0a0d] px-3 py-3">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                {stat.label}
              </p>
              <p className="mt-0.5 font-mono text-sm font-medium text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-500/[0.12] bg-emerald-500/[0.06] px-3.5 py-2.5">
          <p className="text-xs text-zinc-400">
            {isLive
              ? `Live Pump.fun creator vault — polled every ${POLL_MS / 1000}s`
              : `100% of ${BRAND.ticker} Pump.fun fees fund the next winner`}
          </p>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-emerald-400/60" />
        </div>
      </div>
    </div>
  );
}
