import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { version as pyodideVersion } from "pyodide";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    PYODIDE_VERSION: pyodideVersion,
  },
};

export default nextConfig;
