import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  generateEtags: false,
  poweredByHeader: false,
  output: 'export',
  distDir: '.next',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
