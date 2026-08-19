/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Static export pour permettre un déploiement en HTML pur
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

module.exports = nextConfig;
