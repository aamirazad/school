/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.aamira.me",
        port: "",
        pathname: "/api/cdn/**",
      },
      {
        protocol: "http",
        hostname: "192.168.87.228",
        port: "50003",
        pathname: "/api/cdn/**",
      },
    ],
  },
};

export default nextConfig;
