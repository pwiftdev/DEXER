import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${BRAND.name} — Community-Funded DexScreener Updates`,
  description: `${BRAND.ticker} creator fees pay for DexScreener social updates. List your token, rally your community, win free exposure.`,
  keywords: [
    "White Eagle",
    "DEX",
    "Solana",
    "DexScreener",
    "Pump.fun",
    "memecoin",
    "community",
  ],
  icons: {
    icon: BRAND.logo,
    apple: BRAND.logo,
  },
  openGraph: {
    title: `${BRAND.name} — Community-Funded DexScreener Updates`,
    description: `Strong communities win free DexScreener updates. Powered by ${BRAND.ticker} creator fees.`,
    type: "website",
    images: [BRAND.logo],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
