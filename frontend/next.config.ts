import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backend = process.env.BACKEND_URL;
    return backend
      ? [{ source: "/backend/:path*", destination: `${backend}/:path*` }]
      : [];
  },
};

export default nextConfig;
