import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "muted";

const variants: Record<BadgeVariant, string> = {
  default: "bg-white/5 text-zinc-300 border-white/10",
  accent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  muted: "bg-zinc-800/50 text-zinc-500 border-white/5",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
