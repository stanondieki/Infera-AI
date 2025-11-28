import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds to avoid warnings spam
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Continue build even with TypeScript errors (optional)
    ignoreBuildErrors: false,
  },
  webpack: (config, { isServer }) => {
    // Optimize CSS processing
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          styles: {
            name: 'styles',
            test: /\.(css|scss|sass|less)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }

    return config;
  },
  // Ensure proper CSS processing
  transpilePackages: [],
};

export default nextConfig;
