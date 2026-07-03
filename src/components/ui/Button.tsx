import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-zinc-950 hover:bg-zinc-100 shadow-sm shadow-white/10",
  secondary:
    "bg-zinc-900 text-zinc-100 border border-white/10 hover:bg-zinc-800 hover:border-white/15",
  ghost: "text-zinc-400 hover:text-white hover:bg-white/5",
  outline:
    "border border-white/10 text-zinc-200 hover:border-white/20 hover:bg-white/[0.03]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3.5 text-xs gap-1.5",
  md: "h-10 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-sm gap-2",
};

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
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
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
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </Link>
  );
}
