// RUTA: src/shared/lib/dev/live-previews.config.ts
/**
 * @file live-previews.config.ts
 * @description SSoT para el registro de componentes SEGUROS PARA EL CLIENTE para el EDVI.
 *              Este manifiesto es el guardián de la frontera Servidor-Cliente. Solo
 *              debe importar componentes de presentación puros ("use client") para
 *              garantizar la integridad del build.
 * @version 9.4.0 (Observability Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import type { ComponentType } from "react";

import { Footer } from "@/components/layout/Footer";
import HeaderClient from "@/components/layout/HeaderClient";
import { CommentSectionClient } from "@/components/sections/comments/CommentSectionClient";
import { sectionsConfig } from "@/shared/lib/config/sections.config";
import { logger } from "@/shared/lib/logging";

type PreviewableComponent = ComponentType<Record<string, unknown>>;

function generateComponentMap(): Record<string, PreviewableComponent> {
  const traceId = logger.startTrace("generateComponentMap_v9.4");
  const groupId = logger.startGroup(
    `[LivePreviewRegistry] Generando registro dinámico...`
  );

  try {
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
      StandardHeader: HeaderClient as unknown as PreviewableComponent,
      MinimalHeader: HeaderClient as unknown as PreviewableComponent,
      StandardFooter: Footer as unknown as PreviewableComponent,
    };

    logger.success(
      `[LivePreviewRegistry] Registro dinámico generado con ${
        Object.keys(fullMap).length
      } componentes.`,
      { traceId }
    );

    return fullMap;
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}

export const livePreviewComponentMap = generateComponentMap();
