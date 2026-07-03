const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd";

let cachedPrice: number | null = null;
let cacheExpiry = 0;

export async function fetchSolPriceUsd(): Promise<number | null> {
  const now = Date.now();
  const cacheMs = Number(process.env.SOL_PRICE_CACHE_MS) || 60_000;

  if (cachedPrice !== null && now < cacheExpiry) {
    return cachedPrice;
  }

  try {
    const res = await fetch(COINGECKO_URL, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return cachedPrice;

    const data = (await res.json()) as { solana?: { usd?: number } };
    const price = data.solana?.usd;
    if (typeof price !== "number" || !Number.isFinite(price)) {
      return cachedPrice;
    }

    cachedPrice = price;
    cacheExpiry = now + cacheMs;
    return price;
  } catch {
    return cachedPrice;
  }
}
