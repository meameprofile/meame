// lib/dev/preview-renderers/_types.ts
/**
 * @file _types.ts
 * @description SSoT para el contrato de tipo de los renderizadores atómicos.
 *              v3.0.0: Añade el objeto de tema ensamblado para theming.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import type { ReactElement } from "react";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";

export type PreviewRenderResult = {
  jsx: ReactElement;
  width: number;
  height: number;
};

export type PreviewRenderer = (
  locale: Locale,
  theme: AssembledTheme
) => Promise<PreviewRenderResult | null>;
// lib/dev/preview-renderers/_types.ts
