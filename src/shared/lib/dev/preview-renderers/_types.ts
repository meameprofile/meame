// lib/dev/preview-renderers/_types.ts
/**
 * @file _types.ts
 * @description SSoT para el contrato de tipo de los renderizadores atómicos.
 *              v3.2.0: Se restaura la firma original, desacoplando los
 *              renderizadores de la lógica de inyección de fuentes.
 * @version 3.2.0
 * @author RaZ Podestá - MetaShark Tech
 */
import type { ReactElement } from "react";

import type { Locale } from "@/shared/lib/i18n/i18n.config";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";

export interface PreviewRenderResult {
  jsx: ReactElement;
  width: number;
  height: number;
}

// Se elimina `fontData` de la firma. Los renderizadores atómicos ya no necesitan conocerla.
export type PreviewRenderer = (
  locale: Locale,
  theme: AssembledTheme
) => Promise<PreviewRenderResult | null>;
