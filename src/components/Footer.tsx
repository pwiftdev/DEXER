import { Logo } from "./Logo";
import { BRAND } from "@/lib/brand";

const links = [
  { href: "#how-it-works", label: "Product" },
  { href: "#leaderboard", label: "Leaderboard" },
  { href: "#apply", label: "Apply" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p className="font-mono text-xs text-zinc-700">
            Solana · DexScreener · Pump.fun
          </p>
        </div>
      </div>
    </footer>
  );
}
