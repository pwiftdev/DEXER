"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./ui/SectionHeader";

export function ProblemSection() {
  return (
    <section className="py-20 sm:py-28">
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
            className="rounded-xl border border-white/[0.08] bg-zinc-950 p-6 sm:p-8"
          >
            <div className="space-y-4">
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
                  className={`flex items-center justify-between rounded-lg border px-4 py-4 ${
                    row.muted
                      ? "border-white/[0.05] bg-zinc-900/30"
                      : "border-emerald-500/20 bg-emerald-500/[0.04]"
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
                      row.muted ? "text-zinc-500 line-through" : "text-emerald-400"
                    }`}
                  >
                    {row.value}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-zinc-500">
              Strong communities earn free exposure. Weak ones don&apos;t qualify.
              The system is meritocratic by design.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
