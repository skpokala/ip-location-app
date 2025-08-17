/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    // We run type checking in GitHub Actions
    ignoreBuildErrors: true,
  },
  eslint: {
    // We run linting in GitHub Actions
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;