import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // This project lives inside a parent repo that also has a lockfile; pin the
  // workspace root so Turbopack/Next doesn't infer the wrong directory.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
