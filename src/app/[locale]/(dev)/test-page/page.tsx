// RUTA: src/app/[locale]/(dev)/test-page/page.tsx
/**
 * @file page.tsx
 * @description Página de marcador de posición (placeholder) para la reconstrucción fundamental.
 * @version 1.0.0 (Reconstrucción)
 *@author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";

export default function PlaceholderPage() {
  const routePath = "/(dev)/test-page";
  logger.info(`[Placeholder] Renderizando página para: ${routePath}`);

  return (
    <div
      style={{
        padding: "4rem",
        textAlign: "center",
        fontFamily: "monospace",
        border: "2px dashed #333",
        margin: "2rem",
        color: "#ccc",
        background: "#111",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#0f0" }}>
        ✅ Ruta Navegable
      </h1>
      <p style={{ marginTop: "1rem", color: "#888" }}>Ruta: {routePath}</p>
      <p style={{ marginTop: "0.5rem", color: "#666" }}>
        Esta es una página de marcador de posición. El contenido real será
        ensamblado en la siguiente fase.
      </p>
    </div>
  );
}
