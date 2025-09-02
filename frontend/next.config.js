/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Enable SWC minification
  swcMinify: true,
}

module.exports = nextConfig