import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // This disables running ESLint during the build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
