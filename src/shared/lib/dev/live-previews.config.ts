// RUTA: src/shared/lib/dev/live-previews.config.ts
/**
 * @file live-previews.config.ts
 * @description SSoT para el registro de componentes SEGUROS PARA EL CLIENTE para el EDVI.
 *              v9.3.0 (Definitive Type Assertion): Resuelve el error de tipo
 *              TS2352 utilizando una doble aserción explícita (`as unknown as Type`),
 *              alineando la seguridad de tipos estática con el contrato garantizado en tiempo de ejecución.
 * @version 9.3.0
 * @author L.I.A. Legacy
 */
import type { ComponentType } from "react";
import { logger } from "@/shared/lib/logging";
import { sectionsConfig } from "@/shared/lib/config/sections.config";
import HeaderClient from "@/components/layout/HeaderClient"; // <-- IMPORTACIÓN CORREGIDA
import { Footer } from "@/components/layout/Footer";
import { CommentSectionClient } from "@/components/sections/comments/CommentSectionClient";

type PreviewableComponent = ComponentType<Record<string, unknown>>;

function generateComponentMap(): Record<string, PreviewableComponent> {
  const traceId = logger.startTrace("generateComponentMap_v9.3");
  logger.startGroup(`[LivePreviewRegistry] Generando registro dinámico...`);

  const dynamicMap = Object.entries(sectionsConfig).reduce(
    (acc, [name, config]) => {
      if (name === "CommentSection") {
        acc[name] = CommentSectionClient as unknown as PreviewableComponent;
      } else {
        acc[name] = config.component as unknown as PreviewableComponent;
      }
      return acc;
    },
    {} as Record<string, PreviewableComponent>
  );

  const fullMap: Record<string, PreviewableComponent> = {
    ...dynamicMap,
    StandardHeader: HeaderClient as unknown as PreviewableComponent, // <-- USO CORREGIDO
    MinimalHeader: HeaderClient as unknown as PreviewableComponent, // <-- USO CORREGIDO
    StandardFooter: Footer as unknown as PreviewableComponent,
  };

  logger.success(
    `[LivePreviewRegistry] Registro dinámico generado con ${
      Object.keys(fullMap).length
    } componentes.`,
    { traceId }
  );
  logger.endGroup();
  logger.endTrace(traceId);

  return fullMap;
}

export const livePreviewComponentMap = generateComponentMap();
