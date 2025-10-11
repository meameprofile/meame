// RUTA: next.config.mjs
/**
 * @file next.config.mjs
 * @description SSoT para la configuración del framework Next.js.
 *              v3.5.0 (Sovereign & Naturalized): Configuración de élite alineada
 *              con la arquitectura real del proyecto. Elimina la configuración de
 *              i18n (gestionada por middleware), el plugin de Webpack redundante y
 *              las claves obsoletas para una configuración limpia y resiliente.
 * @version 3.5.0
 * @author L.I.A. Legacy
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- [OPTIMIZACIONES GENERALES] ---
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  distDir: ".next",

  // --- [IMÁGENES Y ASSETS] ---
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "github.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // --- [SEGURIDAD Y HEADERS] ---
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://res.cloudinary.com https://images.unsplash.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://swfmranbroemudkryniq.supabase.co https://api.gemini.google.com https://*.google-analytics.com;",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // --- [SEO Y RUTAS] ---
  basePath: "",
  trailingSlash: false,

  // --- [EXPERIMENTAL FEATURES] ---
  experimental: {
    instrumentationHook: true,
    serverActions: { bodySizeLimit: "2mb" },
    taint: true,
    typedRoutes: true,
    webVitalsAttribution: ["FCP", "LCP", "CLS", "FID", "TTFB", "INP"],
    mdxRs: true,
  },

  // --- [OBSERVABILIDAD] ---
  logging: {
    fetches: { fullUrl: true },
  },

  // --- [CONFIGURACIÓN ADICIONAL] ---
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  generateEtags: true,

  // La función 'webpack' ha sido eliminada ya que Next.js gestiona
  // las variables de entorno 'NEXT_PUBLIC_*' automáticamente.
};

export default nextConfig;
