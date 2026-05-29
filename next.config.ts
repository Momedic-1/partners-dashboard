import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Avoid unstable dev overlay on Windows when cache gets out of sync
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
