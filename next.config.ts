import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
    future: { webpack5: true },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      config.resolve.alias.canvas = false
      config.resolve.alias.encoding = false
      return config
  }
};

export default nextConfig;
