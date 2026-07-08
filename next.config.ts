/** @type {import('next').NextConfig} */

const securityHeaders = [
    {
        key: "X-DNS-Prefetch-Control",
        value: "on",
    },
    {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
    },
    {
        key: "X-Content-Type-Options",
        value: "nosniff",
    },
    {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
    }
];

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const nextConfig = {
    devIndicators: false,
    reactStrictMode: false,
    images: {
        formats: ["image/webp", "image/avif"],
        minimumCacheTTL: 31536000,
        dangerouslyAllowSVG: false,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    compress: true,
    poweredByHeader: false,
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: securityHeaders,
            },
            {
                source: "/img/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                ],
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${API_BASE_URL}/api/:path*`,
            },
        ];
    },
    modularizeImports: {
        lodash: {
            transform: "lodash/{{member}}",
        },
        "date-fns": {
            transform: "date-fns/{{member}}",
        },
    },
    productionBrowserSourceMaps: false,
    output: "standalone",
};

export default nextConfig;
