// RUTA: src/shared/lib/services/vercel.service.ts
/**
 * @file vercel.service.ts
 * @description SSoT para interactuar con la API de Vercel.
 * @version 2.0.0 (Type-Safe Contract)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";
import { z } from "zod";

import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";

const VERCEL_API_URL = "https://api.vercel.com/v1/analytics";
const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;

// --- [INICIO DE REFACTORIZACIÓN DE ÉLITE] ---
// Se crea un contrato de datos con Zod para la respuesta esperada.
const VercelAnalyticsDataSchema = z.object({
  // Define aquí la estructura que esperas de la API de Vercel.
  // Como ejemplo, asumimos una estructura simple.
  visitors: z.number(),
  sources: z.record(z.number()),
});
type VercelAnalyticsData = z.infer<typeof VercelAnalyticsDataSchema>;
// --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---

export async function getAnalyticsForPath(
  path: string
): Promise<ActionResult<VercelAnalyticsData>> {
  if (!VERCEL_API_TOKEN || !VERCEL_PROJECT_ID) {
    logger.error(
      "[VercelService] Variables de entorno de Vercel no configuradas."
    );
    return {
      success: false,
      error: "El servicio de analíticas no está configurado.",
    };
  }

  const url = `${VERCEL_API_URL}/projects/${VERCEL_PROJECT_ID}/query?path=${path}&metric=visitors,sources`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      },
      next: { revalidate: 3600 }, // Cachear por 1 hora
    });
    if (!response.ok) {
      throw new Error(
        `La API de Vercel respondió con el estado: ${response.status}`
      );
    }
    const jsonData = await response.json();

    // --- [INICIO DE REFACTORIZACIÓN DE ÉLITE] ---
    // Se valida la respuesta contra nuestro contrato de Zod.
    const validation = VercelAnalyticsDataSchema.safeParse(jsonData);
    if (!validation.success) {
      logger.error(
        "[VercelService] La respuesta de la API no coincide con el schema esperado.",
        { errors: validation.error.flatten() }
      );
      return {
        success: false,
        error: "Formato de datos de analíticas inesperado.",
      };
    }
    return { success: true, data: validation.data };
    // --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---
  } catch (error) {
    logger.error("Fallo al contactar la API de Vercel Analytics.", { error });
    return { success: false, error: "No se pudieron obtener las analíticas." };
  }
}
// RUTA: src/shared/lib/services/vercel.service.ts
