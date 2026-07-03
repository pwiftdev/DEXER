"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FeesPoolTracker } from "./FeesPoolTracker";
import { ButtonLink } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { BRAND } from "@/lib/brand";

const stats = [
  { value: "$299", label: "DexScreener update" },
  { value: "$10K+", label: "To win payout" },
  { value: "100%", label: "Fees to community" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Layered atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-glow" />
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="pointer-events-none absolute inset-0 bg-noise" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[720px] -translate-x-1/2 animate-float-slow rounded-full bg-emerald-500/[0.05] blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-4 flex justify-center"
          >
            {/* Pulsing emerald bloom */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-64 w-64 animate-glow-pulse rounded-full bg-emerald-500/25 blur-[70px] sm:h-80 sm:w-80" />
            </div>

            {/* Orbital rings */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-[300px] w-[300px] rounded-full border border-emerald-400/[0.12] sm:h-[380px] sm:w-[380px]" />
            </div>
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative h-[380px] w-[380px] animate-spin-slow rounded-full border border-dashed border-white/[0.08] sm:h-[480px] sm:w-[480px]">
                <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_12px_2px_rgba(52,211,153,0.6)]" />
              </div>
            </div>
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative h-[460px] w-[460px] animate-spin-slow-reverse rounded-full border border-white/[0.05] sm:h-[580px] sm:w-[580px]">
                <span className="absolute bottom-[12%] right-[12%] h-1 w-1 rounded-full bg-teal-300 shadow-[0_0_10px_2px_rgba(45,212,191,0.5)]" />
              </div>
            </div>

            {/* The eagle */}
            <div className="animate-float-slow relative">
              <Image
                src="/eagle.png"
                alt={BRAND.name}
                width={260}
                height={260}
                priority
                className="h-48 w-48 object-contain [filter:drop-shadow(0_0_32px_rgba(52,211,153,0.35))_drop-shadow(0_0_80px_rgba(52,211,153,0.18))_drop-shadow(0_24px_40px_rgba(0,0,0,0.6))] sm:h-60 sm:w-60"
              />
              {/* Eye-level glint line */}
              <div className="pointer-events-none absolute left-1/2 top-[42%] h-px w-[140%] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <Badge variant="accent" className="mb-5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {BRAND.ticker} on Pump.fun
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]"
          >
            <span className="text-gradient">{BRAND.name}</span>
            <br />
            <span className="text-zinc-500">
              funds <span className="text-gradient-accent">DexScreener</span>{" "}
              updates.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            {BRAND.ticker} creator fees pay for DexScreener social profiles —
            awarded to whichever token the community votes for. No more $299
            out of pocket.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <ButtonLink href="#apply" variant="primary" size="lg">
              List your token
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="#how-it-works" variant="outline" size="lg">
              See how it works
            </ButtonLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mx-auto mt-14 flex max-w-lg items-center justify-center divide-x divide-white/[0.08]"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex-1 px-4 text-center sm:px-8">
                <p className="font-mono text-xl font-medium text-white sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] text-zinc-500 sm:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative mx-auto mt-16 max-w-lg"
        >
          <div className="pointer-events-none absolute -inset-10 rounded-[32px] bg-emerald-500/[0.06] blur-3xl" />
          <div className="border-beam relative">
            <FeesPoolTracker />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
