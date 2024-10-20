/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"], // Add localhost to the allowed domains for images
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8085/api/:path*", // Your backend API URL
      },
      {
        source: "/api/auth/:provider",
        destination: "http://localhost:8085/api/auth/:provider", // Authentication endpoints
      },
    ];
  },
};

module.exports = nextConfig;
