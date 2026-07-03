-- The White Eagle — full schema (also in supabase/migrations/)
-- Run via: Supabase MCP apply_migration, or `npm run db:migrate` with DATABASE_URL

DROP TABLE IF EXISTS game_sessions CASCADE;
DROP TABLE IF EXISTS game_scores CASCADE;
DROP TABLE IF EXISTS presence CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS payouts CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS creator_fees_pool CASCADE;
DROP TABLE IF EXISTS tokens CASCADE;
DROP FUNCTION IF EXISTS set_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS upvote_token(UUID, TEXT) CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_address TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  image_url TEXT,
  market_cap NUMERIC NOT NULL DEFAULT 0,
  price_usd NUMERIC NOT NULL DEFAULT 0,
  price_change_24h NUMERIC NOT NULL DEFAULT 0,
  volume_24h NUMERIC NOT NULL DEFAULT 0,
  liquidity_usd NUMERIC NOT NULL DEFAULT 0,
  dexscreener_url TEXT NOT NULL,
  chain_id TEXT NOT NULL DEFAULT 'solana',
  upvotes INTEGER NOT NULL DEFAULT 0,
  qualified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tokens_upvotes ON tokens (upvotes DESC);
CREATE INDEX idx_tokens_qualified ON tokens (qualified) WHERE qualified = true;

CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_id UUID NOT NULL REFERENCES tokens(id) ON DELETE CASCADE,
  voter_fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (token_id, voter_fingerprint)
);

CREATE INDEX idx_votes_token_id ON votes (token_id);

CREATE TABLE creator_fees_pool (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  current_balance NUMERIC NOT NULL DEFAULT 127.5,
  target_amount NUMERIC NOT NULL DEFAULT 299,
  total_collected NUMERIC NOT NULL DEFAULT 127.5,
  total_paid_out NUMERIC NOT NULL DEFAULT 0,
  last_payout_at TIMESTAMPTZ,
  next_payout_token_id UUID REFERENCES tokens(id)
);

INSERT INTO creator_fees_pool (id) VALUES (1);

CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_id UUID NOT NULL REFERENCES tokens(id),
  amount NUMERIC NOT NULL,
  tx_signature TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER tokens_updated_at
  BEFORE UPDATE ON tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_fees_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY tokens_select ON tokens FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY tokens_insert ON tokens FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY tokens_update ON tokens FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY votes_select ON votes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY votes_insert ON votes FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY fees_pool_select ON creator_fees_pool FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY fees_pool_update ON creator_fees_pool FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY payouts_select ON payouts FOR SELECT TO anon, authenticated USING (true);

GRANT SELECT, INSERT, UPDATE ON tokens TO anon, authenticated;
GRANT SELECT, INSERT ON votes TO anon, authenticated;
GRANT SELECT, UPDATE ON creator_fees_pool TO anon, authenticated;
GRANT SELECT ON payouts TO anon, authenticated;
