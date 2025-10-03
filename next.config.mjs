// RUTA: next.config.mjs
/**
 * @file next.config.mjs
 * @description SSoT para la configuración del framework Next.js.
 *              v2.0.0 (Cloudinary Integration): Se añade el dominio de Cloudinary
 *              a los remotePatterns para permitir la optimización de imágenes
 *              desde la BAVI, resolviendo un error crítico de ejecución.
 * @version 2.0.0
 *@author RaZ Podestá - MetaShark Tech
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // --- [INICIO DE REFACTORIZACIÓN DE CONFIGURACIÓN] ---
      // Se añade el hostname de Cloudinary como un patrón remoto permitido.
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // --- [FIN DE REFACTORIZACIÓN DE CONFIGURACIÓN] ---
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
};

export default nextConfig;
