// RUTA: app/[locale]/(dev)/nos3/_actions/list-sessions.action.ts
/**
 * @file list-sessions.action.ts
 * @description Server Action de élite para listar todas las sesiones de `nos3`
 *              grabadas y almacenadas en Vercel Blob.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { list } from "@vercel/blob";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";

/**
 * @interface SessionMetadata
 * @description Contrato de datos para los metadatos de una única sesión grabada.
 */
export interface SessionMetadata {
  sessionId: string;
  startTime: Date;
  // En el futuro, podríamos añadir más metadatos como:
  // userAgent: string;
  // startPathname: string;
  // eventCount: number;
}

/**
 * @function listSessionsAction
 * @description Escanea el almacenamiento de Vercel Blob en el prefijo 'sessions/',
 *              identifica las sesiones únicas y devuelve una lista de metadatos
 *              ordenada por la más reciente.
 * @returns {Promise<ActionResult<SessionMetadata[]>>} Un array de metadatos de sesión o un error.
 */
export async function listSessionsAction(): Promise<
  ActionResult<SessionMetadata[]>
> {
  logger.info(
    "[nos3-data-layer] Solicitando lista de sesiones desde Vercel Blob..."
  );
  try {
    const { blobs } = await list({
      prefix: "sessions/",
      mode: "expanded", // Necesitamos los detalles de cada blob para encontrar el más antiguo.
    });

    // Usamos un Map para agregar los datos y encontrar la fecha de inicio más temprana para cada sesión.
    const sessionsMap = new Map<string, Date>();

    for (const blob of blobs) {
      // La ruta es 'sessions/{sessionId}/{timestamp}.json'
      const pathParts = blob.pathname.split("/");
      if (pathParts.length < 3) continue;

      const sessionId = pathParts[1];
      const existingStartTime = sessionsMap.get(sessionId);

      // Si la sesión no está en el mapa, o si este blob es más antiguo que el que ya tenemos,
      // lo consideramos un mejor candidato para el "inicio" de la sesión.
      if (!existingStartTime || blob.uploadedAt < existingStartTime) {
        sessionsMap.set(sessionId, blob.uploadedAt);
      }
    }

    // Convertimos el mapa en el array de metadatos que necesita el frontend.
    const sessions: SessionMetadata[] = Array.from(sessionsMap.entries()).map(
      ([sessionId, startTime]) => ({
        sessionId,
        startTime,
      })
    );

    // Ordenamos para mostrar las sesiones más recientes primero.
    sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

    logger.success(
      `[nos3-data-layer] Se encontraron ${sessions.length} sesiones únicas.`
    );
    return { success: true, data: sessions };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido en Vercel Blob";
    logger.error("[nos3-data-layer] Fallo al listar las sesiones.", {
      error: errorMessage,
    });
    return {
      success: false,
      error: "No se pudieron recuperar las grabaciones de las sesiones.",
    };
  }
}
