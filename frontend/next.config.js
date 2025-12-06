/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix workspace root detection
  output: 'standalone',
  // Turbopack configuration for Next.js 16
  turbopack: {
    root: process.cwd(),
  },
  typescript: {
    // Continue build even with TypeScript errors (optional)
    ignoreBuildErrors: false,
  },
  // Ensure proper CSS processing
  transpilePackages: [],
};

module.exports = nextConfig;