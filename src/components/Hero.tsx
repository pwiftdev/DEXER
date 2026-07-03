"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FeesPoolTracker } from "./FeesPoolTracker";
import { EagleLogo } from "./EagleLogo";
import { ButtonLink } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { BRAND } from "@/lib/brand";

const stats = [
  { value: "$299", label: "DexScreener update" },
  { value: "$10K+", label: "Min. market cap" },
  { value: "100%", label: "Fees to community" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-glow" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex justify-center"
          >
            <EagleLogo size="hero" glow priority />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <Badge variant="accent" className="mb-4">
              {BRAND.ticker} on Pump.fun
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]"
          >
            {BRAND.name}
            <br />
            <span className="text-zinc-500">funds DexScreener updates.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            {BRAND.ticker} creator fees pay for DexScreener social profiles — awarded to
            whichever token the community votes for. No more $299 out of pocket.
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
            className="mt-12 flex items-center justify-center gap-8 sm:gap-12"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-mono text-xl font-medium text-white sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
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
          <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-white/10 to-transparent" />
          <FeesPoolTracker />
        </motion.div>
      </div>
    </section>
  );
}
