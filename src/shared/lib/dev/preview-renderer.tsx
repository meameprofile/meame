// RUTA: src/shared/lib/dev/preview-renderer.tsx
/**
 * @file preview-renderer.tsx
 * @description Motor de renderizado soberano para las vistas previas de componentes.
 *              v3.0.0 (Sovereign Path Restoration): Se corrige la ruta de importación
 *              de ErrorPreview para alinearse con la ACS, restaurando la
 *              integridad del build de la API de previsualización.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { previewRenderers } from "@/shared/lib/dev/preview-renderers";
import { defaultLocale } from "@/shared/lib/i18n/i18n.config";
import { deepMerge } from "@/shared/lib/utils";
import { loadJsonAsset } from "@/shared/lib/i18n/campaign.data.loader";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { AssembledThemeSchema } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { logger } from "@/shared/lib/logging";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
import { ErrorPreview } from "@/components/features/dev-tools/ErrorPreview";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

async function assembleDefaultTheme(): Promise<AssembledTheme> {
  try {
    const [base, colors, fonts, radii] = await Promise.all([
      loadJsonAsset<Partial<AssembledTheme>>(
        "theme-fragments",
        "base",
        "global.theme.json"
      ),
      loadJsonAsset<Partial<AssembledTheme>>(
        "theme-fragments",
        "colors",
        "razstore-minimalist.colors.json"
      ),
      loadJsonAsset<Partial<AssembledTheme>>(
        "theme-fragments",
        "fonts",
        "razstore-minimalist.fonts.json"
      ),
      loadJsonAsset<Partial<AssembledTheme>>(
        "theme-fragments",
        "radii",
        "razstore-minimalist.radii.json"
      ),
    ]);
    const finalTheme = deepMerge(
      deepMerge(deepMerge(base, colors), fonts),
      radii
    );
    return AssembledThemeSchema.parse(finalTheme);
  } catch (error) {
    logger.error(
      "[PreviewRenderer] No se pudo ensamblar el tema por defecto.",
      {
        error,
      }
    );
    return AssembledThemeSchema.parse({});
  }
}

export async function renderPreviewComponent(componentName: string) {
  const renderer = previewRenderers[componentName];
  if (!renderer) {
    logger.warn(
      `[PreviewRenderer] No se encontró un renderizador para: ${componentName}`
    );
    return {
      jsx: <ErrorPreview componentName={componentName} />,
      width: 600,
      height: 338,
    };
  }
  const theme = await assembleDefaultTheme();
  return renderer(defaultLocale, theme);
}
// RUTA: src/shared/lib/dev/preview-renderer.tsx
