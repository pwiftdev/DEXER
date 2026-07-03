import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.4),0_8px_24px_-8px_rgba(255,255,255,0.25)] hover:bg-zinc-100 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.4),0_8px_32px_-6px_rgba(255,255,255,0.35)]",
  secondary:
    "bg-zinc-900 text-zinc-100 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-zinc-800 hover:border-white/15",
  ghost: "text-zinc-400 hover:text-white hover:bg-white/5",
  outline:
    "border border-white/10 bg-white/[0.02] text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/20 hover:bg-white/[0.05] hover:text-white",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3.5 text-xs gap-1.5",
  md: "h-10 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-sm gap-2",
};

const base =
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}
