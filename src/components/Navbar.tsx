"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { ButtonLink } from "./ui/Button";
import { cn } from "@/lib/utils";

const links = [
  { href: "#how-it-works", label: "Product" },
  { href: "#leaderboard", label: "Leaderboard" },
  { href: "#apply", label: "Apply" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav
          className={cn(
            "mt-4 flex h-14 items-center justify-between rounded-2xl border px-4 backdrop-blur-xl transition-all duration-300 sm:px-5",
            scrolled
              ? "border-white/[0.1] bg-zinc-950/80 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]"
              : "border-white/[0.06] bg-zinc-950/50"
          )}
        >
          <Logo />

          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3.5 py-1.5 text-[13px] font-medium text-zinc-400 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ButtonLink
              href="#leaderboard"
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
            >
              View votes
            </ButtonLink>
            <ButtonLink href="#apply" variant="primary" size="sm">
              List token
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
