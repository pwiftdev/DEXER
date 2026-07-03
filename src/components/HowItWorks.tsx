"use client";

import { motion } from "framer-motion";
import { Coins, ListPlus, Megaphone, Trophy } from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";
import { BRAND } from "@/lib/brand";

const steps = [
  {
    step: "01",
    icon: Coins,
    title: `Trade ${BRAND.ticker}`,
    description:
      "Every swap on Pump.fun generates creator fees. 100% flows into a transparent community pool — zero team cut.",
  },
  {
    step: "02",
    icon: ListPlus,
    title: "List your token",
    description:
      "Submit a contract address — any market cap. We pull name, image, market cap, and volume from DexScreener automatically.",
  },
  {
    step: "03",
    icon: Megaphone,
    title: "Rally your community",
    description:
      "Holders upvote their pick. One vote per user. Only $10K+ tokens can win the payout — but anyone can list and vote.",
  },
  {
    step: "04",
    icon: Trophy,
    title: "Winner gets paid",
    description:
      "When the pool hits $299, the top-voted token receives a DexScreener social profile update — on us.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[400px] -translate-y-1/2 bg-lines opacity-60 [mask-image:radial-gradient(ellipse_60%_100%_at_50%_50%,black,transparent)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          label="Product"
          title="How it works"
          description="Four steps from trading to free DexScreener exposure. Fully on-chain fees, community-driven payouts."
          align="center"
          className="mb-16"
        />

        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)] sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative bg-[#0a0a0d] p-6 transition-colors duration-300 hover:bg-zinc-900/70 sm:p-7"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition-colors duration-300 group-hover:border-emerald-500/25 group-hover:text-emerald-400">
                  <item.icon className="h-4 w-4" />
                </div>
                <p className="font-mono text-xs text-emerald-400/60 transition-colors duration-300 group-hover:text-emerald-400">
                  {item.step}
                </p>
              </div>
              <h3 className="mt-5 text-[15px] font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
