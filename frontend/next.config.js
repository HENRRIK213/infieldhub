const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  outputFileTracingRoot: path.join(__dirname, '../'),
};
module.exports = nextConfig;