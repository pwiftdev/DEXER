# The White Eagle

**Community-funded DexScreener updates for Solana tokens.**

$DEX launches on Pump.fun. 100% of creator fees (when the pool reaches $299) pay for a DexScreener social update for whichever token the community votes for most.

## Quick Start

```bash
npm install
cp .env.example .env.local   # already configured if .env.local exists
npm run db:migrate           # requires DATABASE_URL — see Supabase Setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## DexScreener Integration

Token previews and listings fetch data from:

```
GET https://api.dexscreener.com/tokens/v1/solana/{contractAddress}
```

The API returns an array of pairs; we pick the highest-liquidity pair and map it to a token card.

## Supabase Setup

This project uses **Supabase** for persistent storage (tokens, votes, fees pool).

### Environment variables (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://ontajayxgjpvhxahvncj.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

### Apply database schema

**Option A — Supabase MCP (recommended in Cursor)**

Ensure the Supabase MCP server is enabled for this workspace (`~/.cursor/mcp.json` → project `ontajayxgjpvhxahvncj`), then run `apply_migration` with `supabase/migrations/20260703220000_white_eagle_cleanup_and_schema.sql`.

This migration drops leftover tables from the previous project (`profiles`, `game_scores`, etc.) and creates The White Eagle schema.

**Option B — CLI script**

Add your Postgres connection string from Supabase Dashboard → Settings → Database:

```bash
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres" npm run db:migrate
```

**Option C — SQL Editor**

Paste and run `supabase/schema.sql` in the Supabase SQL Editor.

### Client helpers

| File | Purpose |
|---|---|
| `src/utils/supabase/client.ts` | Browser client |
| `src/utils/supabase/server.ts` | Server Components / Route Handlers |
| `src/utils/supabase/middleware.ts` | Session refresh |
| `src/middleware.ts` | Next.js middleware |
| `src/lib/db/` | Tokens, votes, fees pool queries |

## API Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/tokens` | List all tokens (sorted by upvotes) |
| `POST` | `/api/tokens` | List a new token `{ contractAddress }` |
| `GET` | `/api/tokens/preview?address=` | Preview token from DexScreener |
| `POST` | `/api/tokens/[id]/vote` | Upvote a token |
| `GET` | `/api/fees` | Get creator fees pool status |

## Project Structure

```
src/
├── app/api/              # API routes (Supabase-backed)
├── lib/db/               # Database access layer
├── utils/supabase/       # Supabase SSR clients
└── middleware.ts         # Auth session refresh
supabase/
├── migrations/           # Versioned SQL migrations
└── schema.sql            # Full schema reference
```

## Next Steps

- [ ] Track real $DEX creator fees from Pump.fun
- [ ] Wallet connect for vote verification (optional)
- [ ] Admin panel for processing DexScreener payouts
- [ ] Add $DEX Pump.fun link once launched
