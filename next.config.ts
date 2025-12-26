import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images:{
        domains: [
            'res.cloudinary.com',
            'via.placeholder.com',
            'travel.rakuten.com'
        ]
    }
  /* config options here */
};

export default nextConfig;
