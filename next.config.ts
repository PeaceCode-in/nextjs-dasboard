import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/dashboard',
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
