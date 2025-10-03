// shared/lib/dev/preview-renderers/MinimalHeader.preview.tsx
/**
 * @file MinimalHeader.preview.tsx
 * @description Renderizador de previsualización atómico, ahora purificado y
 *              desacoplado de la lógica de theming. Cumple con los 7 Pilares de
 *              Calidad en el contexto de un renderizador de servidor.
 * @version 3.0.0 (Decoupled & Pure)
 * @author RaZ Podestá - MetaShark Tech
 */
import * as React from "react";
import type { PreviewRenderResult, PreviewRenderer } from "./_types";
import { logger } from "@/shared/lib/logging";
import { getStyleFromTheme } from "./_utils";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";

export const MinimalHeaderPreview: PreviewRenderer = async (
  locale,
  theme: AssembledTheme
): Promise<PreviewRenderResult | null> => {
  logger.trace(
    `[MinimalHeader.preview] Renderizando para locale: ${locale} (v3.0)`
  );

  // El componente ahora solo invoca a la SSoT de transformación.
  const styles = getStyleFromTheme(theme);

  return {
    jsx: (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "1rem",
          // Todas las propiedades de estilo ahora provienen del objeto 'styles'.
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          fontFamily: styles.fontFamily,
          border: `1px solid ${styles.borderColor}`,
          borderRadius: "0.5rem",
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            fontSize: "1.125rem",
            color: styles.primaryColor,
          }}
        >
          GlobalFitwell
        </span>
      </div>
    ),
    width: 1200,
    height: 84, // Altura estándar para consistencia con otros headers.
  };
};
// shared/lib/dev/preview-renderers/MinimalHeader.preview.tsx
