import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
    },
    async rewrites() {
        const apiTarget = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";
        const uploadsTarget = process.env.UPLOADS_TARGET || "http://localhost:8089";
        return [
            {
                source: "/api/:path*",
                destination: `${apiTarget}/api/:path*`,
            },
            {
                source: "/uploads/:path*",
                destination: `${uploadsTarget}/uploads/:path*`,
            },
        ];
    },
};

export default nextConfig;
