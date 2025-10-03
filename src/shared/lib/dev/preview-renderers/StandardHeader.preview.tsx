// RUTA: src/shared/lib/dev/preview-renderers/StandardHeader.preview.tsx
/**
 * @file StandardHeader.preview.tsx
 * @description Renderizador de previsualización atómico, purificado y desacoplado
 *              para el componente StandardHeader. Consume la SSoT de estilos para
 *              un theming completo y se alinea con el contrato de datos v7.1.0.
 * @version 4.1.0 (API Contract Alignment)
 *@author RaZ Podestá - MetaShark Tech
 */
import * as React from "react";
import type { PreviewRenderResult, PreviewRenderer } from "./_types";
import { getEdgeDictionary } from "@/shared/lib/i18n/i18n.edge";
import { logger } from "@/shared/lib/logging";
import { getStyleFromTheme } from "./_utils";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";

export const StandardHeaderPreview: PreviewRenderer = async (
  locale,
  theme: AssembledTheme
): Promise<PreviewRenderResult | null> => {
  // Pilar III (Observabilidad)
  logger.trace(
    `[StandardHeader.preview] Renderizando para locale: ${locale} (v4.1)`
  );
  const { dictionary } = await getEdgeDictionary(locale);
  // Pilar I (i18n): Guardia de resiliencia
  const content = dictionary.header;
  if (!content) return null;

  // Pilar II (Theming): Consume la SSoT de transformación de estilos
  const styles = getStyleFromTheme(theme);

  return {
    jsx: (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 2rem",
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
          {content.logoAlt}
        </span>
        <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem" }}>
          {content.navLinks.map((link) => (
            <span key={link.label}>{link.label}</span>
          ))}
        </div>
        <div
          style={{
            backgroundColor: styles.primaryColor,
            color: styles.primaryForegroundColor,
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          {content.signUpButton.label}
        </div>
      </div>
    ),
    width: 1200,
    height: 84,
  };
};
