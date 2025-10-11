// RUTA: src/shared/lib/actions/campaign-suite/getThemeFragments.action.ts
/**
 * @file getThemeFragments.action.ts
 * @description Server Action para descubrir y cargar fragmentos de tema.
 * @version 3.0.0 (Sovereign Type Contracts)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { promises as fs } from "fs";
import path from "path";

import { netTracePrefixToPathMap } from "@/shared/lib/config/theming.config";
import { loadJsonAsset } from "@/shared/lib/i18n/campaign.data.loader";
import { logger } from "@/shared/lib/logging";
import type {
  DiscoveredFragments,
  LoadedFragments,
} from "@/shared/lib/schemas/theme-fragments/theme-fragments.contracts";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import type { ActionResult } from "@/shared/lib/types/actions.types";

export async function getThemeFragmentsAction(): Promise<
  ActionResult<DiscoveredFragments>
> {
  logger.info("[Action] Descubriendo fragmentos de tema disponibles...");
  const results: DiscoveredFragments = { colors: [], fonts: [], radii: [] };
  try {
    for (const prefix in netTracePrefixToPathMap) {
      const categoryDir =
        netTracePrefixToPathMap[prefix as keyof typeof netTracePrefixToPathMap];
      const fullPath = path.join(
        process.cwd(),
        "content",
        "theme-fragments",
        categoryDir
      );
      const files = await fs.readdir(fullPath);
      const fragmentNames = files
        .filter((file) => file.endsWith(`.${categoryDir}.json`))
        .map((file) => file.replace(`.${categoryDir}.json`, ""));
      if (categoryDir in results) {
        results[categoryDir as keyof DiscoveredFragments] = fragmentNames;
      }
    }
    return { success: true, data: results };
  } catch {
    return {
      success: false,
      error: "No se pudieron cargar las opciones de tema.",
    };
  }
}

export async function loadAllThemeFragmentsAction(): Promise<
  ActionResult<LoadedFragments>
> {
  const traceId = logger.startTrace("loadAllThemeFragmentsAction_v3.0");
  try {
    const discoveryResult = await getThemeFragmentsAction();
    if (!discoveryResult.success) throw new Error(discoveryResult.error);

    const fragments = discoveryResult.data;
    const [base, colors, fonts, radii] = await Promise.all([
      loadJsonAsset<Partial<AssembledTheme>>(
        "theme-fragments",
        "base",
        "global.theme.json"
      ),
      Promise.all(
        fragments.colors.map((name) =>
          loadJsonAsset<Partial<AssembledTheme>>(
            "theme-fragments",
            "colors",
            `${name}.colors.json`
          ).then((data) => ({ name, data }))
        )
      ),
      Promise.all(
        fragments.fonts.map((name) =>
          loadJsonAsset<Partial<AssembledTheme>>(
            "theme-fragments",
            "fonts",
            `${name}.fonts.json`
          ).then((data) => ({ name, data }))
        )
      ),
      Promise.all(
        fragments.radii.map((name) =>
          loadJsonAsset<Partial<AssembledTheme>>(
            "theme-fragments",
            "radii",
            `${name}.radii.json`
          ).then((data) => ({ name, data }))
        )
      ),
    ]);

    const loadedFragments: LoadedFragments = {
      base,
      colors: Object.fromEntries(colors.map((c) => [c.name, c.data])),
      fonts: Object.fromEntries(fonts.map((f) => [f.name, f.data])),
      radii: Object.fromEntries(radii.map((r) => [r.name, r.data])),
    };
    logger.success(
      "[Action] Todos los fragmentos de tema cargados con éxito.",
      { traceId }
    );
    return { success: true, data: loadedFragments };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo crítico al cargar todos los fragmentos de tema.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: "No se pudieron cargar los recursos de tema.",
    };
  } finally {
    logger.endTrace(traceId);
  }
}
