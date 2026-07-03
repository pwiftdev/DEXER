import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "muted";

const variants: Record<BadgeVariant, string> = {
  default:
    "bg-white/5 text-zinc-300 border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
  accent:
    "bg-emerald-500/10 text-emerald-300 border-emerald-500/25 shadow-[inset_0_1px_0_rgba(52,211,153,0.15),0_0_16px_-4px_rgba(52,211,153,0.25)]",
  success:
    "bg-emerald-500/10 text-emerald-300 border-emerald-500/25 shadow-[inset_0_1px_0_rgba(52,211,153,0.15)]",
  warning:
    "bg-amber-500/10 text-amber-300 border-amber-500/25 shadow-[inset_0_1px_0_rgba(251,191,36,0.15)]",
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
