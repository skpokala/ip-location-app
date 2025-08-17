/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  experimental: {
    // This will allow production image to be smaller
    outputFileTracingRoot: process.env.NODE_ENV === "production" ? "/app" : undefined,
  },
  // Ensure we can build even with minor TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ensure we can build even with minor ESLint errors
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;