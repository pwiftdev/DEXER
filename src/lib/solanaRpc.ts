export async function solanaRpc<T>(
  rpcUrl: string,
  method: string,
  params: unknown[] = []
): Promise<T> {
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`RPC HTTP ${res.status}`);
  }

  const json = (await res.json()) as {
    result?: T;
    error?: { message?: string };
  };

  if (json.error) {
    throw new Error(json.error.message ?? "RPC error");
  }

  return json.result as T;
}
