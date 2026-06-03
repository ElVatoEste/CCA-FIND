import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Railway Object Storage / S3 — ajustar host real en S3_ENDPOINT
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
