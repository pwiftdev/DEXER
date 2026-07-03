import type { DexScreenerProfile } from "@/types";

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateOptionalUrl(
  value: string | null | undefined,
  field: string
): string | null {
  if (!value?.trim()) return null;
  if (!isValidUrl(value.trim())) {
    return `${field} must be a valid URL`;
  }
  return null;
}

export function validateDexProfile(
  profile: Partial<DexScreenerProfile>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!profile.coinImageUrl?.trim()) {
    errors.coinImageUrl = "Upload a coin image";
  } else if (!isValidUrl(profile.coinImageUrl.trim())) {
    errors.coinImageUrl = "Coin image upload is invalid";
  }

  if (!profile.bannerUrl?.trim()) {
    errors.bannerUrl = "Upload a banner image";
  } else if (!isValidUrl(profile.bannerUrl.trim())) {
    errors.bannerUrl = "Banner upload is invalid";
  }

  if (!profile.description?.trim()) {
    errors.description = "Description is required";
  } else if (profile.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters";
  }

  for (const { key, label } of [
    { key: "website" as const, label: "Website" },
    { key: "docs" as const, label: "Docs" },
    { key: "twitter" as const, label: "Twitter" },
    { key: "telegram" as const, label: "Telegram" },
    { key: "discord" as const, label: "Discord" },
    { key: "tiktok" as const, label: "TikTok" },
    { key: "instagram" as const, label: "Instagram" },
    { key: "extraLink" as const, label: "Extra link" },
  ]) {
    const err = validateOptionalUrl(profile[key], label);
    if (err) errors[key] = err;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function normalizeDexProfile(
  profile: Partial<DexScreenerProfile>
): DexScreenerProfile {
  const trim = (v: string | null | undefined) => v?.trim() || null;
  return {
    coinImageUrl: profile.coinImageUrl!.trim(),
    bannerUrl: profile.bannerUrl!.trim(),
    description: profile.description!.trim(),
    website: trim(profile.website),
    docs: trim(profile.docs),
    twitter: trim(profile.twitter),
    telegram: trim(profile.telegram),
    discord: trim(profile.discord),
    tiktok: trim(profile.tiktok),
    instagram: trim(profile.instagram),
    extraLink: trim(profile.extraLink),
  };
}
