import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Media lives on Cloudinary — see src/lib/media.ts. next/image rejects any
    // remote host that is not listed here.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/yvflssro/**",
      },
    ],
  },
};

export default nextConfig;
