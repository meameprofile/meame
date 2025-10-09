// RUTA: src/shared/lib/dev/preview-renderers/StandardHeader.preview.tsx
/**
 * @file StandardHeader.preview.tsx
 * @description Renderizador de previsualización atómico, puro y desacoplado.
 *              v5.1.0 (Architectural Purity Restoration): Este componente ahora
 *              solo se preocupa por generar el JSX y sus dimensiones, delegando
 *              la creación de ImageResponse al orquestador.
 * @version 5.1.0
 * @author L.I.A. Legacy
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
  logger.trace(
    `[StandardHeader.preview] Renderizando para locale: ${locale} (v5.1)`
  );
  const { dictionary } = await getEdgeDictionary(locale);
  const content = dictionary.header;
  if (!content) return null;

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
  // --- [FIN DE RESTAURACIÓN DE CONTRATO] ---
};
