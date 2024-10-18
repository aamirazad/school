/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.aamira.me",
        port: "",
      },
    ],
  },
};

export default nextConfig;
