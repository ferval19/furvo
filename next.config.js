/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media-2.api-sports.io",
      },
      {
        protocol: "https",
        hostname: "media-3.api-sports.io",
      },
      {
        protocol: "https",
        hostname: "media-1.api-sports.io",
      },
      {
        protocol: "https",
        hostname: "media-4.api-sports.io",
      },
    ],
  },
}

module.exports = nextConfig
