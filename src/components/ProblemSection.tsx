"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./ui/SectionHeader";

export function ProblemSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="section-divider mb-20 sm:mb-28" />

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeader
            label="The problem"
            title="DexScreener updates shouldn't cost devs $299 every time."
            description="Social profile updates on DexScreener are essential for visibility — but at $299 per update, small projects bleed cash. We've collectively paid DexScreener millions. The White Eagle redirects that spend back to the community."
          />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card relative rounded-2xl p-6 sm:p-8"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/[0.07] blur-3xl" />

            <div className="relative space-y-4">
              {[
                {
                  label: "Traditional path",
                  value: "$299",
                  sub: "Paid by dev, every update",
                  muted: true,
                },
                {
                  label: "White Eagle path",
                  value: "$0",
                  sub: "Funded by community trading fees",
                  muted: false,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between rounded-xl border px-4 py-4 transition-colors duration-300 ${
                    row.muted
                      ? "border-white/[0.05] bg-zinc-900/30"
                      : "border-emerald-500/25 bg-emerald-500/[0.05] shadow-[inset_0_1px_0_rgba(52,211,153,0.1),0_0_32px_-8px_rgba(52,211,153,0.15)]"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      {row.label}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">{row.sub}</p>
                  </div>
                  <p
                    className={`font-mono text-2xl font-medium ${
                      row.muted
                        ? "text-zinc-500 line-through"
                        : "text-emerald-400 [text-shadow:0_0_24px_rgba(52,211,153,0.35)]"
                    }`}
                  >
                    {row.value}
                  </p>
                </div>
              ))}
            </div>

            <p className="relative mt-6 text-sm leading-relaxed text-zinc-500">
              Strong communities earn free exposure. Weak ones don&apos;t
              qualify. The system is meritocratic by design.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
