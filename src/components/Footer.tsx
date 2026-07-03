import { Logo } from "./Logo";
import { BRAND } from "@/lib/brand";

const links = [
  { href: "#how-it-works", label: "Product" },
  { href: "#leaderboard", label: "Leaderboard" },
  { href: "#apply", label: "Apply" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[640px] -translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-500/[0.04] blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-600">
              {BRAND.tagline} Powered by {BRAND.ticker} creator fees on
              Pump.fun.
            </p>
          </div>

          <div className="flex gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-500 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <p className="font-mono text-xs text-zinc-600">
              Solana · DexScreener · Pump.fun
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
