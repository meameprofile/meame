// RUTA: src/components/features/dev-tools/ComponentLoader.ts
/**
 * @file ComponentLoader.ts
 * @description Módulo de servicio SOBERANO para la carga dinámica de componentes.
 *              v7.0.0 (Observability Contract v20+ Compliance): Refactorizado para
 *              cumplir con el contrato de API del logger soberano, capturando y
 *              pasando el groupId para una trazabilidad de rendimiento precisa.
 * @version 7.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import type React from "react";

import {
  getComponentByName,
  type ComponentRegistryEntry,
} from "@/components/features/dev-tools/ComponentRegistry";
import { getFallbackProps } from "@/components/features/dev-tools/utils/component-props";
import { logger } from "@/shared/lib/logging";

interface ComponentLoadResult {
  ComponentToRender: React.ComponentType<Record<string, unknown>>;
  componentProps: Record<string, unknown>;
  entry: ComponentRegistryEntry;
}

export async function loadComponentAndProps(
  componentName: string
): Promise<ComponentLoadResult> {
  const groupId = logger.startGroup(
    `[Loader v7.0] Cargando "${componentName}"`
  );

  try {
    const entry = getComponentByName(componentName);
    if (!entry) {
      throw new Error(
        `Componente "${componentName}" no encontrado en ComponentRegistry.`
      );
    }

    const componentProps = getFallbackProps(componentName);

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

    return { ComponentToRender, componentProps, entry };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(`[Loader] Fallo crítico al cargar "${componentName}".`, {
      error: errorMessage,
    });
    // El error se propaga para que el consumidor (ComponentCanvas) lo maneje.
    throw error;
  } finally {
    logger.endGroup(groupId);
  }
}
