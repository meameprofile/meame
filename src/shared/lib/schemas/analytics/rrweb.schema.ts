// RUTA: src/shared/lib/schemas/analytics/rrweb.schema.ts
/**
 * @file rrweb.schema.ts
 * @description SSoT para el contrato de datos de eventos de rrweb.
 *              Abstrae la dependencia directa de @rrweb/types para mayor resiliencia.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const RrwebEventSchema = z.object({
  type: z.number(),
  data: z.record(z.string(), z.unknown()), // Permite cualquier estructura de datos
  timestamp: z.number(),
  delay: z.number().optional(),
});

export type RrwebEvent = z.infer<typeof RrwebEventSchema>;
