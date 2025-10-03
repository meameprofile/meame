// RUTA: src/shared/lib/schemas/analytics/aura.schema.ts
/**
 * @file aura.schema.ts
 * @description SSoT para el contrato de datos del sistema de telemetría "Aura".
 *              Define la estructura de los eventos de tracking y los payloads.
 * @version 2.0.0 (Encryption-Aware & PayloadSchema)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

// Definición de un esquema flexible para los payloads internos de los eventos.
// Esto permite que 'payload' sea cualquier objeto JSON válido.
const DynamicPayloadSchema = z.record(z.string(), z.any());

export const AuraEventSchema = z.object({
  sessionId: z.string(),
  campaignId: z.string(),
  variantId: z.string(),
  eventType: z.string(),
  payload: DynamicPayloadSchema, // El payload interno del evento
  timestamp: z.number(), // Timestamp Unix en ms desde el cliente
});

export type AuraEvent = z.infer<typeof AuraEventSchema>;

export const AuraIngestPayloadSchema = z.object({
  events: z.array(AuraEventSchema),
});

// --- NUEVO TIPO: Representa el evento con el payload ya desencriptado ---
// Es útil para tipar la salida de getDecryptedEventsForDebug.action.ts
export const AuraEventPayloadSchema = z.object({
  eventType: z.string(),
  sessionId: z.string(),
  campaignId: z.string(),
  variantId: z.string(),
  timestamp: z.number(),
  payload: DynamicPayloadSchema, // Aquí el payload ya está desencriptado (objeto JSON)
});

export type AuraEventPayload = z.infer<typeof AuraEventPayloadSchema>;
