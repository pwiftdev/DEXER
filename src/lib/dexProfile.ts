import type { DexScreenerProfile } from "@/types";

export const EMPTY_DEX_PROFILE: DexScreenerProfile = {
  coinImageUrl: "",
  bannerUrl: "",
  description: "",
  website: null,
  docs: null,
  twitter: null,
  telegram: null,
  discord: null,
  tiktok: null,
  instagram: null,
  extraLink: null,
};

export const SOCIAL_LINK_FIELDS = [
  { key: "website" as const, label: "Website", placeholder: "https://example.com" },
  { key: "docs" as const, label: "Docs", placeholder: "https://docs.example.com" },
  { key: "twitter" as const, label: "Twitter", placeholder: "https://x.com/handle" },
  { key: "telegram" as const, label: "Telegram", placeholder: "https://t.me/channel" },
  { key: "discord" as const, label: "Discord", placeholder: "https://discord.gg/invite" },
  { key: "tiktok" as const, label: "TikTok", placeholder: "https://tiktok.com/@handle" },
  { key: "instagram" as const, label: "Instagram", placeholder: "https://instagram.com/handle" },
  { key: "extraLink" as const, label: "Extra link", placeholder: "https://link.com" },
];
