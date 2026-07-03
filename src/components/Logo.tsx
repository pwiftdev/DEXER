import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import { EagleLogo } from "./EagleLogo";

interface LogoProps {
  className?: string;
  showText?: boolean;
  compact?: boolean;
}

export function Logo({ className, showText = true, compact = false }: LogoProps) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)}>
      <EagleLogo size="sm" className="transition-transform group-hover:scale-[1.03]" />
      {showText && (
        <div className="leading-tight">
          <span className="block text-[15px] font-semibold tracking-tight text-white">
            {compact ? BRAND.shortName : BRAND.name}
          </span>
          {!compact && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/80">
              {BRAND.ticker}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
