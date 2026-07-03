import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dexscreener.com",
      },
      {
        protocol: "https",
        hostname: "dd.dexscreener.com",
      },
      {
        protocol: "https",
        hostname: "img.dexscreener.com",
      },
    ],
  },
};

export default nextConfig;
