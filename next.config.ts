/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static1.squarespace.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'img-cdn.hltv.org',
      },
      {
        protocol: 'https',
        hostname: 'static.cdnlive.com.br',
      },
      {
        protocol: 'https',
        hostname: 'liquipedia.net',
      },
      {
        protocol: 'https',
        hostname: 'p.kindpng.com',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'ggscore.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

module.exports = nextConfig;
