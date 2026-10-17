/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  devIndicators: false,
  outputFileTracingRoot: path.join(__dirname, './'),
};

module.exports = nextConfig;
