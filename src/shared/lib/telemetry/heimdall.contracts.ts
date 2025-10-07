// RUTA: src/shared/lib/telemetry/heimdall.contracts.ts
/**
 * @file heimdall.contracts.ts
 * @description SSoT para los contratos de datos del Protocolo Heimdall.
 *              v2.0.0 (Architectural Purity Restoration): Se eliminan las
 *              importaciones circulares para restaurar la integridad del módulo.
 * @version 2.0.0
 * @author L.I.A. Legacy
 */
import { z } from "zod";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

// --- [INICIO DE REFACTORIZACIÓN DE PUREZA ARQUITECTÓNICA v2.0.0] ---
// Se eliminan las siguientes importaciones circulares que causaban el error:
// import type { HeimdallEvent } from "@/shared/lib/telemetry/heimdall.contracts";
// import type { HeimdallEventInsert } from "@/shared/lib/telemetry/heimdall.contracts";
// --- [FIN DE REFACTORIZACIÓN DE PUREZA ARQUITECTÓNICA v2.0.0] ---

// Contratos de Aplicación (Zod)
export const EventStatusSchema = z.enum(["SUCCESS", "FAILURE", "IN_PROGRESS"]);
export type EventStatus = z.infer<typeof EventStatusSchema>;

export const HeimdallEventSchema = z.object({
  eventId: z.string().cuid2(),
  traceId: z.string(),
  eventName: z.string(),
  status: EventStatusSchema,
  timestamp: z.string().datetime(),
  duration: z.number().optional(),
  payload: z.record(z.unknown()).optional(),
  context: z.object({
    runtime: z.enum(["browser", "server", "edge"]),
    user: z.string().optional(),
    path: z.string().optional(),
  }),
});
export type HeimdallEvent = z.infer<typeof HeimdallEventSchema>;

export const HeimdallIngestPayloadSchema = z.object({
  events: z.array(HeimdallEventSchema),
});

// Contratos de Base de Datos (SSoT para Supabase)
export type HeimdallEventRow = Tables<"heimdall_events">;
export type HeimdallEventInsert = TablesInsert<"heimdall_events">;
export type HeimdallEventUpdate = TablesUpdate<"heimdall_events">;

export const HeimdallEventRowSchema = z.object({
  event_id: z.string(),
  trace_id: z.string(),
  event_name: z.string(),
  status: z.string(),
  timestamp: z.string().datetime(),
  duration_ms: z.number().nullable(),
  path: z.string().nullable(),
  payload: z.any().nullable(), // jsonb
  context: z.any().nullable(), // jsonb
  created_at: z.string().datetime(),
});
