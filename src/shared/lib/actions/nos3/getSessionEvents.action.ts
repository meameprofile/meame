// RUTA: src/shared/lib/actions/nos3/getSessionEvents.action.ts
/**
 * @file getSessionEvents.action.ts
 * @description Server Action de élite para obtener todos los eventos de una
 *              sesión específica de `nos3` desde Vercel Blob.
 *              v1.2.0 (Elite Observability Injection): Inyectado con un sistema
 *              de tracing para una depuración y observabilidad de nivel superior.
 * @version 1.2.0
 *@author RaZ Podestá - MetaShark Tech
 */
"use server";

import { list } from "@vercel/blob";

import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { eventWithTime } from "@/shared/lib/types/rrweb.types";

export async function getSessionEventsAction(
  sessionId: string
): Promise<ActionResult<eventWithTime[]>> {
  const traceId = logger.startTrace(`getSessionEvents:${sessionId}`);
  logger.info(
    `[nos3-data-layer] Solicitando eventos para la sesión: ${sessionId}`,
    { traceId }
  );

  try {
    const { blobs } = await list({
      prefix: `sessions/${sessionId}/`,
      mode: "expanded",
    });

    if (blobs.length === 0) {
      const warningMsg = `No se encontraron blobs para la sesión: ${sessionId}`;
      logger.warn(`[nos3-data-layer] ${warningMsg}`, { traceId });
      return {
        success: false,
        error: "No se encontraron datos para esta sesión.",
      };
    }
    logger.traceEvent(
      traceId,
      `Se encontraron ${blobs.length} blobs de eventos.`
    );

    const eventsPromises = blobs.map(async (blob) => {
      const response = await fetch(blob.url);
      if (!response.ok) {
        throw new Error(`Fallo al descargar el blob: ${blob.url}`);
      }
      return (await response.json()) as eventWithTime[];
    });

    const eventChunks = await Promise.all(eventsPromises);
    const allEvents = eventChunks.flat();

    allEvents.sort((a, b) => a.timestamp - b.timestamp);

    logger.success(
      `[nos3-data-layer] Se recuperaron y ensamblaron ${allEvents.length} eventos para la sesión ${sessionId}.`,
      { traceId }
    );
    return { success: true, data: allEvents };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido en Vercel Blob";
    logger.error(
      `[nos3-data-layer] Fallo al obtener los eventos para la sesión ${sessionId}.`,
      { error: errorMessage, traceId }
    );
    return {
      success: false,
      error: "No se pudieron recuperar los eventos de la sesión.",
    };
  } finally {
    logger.endTrace(traceId);
  }
}
