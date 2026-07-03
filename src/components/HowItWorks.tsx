"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./ui/SectionHeader";
import { BRAND } from "@/lib/brand";

const steps = [
  {
    step: "01",
    title: `Trade ${BRAND.ticker}`,
    description:
      "Every swap on Pump.fun generates creator fees. 100% flows into a transparent community pool — zero team cut.",
  },
  {
    step: "02",
    title: "List your token",
    description:
      "Submit a contract address. We pull name, image, market cap, and volume from DexScreener automatically.",
  },
  {
    step: "03",
    title: "Rally your community",
    description:
      "Holders upvote their pick. One vote per user. Tokens need $10K+ market cap to qualify for payouts.",
  },
  {
    step: "04",
    title: "Winner gets paid",
    description:
      "When the pool hits $299, the top-voted token receives a DexScreener social profile update — on us.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          label="Product"
          title="How it works"
          description="Four steps from trading to free DexScreener exposure. Fully on-chain fees, community-driven payouts."
          align="center"
          className="mb-16"
        />

        <div className="grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-zinc-950 p-6 transition-colors hover:bg-zinc-900/80 sm:p-7"
            >
              <p className="font-mono text-xs text-emerald-400/70">{item.step}</p>
              <h3 className="mt-4 text-[15px] font-semibold text-white">
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
