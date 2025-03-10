import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: false,  // Adicionando esta linha para desabilitar o React Strict Mode
  async rewrites() {
    return [
      {
        source: "/api/:path*",  // Todas as requisições para /api/* serão redirecionadas
        destination: "http://localhost:3001/:path*",  // Para o Flask
      },
    ];
  },
};

export default nextConfig;