export const BRAND = {
  name: "The White Eagle",
  shortName: "White Eagle",
  ticker: "$EAGLE",
  tickerSymbol: "EAGLE",
  logo: "/eaglelogo.png",
  tagline: "Community-funded DexScreener updates for Solana tokens.",
} as const;

export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl" | "hero";

export const LOGO_SIZES: Record<
  LogoSize,
  { box: string; width: number; height: number; rounded: string }
> = {
  xs: { box: "h-7 w-7", width: 28, height: 28, rounded: "rounded-md" },
  sm: { box: "h-9 w-9", width: 36, height: 36, rounded: "rounded-lg" },
  md: { box: "h-12 w-12", width: 48, height: 48, rounded: "rounded-xl" },
  lg: { box: "h-16 w-16", width: 64, height: 64, rounded: "rounded-xl" },
  xl: { box: "h-24 w-24", width: 96, height: 96, rounded: "rounded-2xl" },
  hero: { box: "h-28 w-28 sm:h-32 sm:w-32", width: 128, height: 128, rounded: "rounded-2xl" },
};
