/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    reactStrictMode: false,
    images: {
        formats: ["image/webp", "image/avif"],
        minimumCacheTTL: 86400,
        domains: ["localhost", "yourcdn.com"],
        dangerouslyAllowSVG: false,
    },
    // 🔐 Cabeçalhos de segurança e cache (descomentados se necessário)
    // async headers() {
    //     return [
    //         {
    //             source: "/(.*)",
    //             headers: [
    //                 { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=86400' },
    //                 { key: "X-DNS-Prefetch-Control", value: "on" },
    //                 { key: "X-Content-Type-Options", value: "nosniff" },
    //                 { key: "X-Frame-Options", value: "SAMEORIGIN" },
    //                 {
    //                   key: "Referrer-Policy",
    //                   value: "strict-origin-when-cross-origin",
    //                 },
    //                 {
    //                   key: "Permissions-Policy",
    //                   value: "camera=(), microphone=(), geolocation=()",
    //                 },
    //             ],
    //         },
    //     ];
    // },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:3001/:path*",
            },
        ];
    },
    experimental: {
        optimizeCss: true,
        turbo: {
            rules: {
                "*.ts,*.tsx": ["babel-loader"],
            }
        }
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