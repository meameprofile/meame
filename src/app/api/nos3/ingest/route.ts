// RUTA: src/app/api/nos3/ingest/route.ts
/**
 * @file route.ts
 * @description Endpoint de Ingestión para el sistema `nos3`.
 * @version 1.3.0 (Architectural Boundary Fix)
 *@author RaZ Podestá - MetaShark Tech
 */
// --- [INICIO DE RESTAURACIÓN ARQUITECTÓNICA] ---
// Se ha eliminado la directiva "use client". Las rutas de API son exclusivamente
// de servidor y no pueden ser Componentes de Cliente.
// --- [FIN DE RESTAURACIÓN ARQUITECTÓNICA] ---
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";

import { logger } from "@/shared/lib/logging";

export const runtime = "edge";

const IngestPayloadSchema = z.object({
  sessionId: z
    .string()
    .cuid2({ message: "El ID de sesión debe ser un CUID2 válido." }),
  events: z.array(z.any()),
  metadata: z.object({
    pathname: z.string(),
    timestamp: z.number(),
  }),
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validation = IngestPayloadSchema.safeParse(body);

    if (!validation.success) {
      logger.warn("[nos3-ingestor] Payload de ingestión inválido.", {
        errors: validation.error.flatten(),
      });
      return NextResponse.json(
        { error: "Bad Request: Invalid payload structure." },
        { status: 400 }
      );
    }

    const { sessionId, events, metadata } = validation.data;
    const blobPath = `sessions/${sessionId}/${metadata.timestamp}.json`;

    await put(blobPath, JSON.stringify(events), {
      access: "public",
      contentType: "application/json",
    });

    logger.trace(
      `[nos3-ingestor] Lote de sesión ${sessionId} enviado a Vercel Blob.`,
      {
        path: blobPath,
        eventCount: events.length,
      }
    );

    return NextResponse.json(
      { message: "Payload accepted for processing." },
      { status: 202 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown ingest error";
    let requestBodyForLog: unknown = "Could not re-parse body for logging.";
    try {
      requestBodyForLog = await request.json();
    } catch {
      /* Ignorar error de parseo secundario */
    }

    logger.error("[nos3-ingestor] Fallo crítico en el endpoint de ingestión.", {
      error: errorMessage,
      requestBody: requestBodyForLog,
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
