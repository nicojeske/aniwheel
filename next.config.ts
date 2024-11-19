import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "s4.anilist.co",
                port: '',
            }
        ]
    },
    eslint: {
        ignoreDuringBuilds: true // FIXME: Remove this line
    },
    typescript: {
        ignoreBuildErrors: true // FIXME: Remove this line
    },
    output: "standalone"
};

export default nextConfig;
