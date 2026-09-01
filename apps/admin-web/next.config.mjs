/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",

        hostname:
          "d2tj9t0sgr1peg.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;