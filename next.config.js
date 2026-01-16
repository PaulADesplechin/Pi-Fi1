/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Output standalone pour meilleure compatibilité Render
  output: 'standalone',
  // Images
  images: {
    domains: ['assets.coingecko.com', 'logo.clearbit.com'],
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
    ],
  },
  // Headers pour sécurité
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ];
  },
  // Configuration TypeScript et ESLint
  typescript: {
    // Ne pas ignorer les erreurs, mais permettre le build avec warnings
    ignoreBuildErrors: false,
  },
  eslint: {
    // Ne pas ignorer ESLint, mais permettre le build avec warnings
    ignoreDuringBuilds: false,
  },
  // Optimisations de build
  compress: true,
  poweredByHeader: false,
  // Configuration pour le build de production
  productionBrowserSourceMaps: false,
  // Optimisation des images
  optimizeFonts: true,
};

module.exports = nextConfig;
