/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com', 
      'avatars.githubusercontent.com', 
      'localhost',
      'picsum.photos'
    ],
  },
};

module.exports = nextConfig;
