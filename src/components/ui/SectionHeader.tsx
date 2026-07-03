"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        align === "center" && "text-center mx-auto max-w-2xl",
        className
      )}
    >
      {label && (
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-emerald-400/80">
          {label}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-zinc-400",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
