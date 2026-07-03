"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import type { TokenListing } from "@/types";
import { formatUsd, isValidSolanaAddress, MIN_MARKET_CAP } from "@/lib/utils";
import { EagleLogo } from "./EagleLogo";
import { SectionHeader } from "./ui/SectionHeader";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

type PreviewData = Omit<
  TokenListing,
  "id" | "upvotes" | "createdAt" | "updatedAt"
>;

export function ApplyForm() {
  const [address, setAddress] = useState("");
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<TokenListing | null>(null);

  const handlePreview = async () => {
    setError(null);
    setPreview(null);
    setSuccess(null);

    if (!isValidSolanaAddress(address)) {
      setError("Enter a valid Solana contract address");
      return;
    }

    setPreviewLoading(true);
    try {
      const res = await fetch(
        `/api/tokens/preview?address=${encodeURIComponent(address.trim())}`
      );
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Token not found");
        return;
      }
      setPreview(data.data);
    } catch {
      setError("Failed to fetch token data");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!preview) return;
    setSubmitLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractAddress: address.trim() }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Failed to list token");
        return;
      }
      setSuccess(data.data);
      setPreview(null);
      setAddress("");
    } catch {
      setError("Failed to list token");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && address.trim()) handlePreview();
  };

  return (
    <section id="apply" className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="section-divider mb-20 sm:mb-16" />

        <div className="mx-auto max-w-xl">
          <SectionHeader
            label="Apply"
            title="List your token"
            description="Paste your contract address. We fetch everything from DexScreener and add you to the leaderboard."
            align="center"
            className="mb-10"
          />

          <div className="glass-card relative rounded-2xl p-6 sm:p-8">
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[32px] bg-emerald-500/[0.04] blur-2xl" />
            {success ? (
              <div className="py-4 text-center">
                <div className="mx-auto flex justify-center">
                  <EagleLogo size="md" glow />
                </div>
                <h3 className="mt-4 text-lg font-medium text-white">
                  {success.name} is live
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Share with your community and start collecting votes.
                </p>
                <Button
                  onClick={() => setSuccess(null)}
                  variant="ghost"
                  size="sm"
                  className="mt-6 text-emerald-400"
                >
                  List another token
                </Button>
              </div>
            ) : (
              <>
                <label
                  htmlFor="ca-input"
                  className="block text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Contract address
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="ca-input"
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setPreview(null);
                      setError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Solana mint address..."
                    className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-zinc-900/80 px-4 py-2.5 font-mono text-sm text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] transition-all duration-200 placeholder:text-zinc-600 focus:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
                  />
                  <Button
                    onClick={handlePreview}
                    disabled={previewLoading || !address.trim()}
                    variant="secondary"
                  >
                    {previewLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Fetch"
                    )}
                  </Button>
                </div>

                <p className="mt-3 text-xs text-zinc-600">
                  Requires {formatUsd(MIN_MARKET_CAP)}+ market cap to qualify
                  for payouts
                </p>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3.5 py-2.5 text-sm text-red-400"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {preview && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-6 rounded-xl border border-white/[0.08] bg-zinc-900/50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-900">
                          {preview.imageUrl ? (
                            <Image
                              src={preview.imageUrl}
                              alt={preview.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <span className="text-sm font-medium text-zinc-400">
                              {preview.symbol.slice(0, 2)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="truncate font-medium text-white">
                              {preview.name}
                            </h4>
                            <Badge
                              variant={preview.qualified ? "success" : "muted"}
                            >
                              {preview.qualified ? "Qualified" : "Unqualified"}
                            </Badge>
                          </div>
                          <p className="mt-0.5 font-mono text-xs text-zinc-500">
                            ${preview.symbol} · MCap{" "}
                            {formatUsd(preview.marketCap)}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={handleSubmit}
                        disabled={submitLoading}
                        variant="primary"
                        size="md"
                        className="mt-4 w-full"
                      >
                        {submitLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Submit to leaderboard
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
