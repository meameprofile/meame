// RUTA: src/shared/lib/dev/preview-renderers/BenefitsSection.preview.tsx
/**
 * @file BenefitsSection.preview.tsx
 * @description Renderizador de previsualización atómico, purificado y desacoplado,
 *              ahora con soporte completo para theming de fuentes y colores.
 *              Cumple con los 7 Pilares de Calidad para renderizadores de servidor.
 * @version 4.0.0 (Font Theming Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import * as React from "react";

import { getEdgeDictionary } from "@/shared/lib/i18n/i18n.edge";
import { logger } from "@/shared/lib/logging";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";

import type { PreviewRenderResult, PreviewRenderer } from "./_types";
import { getStyleFromTheme } from "./_utils";

export const BenefitsSectionPreview: PreviewRenderer = async (
  locale,
  theme: AssembledTheme
): Promise<PreviewRenderResult | null> => {
  // Pilar III (Observabilidad)
  logger.trace(
    `[BenefitsSection.preview] Renderizando para locale: ${locale} (v4.0)`
  );
  const { dictionary } = await getEdgeDictionary(locale);
  // Pilar I (i18n): Guardia de Resiliencia
  const content = dictionary.benefitsSection;
  if (!content) return null;

  // Pilar II (Theming): Consume la SSoT de estilos
  const styles = getStyleFromTheme(theme);

  return {
    jsx: (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          padding: "2rem",
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          fontFamily: styles.fontFamily,
          border: `1px solid ${styles.borderColor}`,
          borderRadius: "0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            paddingRight: "2rem",
          }}
        >
          <span
            style={{
              fontSize: "0.875rem",
              color: styles.primaryColor,
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            {content.eyebrow}
          </span>
          <span
            style={{
              fontSize: "2.25rem",
              fontWeight: 700,
              marginTop: "0.5rem",
            }}
          >
            {content.title}
          </span>
          <span
            style={{
              fontSize: "1.125rem",
              color: styles.mutedForegroundColor,
              marginTop: "1rem",
            }}
          >
            {content.subtitle}
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
            width: "50%",
          }}
        >
          {content.benefits.map((benefit) => (
            <div
              key={benefit.title}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "1rem",
                backgroundColor: styles.mutedBackgroundColor,
                borderRadius: "0.375rem",
                border: `1px solid ${styles.borderColor}`,
              }}
            >
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "9999px",
                  backgroundColor: styles.primaryColor,
                  marginBottom: "0.75rem",
                }}
              />
              <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                {benefit.title}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: styles.mutedForegroundColor,
                  marginTop: "0.25rem",
                }}
              >
                {benefit.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    width: 1200,
    height: 675,
  };
};
