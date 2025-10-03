// RUTA: src/shared/lib/dev/ComponentLoader.ts
/**
 * @file ComponentLoader.ts
 * @description Módulo de servicio SOBERANO para la carga dinámica de componentes.
 *              v7.2.0 (Elite Type Safety): Se erradica el uso de 'any' en el tipo de
 *              retorno, reemplazándolo con `Record<string, unknown>` para una
 *              seguridad de tipos absoluta y cumplimiento de linter de élite.
 * @version 7.2.0
 * @author L.I.A. Legacy
 */
import "server-only";
import React from "react";
import {
  getComponentByName,
  type ComponentRegistryEntry,
} from "@/shared/lib/dev/ComponentRegistry";
import { getFallbackProps } from "@/components/features/dev-tools/utils/component-props";
import { logger } from "@/shared/lib/logging";

interface ComponentLoadResult {
  // --- [INICIO DE REFACTORIZACIÓN DE ÉLITE: SEGURIDAD DE TIPOS] ---
  ComponentToRender: React.ComponentType<Record<string, unknown>>;
  // --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---
  componentProps: Record<string, unknown>;
  entry: ComponentRegistryEntry;
}

export async function loadComponentAndProps(
  componentName: string
): Promise<ComponentLoadResult> {
  const traceId = logger.startTrace(`loadComponentAndProps:${componentName}`);
  logger.startGroup(`[Loader v7.2] Orquestando carga de "${componentName}"...`);

  try {
    logger.traceEvent(traceId, "Obteniendo entrada del registro...");
    const entry = getComponentByName(componentName);
    if (!entry) {
      throw new Error(
        `Componente "${componentName}" no encontrado en ComponentRegistry.`
      );
    }
    logger.traceEvent(traceId, "Entrada del registro obtenida con éxito.");

    logger.traceEvent(traceId, "Generando props de fallback...");
    const componentProps = getFallbackProps(componentName);
    logger.traceEvent(traceId, "Props de fallback generadas.");

    const dynamicPath = `@/` + entry.componentPath.replace("@/", "");
    logger.traceEvent(
      traceId,
      `Importando dinámicamente desde: ${dynamicPath}`
    );
    const componentModule = await import(dynamicPath);

    const ComponentToRender =
      componentModule.default ||
      componentModule[componentName] ||
      componentModule[entry.dictionaryKey] ||
      componentModule[Object.keys(componentModule)[0]];

    if (!ComponentToRender) {
      throw new Error(
        `Exportación por defecto o nombrada no encontrada en "${entry.componentPath}"`
      );
    }
    logger.traceEvent(traceId, "Módulo del componente resuelto y cargado.");

    logger.success(
      `[Loader] Componente "${componentName}" listo para renderizar.`
    );
    return { ComponentToRender, componentProps, entry };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(`[Loader] Fallo crítico al cargar "${componentName}".`, {
      error: errorMessage,
      traceId,
    });
    throw new Error(
      `No se pudo orquestar la carga del componente: ${errorMessage}`
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
