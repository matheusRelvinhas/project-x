/** @type {import('next').NextConfig} */

const securityHeaders = [
    {
        key: "Content-Security-Policy",
        value: `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval'
                https://accounts.google.com
                https://apis.google.com
                https://www.gstatic.com
                https://static.cloudflareinsights.com
                https://www.googletagmanager.com
                https://www.google-analytics.com;
            style-src 'self' 'unsafe-inline'
                https://accounts.google.com;
            img-src 'self' data: https:;
            font-src 'self' data: https:;
            frame-src
                https://accounts.google.com;
            connect-src 'self'
                https://accounts.google.com
                https://www.gstatic.com
                https://api.redondo.fun
                https://www.google-analytics.com;
            base-uri 'self' https://accounts.google.com;
        `.replace(/\n/g, ""),
    },
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
    },
    {
        key: "X-XSS-Protection",
        value: "1; mode=block",
    },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const nextConfig = {
    devIndicators: false,
    reactStrictMode: false,
    images: {
        formats: ["image/webp", "image/avif"],
        minimumCacheTTL: 86400,
        dangerouslyAllowSVG: false,
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: securityHeaders,
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
