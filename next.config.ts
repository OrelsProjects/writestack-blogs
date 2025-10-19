import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["apps-og-images.s3.us-east-1.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apps-og-images.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
