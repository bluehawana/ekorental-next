/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8085',
        pathname: '/uploads/**',
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/cars/:path*',
        destination: 'http://localhost:8085/api/cars/:path*',
        basePath: false,
      },
      {
        source: '/api/bookings/:path*',
        destination: 'http://localhost:8085/api/bookings/:path*',
        basePath: false,
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:8085/uploads/:path*',
        basePath: false,
      },
    ];
  },
};

module.exports = nextConfig;
