import Image from "next/image";
import { cn } from "@/lib/utils";
import { BRAND, LOGO_SIZES, type LogoSize } from "@/lib/brand";

interface EagleLogoProps {
  size?: LogoSize;
  className?: string;
  glow?: boolean;
  priority?: boolean;
}

export function EagleLogo({
  size = "sm",
  className,
  glow = false,
  priority = false,
}: EagleLogoProps) {
  const config = LOGO_SIZES[size];

  return (
    <div className={cn("relative shrink-0", config.box, className)}>
      {glow && (
        <div className="absolute -inset-3 rounded-full bg-emerald-500/15 blur-2xl" />
      )}
      <Image
        src={BRAND.logo}
        alt={BRAND.name}
        width={config.width}
        height={config.height}
        priority={priority}
        className={cn(
          "relative h-full w-full object-contain",
          config.rounded,
          size !== "xs" && "ring-1 ring-white/10"
        )}
      />
    </div>
  );
}
