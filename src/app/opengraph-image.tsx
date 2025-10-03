// RUTA: app/opengraph-image.tsx
/**
 * @file opengraph-image.tsx
 * @description SSoT para la generación de imágenes Open Graph (og:image) por defecto.
 *              Este aparato se ejecuta en el Edge Runtime para generar dinámicamente
 *              una imagen de vista previa social para las páginas del portal.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { ImageResponse } from "next/og";
import { logger } from "@/shared/lib/logging";

export const runtime = "edge";
export const alt = "Global Fitwell - El Futuro del Bienestar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  logger.trace("[opengraph-image] Generando imagen OG por defecto.");

  // NOTA: La carga de fuentes en el Edge Runtime es compleja.
  // Por ahora, usamos fuentes por defecto, pero se podría expandir.

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "hsl(224, 71%, 4%)", // bg-background-dark
          color: "hsl(210, 40%, 98%)", // text-foreground-dark
          fontFamily: '"Inter", sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: 700,
            letterSpacing: "-0.05em",
          }}
        >
          Global Fitwell
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 30,
            color: "hsl(215, 20%, 65%)", // text-muted-foreground-dark
          }}
        >
          El Futuro del Bienestar. Tecnología y Ciencia para tu Potencial.
        </div>
      </div>
    ),
    { ...size }
  );
}
