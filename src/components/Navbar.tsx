import { Logo } from "./Logo";
import { ButtonLink } from "./ui/Button";

const links = [
  { href: "#how-it-works", label: "Product" },
  { href: "#leaderboard", label: "Leaderboard" },
  { href: "#apply", label: "Apply" },
];

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav className="mt-4 flex h-14 items-center justify-between rounded-xl border border-white/[0.08] bg-zinc-950/70 px-4 backdrop-blur-xl sm:px-5">
          <Logo />

          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3.5 py-1.5 text-[13px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
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
