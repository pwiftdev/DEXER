"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import type { DexScreenerProfile } from "@/types";
import { EMPTY_DEX_PROFILE, SOCIAL_LINK_FIELDS } from "@/lib/dexProfile";
import { validateDexProfile } from "@/lib/validateProfile";
import { ImageUploadField } from "./ImageUploadField";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";

interface DexProfileFormProps {
  tokenName: string;
  tokenSymbol: string;
  defaultCoinImage?: string | null;
  payoutEligible?: boolean;
  onBack: () => void;
  onSubmit: (profile: DexScreenerProfile) => void;
  isSubmitting: boolean;
}

const inputClass =
  "w-full rounded-lg border border-white/[0.08] bg-zinc-900/80 px-3.5 py-2.5 text-sm text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] transition-all placeholder:text-zinc-600 focus:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/15";

export function DexProfileForm({
  tokenName,
  tokenSymbol,
  defaultCoinImage,
  payoutEligible = true,
  onBack,
  onSubmit,
  isSubmitting,
}: DexProfileFormProps) {
  const [profile, setProfile] = useState<DexScreenerProfile>({
    ...EMPTY_DEX_PROFILE,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof DexScreenerProfile>(
    key: K,
    value: DexScreenerProfile[K]
  ) => {
    setProfile((p) => ({ ...p, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = () => {
    const result = validateDexProfile(profile);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    onSubmit(profile);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400/80">
            Step 2 of 2
          </p>
          <h3 className="mt-1 text-lg font-medium text-white">
            DexScreener profile
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            {tokenName} (${tokenSymbol}) — info used when we pay for your update
          </p>
          {!payoutEligible && (
            <p className="mt-2 text-xs text-zinc-500">
              Your token will appear on the leaderboard. Payout eligibility
              unlocks at $10K+ market cap.
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <ImageUploadField
        kind="coin"
        label="Coin image"
        hint="1:1 · min 100px wide · max 5 MB"
        value={profile.coinImageUrl}
        fallbackPreview={defaultCoinImage}
        onChange={(url) => update("coinImageUrl", url)}
        error={errors.coinImageUrl}
      />

      <ImageUploadField
        kind="banner"
        label="Banner"
        hint="3:1 · min 600px wide · max 10 MB"
        value={profile.bannerUrl}
        onChange={(url) => update("bannerUrl", url)}
        error={errors.bannerUrl}
      />

      {/* Description */}
      <section className="rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4">
        <label className="text-sm font-medium text-zinc-300">Description</label>
        <textarea
          value={profile.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Add coin description"
          rows={4}
          className={cn(
            inputClass,
            "mt-3 resize-none",
            errors.description && "border-red-500/40"
          )}
        />
        {errors.description && (
          <p className="mt-2 text-xs text-red-400">{errors.description}</p>
        )}
      </section>

      {/* Social links */}
      <section className="rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4">
        <p className="text-sm font-medium text-zinc-300">Social links</p>
        <p className="mt-1 text-xs text-zinc-600">Optional — add any that apply</p>
        <div className="mt-4 space-y-3">
          {SOCIAL_LINK_FIELDS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="mb-1.5 block text-xs text-zinc-500">{label}</label>
              <input
                type="url"
                value={profile[key] ?? ""}
                onChange={(e) =>
                  update(key, e.target.value.trim() || null)
                }
                placeholder={placeholder}
                className={cn(inputClass, errors[key] && "border-red-500/40")}
              />
              {errors[key] && (
                <p className="mt-1 text-xs text-red-400">{errors[key]}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        variant="primary"
        size="md"
        className="w-full"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Submit to leaderboard
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
