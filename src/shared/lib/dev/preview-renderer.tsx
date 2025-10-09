// RUTA: src/shared/lib/dev/preview-renderer.tsx
/**
 * @file preview-renderer.tsx
 * @description Motor de renderizado soberano para las vistas previas de componentes.
 *              v4.4.0 (Absolute Type Safety): Implementa una conversión explícita
 *              de Buffer a ArrayBuffer para la carga de fuentes, erradicando la
 *              ambigüedad de tipo 'ArrayBufferLike' y garantizando la seguridad
 *              de tipos absoluta en todos los entornos.
 * @version 4.4.0
 * @author L.I.A. Legacy
 */
import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { ImageResponse } from "@vercel/og";
import { previewRenderers } from "@/shared/lib/dev/preview-renderers";
import { defaultLocale } from "@/shared/lib/i18n/i18n.config";
import { deepMerge } from "@/shared/lib/utils";
import { loadJsonAsset } from "@/shared/lib/i18n/campaign.data.loader";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { AssembledThemeSchema } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { logger } from "@/shared/lib/logging";
import { ErrorPreview } from "@/components/features/dev-tools/ErrorPreview";
import type { PreviewRenderResult } from "./preview-renderers/_types";
import React from "react";

type FontData = {
  name: string;
  data: ArrayBuffer;
  weight: 400;
  style: "normal";
};

let themeCache: AssembledTheme | null = null;
let fontCache: FontData | null = null;

async function getCachedDefaultTheme(): Promise<AssembledTheme> {
  if (themeCache) {
    logger.trace("[PreviewRenderer] Sirviendo tema por defecto desde caché.");
    return themeCache;
  }
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
    themeCache = AssembledThemeSchema.parse(finalTheme);
    logger.info("[PreviewRenderer] Tema por defecto ensamblado y cacheado.");
    return themeCache;
  } catch (error) {
    logger.error(
      "[PreviewRenderer] No se pudo ensamblar el tema por defecto.",
      { error }
    );
    return AssembledThemeSchema.parse({});
  }
}

async function getCachedFontData(): Promise<FontData | null> {
  if (fontCache) {
    logger.trace("[PreviewRenderer] Sirviendo datos de fuente desde caché.");
    return fontCache;
  }
  try {
    const fontPath = path.join(
      process.cwd(),
      "node_modules/next/dist/compiled/@vercel/og/noto-sans-v27-latin-regular.ttf"
    );
    const fontFileBuffer = await fs.readFile(fontPath);

    // --- [INICIO DE REFACTORIZACIÓN DE RESILIENCIA v4.4.0] ---
    // Se convierte explícitamente el Buffer de Node.js a un ArrayBuffer,
    // que es el tipo que la API de ImageResponse espera de forma universal.
    // Esto elimina la ambigüedad y resuelve el error de URL inválida en Windows.
    const fontArrayBuffer = new Uint8Array(fontFileBuffer)
      .buffer as ArrayBuffer;
    // --- [FIN DE REFACTORIZACIÓN DE RESILIENCIA v4.4.0] ---

    fontCache = {
      name: "Noto Sans",
      data: fontArrayBuffer, // Ahora es un ArrayBuffer garantizado.
      weight: 400,
      style: "normal",
    };
    logger.info("[PreviewRenderer] Datos de fuente cargados y cacheados.");
    return fontCache;
  } catch (error) {
    logger.error(
      "[PreviewRenderer] Fallo crítico al cargar la fuente de fallback.",
      { error }
    );
    return null;
  }
}

export async function renderPreviewComponent(
  componentName: string
): Promise<ImageResponse> {
  const traceId = logger.startTrace(`renderPreviewComponent:${componentName}`);
  const groupId = logger.startGroup(
    `[PreviewRenderer] Orquestando renderizado para: ${componentName}`
  );

  try {
    const renderer = previewRenderers[componentName];
    if (!renderer) {
      throw new Error(`No se encontró un renderizador para: ${componentName}`);
    }

    const [theme, fontData] = await Promise.all([
      getCachedDefaultTheme(),
      getCachedFontData(),
    ]);
    logger.traceEvent(traceId, "Recursos de tema y fuente obtenidos.");

    const renderResult: PreviewRenderResult | null = await renderer(
      defaultLocale,
      theme
    );

    if (!renderResult) {
      throw new Error(`El renderizador para '${componentName}' devolvió null.`);
    }

    const { jsx, width, height } = renderResult;

    return new ImageResponse(jsx, {
      width,
      height,
      fonts: fontData ? [fontData] : [],
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      `[PreviewRenderer] Fallo crítico al orquestar la previsualización de ${componentName}.`,
      { error: errorMessage, traceId }
    );
    return new ImageResponse(<ErrorPreview componentName={componentName} />, {
      width: 600,
      height: 338,
      status: 500,
    });
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
