// RUTA: src/components/features/dev-tools/ComponentLoader.ts
/**
 * @file ComponentLoader.ts
 * @description Módulo de servicio SOBERANO para la carga dinámica de componentes.
 *              v6.1.0 (Code Hygiene): Se elimina la importación no utilizada del
 *              tipo 'Dictionary' para cumplir con los estándares de limpieza del
 *              código y las reglas de linting.
 * @version 6.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import {
  getComponentByName,
  type ComponentRegistryEntry,
} from "@/components/features/dev-tools/ComponentRegistry";
import { getFallbackProps } from "@/components/features/dev-tools/utils/component-props";
import { logger } from "@/shared/lib/logging";
// --- [INICIO DE REFACTORIZACIÓN DE HIGIENE] ---
// Se ha eliminado la importación no utilizada de 'Dictionary'.
// --- [FIN DE REFACTORIZACIÓN DE HIGIENE] ---

interface ComponentLoadResult {
  ComponentToRender: React.ComponentType<Record<string, unknown>>;
  componentProps: Record<string, unknown>;
  entry: ComponentRegistryEntry;
}

export async function loadComponentAndProps(
  componentName: string
): Promise<ComponentLoadResult> {
  logger.startGroup(`[Loader v6.1] Cargando "${componentName}"`);

  const entry = getComponentByName(componentName);
  if (!entry) {
    const errorMsg = `Componente "${componentName}" no encontrado en ComponentRegistry.`;
    logger.error(errorMsg);
    logger.endGroup();
    throw new Error(errorMsg);
  }

  const componentProps = getFallbackProps(componentName);

  try {
    const dynamicPath = `@/` + entry.componentPath.replace("@/", "");
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

    logger.success(
      `Componente "${componentName}" cargado dinámicamente con éxito.`
    );
    logger.endGroup();

    return { ComponentToRender, componentProps, entry };
  } catch (error) {
    const errorMsg = `Error crítico al importar dinámicamente el módulo para "${componentName}".`;
    logger.error(errorMsg, { path: entry.componentPath, error });
    logger.endGroup();
    throw new Error(
      `No se pudo cargar el módulo del componente: ${entry.componentPath}`
    );
  }
}
// RUTA: src/components/features/dev-tools/ComponentLoader.ts
