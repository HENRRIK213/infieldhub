/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
};
module.exports = nextConfig;
