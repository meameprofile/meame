// RUTA: src/shared/lib/telemetry/heimdall.contracts.ts
/**
 * @file heimdall.contracts.ts
 * @description SSoT para los contratos de datos del Protocolo Heimdall.
 *              Define la estructura semántica de los eventos para una
 *              observabilidad de élite y analizable.
 * @version 5.0.0 (Semantic Event Taxonomy)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

// --- Contratos de Aplicación (Zod) ---

/**
 * @const EventStatusSchema
 * @description Define los posibles estados de un evento de telemetría.
 */
export const EventStatusSchema = z.enum(["SUCCESS", "FAILURE", "IN_PROGRESS"]);
export type EventStatus = z.infer<typeof EventStatusSchema>;

/**
 * @const EventIdentifierSchema
 * @description Define la taxonomía semántica de un evento. Es el corazón de
 *              nuestra estrategia de observabilidad analizable.
 */
export const EventIdentifierSchema = z.object({
  domain: z
    .string()
    .describe(
      "El dominio de negocio de alto nivel (ej. HOMEPAGE_RENDER, AUTH)."
    ),
  entity: z
    .string()
    .describe(
      "La entidad o subdominio específico (ej. I18N_DICTIONARY, USER_SESSION)."
    ),
  action: z
    .string()
    .describe(
      "La acción concreta que se está realizando (ej. FETCH_INITIATED, VALIDATION_SUCCESS)."
    ),
});
export type EventIdentifier = z.infer<typeof EventIdentifierSchema>;

/**
 * @const HeimdallEventSchema
 * @description El schema soberano y completo para un único evento de telemetría.
 */
export const HeimdallEventSchema = z.object({
  eventId: z.string().cuid2(),
  traceId: z.string(),
  taskId: z.string().optional(),

  // [NUEVA ARQUITECTURA SEMÁNTICA]
  event: EventIdentifierSchema,
  title: z
    .string()
    .describe(
      "Descripción legible por humanos del evento, usada para logs en desarrollo."
    ),

  status: EventStatusSchema,
  stepName: z.string().optional(),
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

/**
 * @const HeimdallIngestPayloadSchema
 * @description Define la estructura del payload que el cliente envía al
 *              endpoint de ingesta `/api/telemetry/ingest`.
 */
export const HeimdallIngestPayloadSchema = z.object({
  events: z.array(HeimdallEventSchema),
});

// --- Contratos de Base de Datos (SSoT para Supabase) ---

// [BÓVEDA FORENSE]
export type HeimdallEventRow = Tables<"heimdall_events">;
export type HeimdallEventInsert = TablesInsert<"heimdall_events">;
export type HeimdallEventUpdate = TablesUpdate<"heimdall_events">;
export const HeimdallEventRowSchema = z.object({
  event_id: z.string(),
  trace_id: z.string(),
  task_id: z.string().nullable(),
  step_name: z.string().nullable(),
  event_name: z.string(), // Legado, será reemplazado por 'title'
  status: z.string(),
  timestamp: z.string().datetime(),
  duration_ms: z.number().nullable(),
  payload: z.any().nullable(),
  context: z.any().nullable(),
  created_at: z.string().datetime(),
});

// [SISMÓGRAFO DE SALUD]
export type TaskHealthSummaryRow = Tables<"task_health_summary">;
export type TaskHealthSummaryInsert = TablesInsert<"task_health_summary">;
export type TaskHealthSummaryUpdate = TablesUpdate<"task_health_summary">;
export const TaskHealthSummaryRowSchema = z.object({
  task_id: z.string(),
  task_name: z.string(), // Corresponde a 'title' del evento raíz
  status: z.enum(["SUCCESS", "FAILURE"]),
  duration_ms: z.number().int().nullable(),
  timestamp: z.string().datetime(),
  user_id: z.string().uuid().nullable(),
  workspace_id: z.string().uuid().nullable(),
  context: z.any().nullable(),
  created_at: z.string().datetime(),
});
