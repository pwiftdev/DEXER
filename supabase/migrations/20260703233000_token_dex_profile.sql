-- Add DexScreener social profile fields to tokens
-- Run in Supabase SQL Editor if not yet applied

ALTER TABLE tokens ADD COLUMN IF NOT EXISTS profile_coin_image TEXT;
ALTER TABLE tokens ADD COLUMN IF NOT EXISTS profile_banner TEXT;
ALTER TABLE tokens ADD COLUMN IF NOT EXISTS profile_description TEXT;
ALTER TABLE tokens ADD COLUMN IF NOT EXISTS profile_website TEXT;
ALTER TABLE tokens ADD COLUMN IF NOT EXISTS profile_docs TEXT;
ALTER TABLE tokens ADD COLUMN IF NOT EXISTS profile_twitter TEXT;
ALTER TABLE tokens ADD COLUMN IF NOT EXISTS profile_telegram TEXT;
ALTER TABLE tokens ADD COLUMN IF NOT EXISTS profile_discord TEXT;
ALTER TABLE tokens ADD COLUMN IF NOT EXISTS profile_tiktok TEXT;
ALTER TABLE tokens ADD COLUMN IF NOT EXISTS profile_instagram TEXT;
ALTER TABLE tokens ADD COLUMN IF NOT EXISTS profile_extra_link TEXT;
