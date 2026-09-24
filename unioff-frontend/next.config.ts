import type { NextConfig } from "next";

// O backend Spring não tem CORS configurado, então o Next faz proxy de /api
// para ele. Assim o navegador só conversa com a origem do frontend.
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
