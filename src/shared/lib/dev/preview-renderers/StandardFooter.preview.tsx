// RUTA: src/shared/lib/dev/preview-renderers/StandardFooter.preview.tsx
/**
 * @file StandardFooter.preview.tsx
 * @description Renderizador de previsualización atómico, 100% tematizable y
 *              alineado con la arquitectura de renderizado soberana.
 * @version 4.1.0 (Code Hygiene)
 * @author RaZ Podestá - MetaShark Tech
 */
import * as React from "react";

import { getEdgeDictionary } from "@/shared/lib/i18n/i18n.edge";
import { logger } from "@/shared/lib/logging";

import type { PreviewRenderResult, PreviewRenderer } from "./_types";
import { getStyleFromTheme } from "./_utils";
// --- [INICIO DE REFACTORIZACIÓN DE HIGIENE] ---
// Se ha eliminado la importación no utilizada de 'AssembledTheme'.
// --- [FIN DE REFACTORIZACIÓN DE HIGIENE] ---

export const StandardFooterPreview: PreviewRenderer = async (
  locale,
  theme
): Promise<PreviewRenderResult | null> => {
  logger.trace(
    `[StandardFooter.preview] Renderizando para locale: ${locale} (v4.1)`
  );
  const { dictionary } = await getEdgeDictionary(locale);
  const content = dictionary.footer;

  if (!content) return null;

  const styles = getStyleFromTheme(theme);

  return {
    jsx: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          fontFamily: styles.fontFamily,
          backgroundColor: styles.mutedBackgroundColor,
          border: `1px solid ${styles.borderColor}`,
          borderRadius: "0.5rem",
          padding: "2rem",
          color: styles.color,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            borderBottom: `1px solid ${styles.borderColor}`,
            paddingBottom: "2rem",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", width: "33%" }}
          >
            <span style={{ fontWeight: 600 }}>{content.newsletter.title}</span>
            <span
              style={{
                fontSize: "0.75rem",
                color: styles.mutedForegroundColor,
                marginTop: "0.5rem",
              }}
            >
              {content.newsletter.description}
            </span>
            <div style={{ display: "flex", marginTop: "1rem" }}>
              <div
                style={{
                  flexGrow: 1,
                  backgroundColor: styles.backgroundColor,
                  height: "2rem",
                  borderTopLeftRadius: "0.375rem",
                  borderBottomLeftRadius: "0.375rem",
                  border: `1px solid ${styles.borderColor}`,
                }}
              />
              <div
                style={{
                  backgroundColor: styles.primaryColor,
                  color: styles.primaryForegroundColor,
                  height: "2rem",
                  padding: "0 1rem",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.75rem",
                  borderTopRightRadius: "0.375rem",
                  borderBottomRightRadius: "0.375rem",
                }}
              >
                {content.newsletter.buttonText}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {content.linkColumns.map((col) => (
              <div
                key={col.title}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <span style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                  {col.title}
                </span>
                {col.links.map((link) => (
                  <span
                    key={link.label}
                    style={{
                      fontSize: "0.75rem",
                      color: styles.mutedForegroundColor,
                    }}
                  >
                    {link.label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "1rem",
            fontSize: "0.75rem",
            color: styles.mutedForegroundColor,
          }}
        >
          <span>{content.copyright}</span>
          <div style={{ display: "flex", gap: "1rem" }}>
            {content.socialLinks.map((social) => (
              <div
                key={social.name}
                style={{
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "9999px",
                  backgroundColor: styles.backgroundColor,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    width: 1200,
    height: 250,
  };
};
// RUTA: src/shared/lib/dev/preview-renderers/StandardFooter.preview.tsx
