// RUTA: src/shared/lib/schemas/analytics/analytics.contracts.ts
/**
 * @file analytics.contracts.ts
 * @description SSoT para los contratos de tipo de las tablas del dominio de Analytics.
 * @version 2.0.0 (UserProfileSummaryRow Integration)
 * @author L.I.A. Legacy
 */
import { z } from "zod";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

// --- Contratos Existentes (sin cambios) ---
export type VisitorSessionRow = Tables<"visitor_sessions">;
export type VisitorSessionInsert = TablesInsert<"visitor_sessions">;
export type VisitorSessionUpdate = TablesUpdate<"visitor_sessions">;
export const VisitorSessionRowSchema = z.object({
  session_id: z.string(),
  fingerprint_id: z.string().nullable(),
  user_id: z.string().uuid().nullable(),
  workspace_id: z.string().uuid().nullable(),
  ip_address_encrypted: z.string().nullable(),
  user_agent_encrypted: z.string().nullable(),
  geo_encrypted: z.any().nullable(),
  first_seen_at: z.string().datetime(),
  last_seen_at: z.string().datetime(),
});

export type VisitorCampaignEventRow = Tables<"visitor_campaign_events">;
export type VisitorCampaignEventInsert =
  TablesInsert<"visitor_campaign_events">;
export type VisitorCampaignEventUpdate =
  TablesUpdate<"visitor_campaign_events">;
export const VisitorCampaignEventRowSchema = z.object({
  event_id: z.string().uuid(),
  session_id: z.string(),
  campaign_id: z.string(),
  variant_id: z.string(),
  event_type: z.string(),
  payload: z.any().nullable(),
  created_at: z.string().datetime(),
});

// --- [INICIO DE ADICIÓN SOBERANA v2.0.0] ---
// Se crea y exporta el contrato de datos para la tabla 'user_profile_summary'.
export type UserProfileSummaryRow = Tables<"user_profile_summary">;
export type UserProfileSummaryInsert = TablesInsert<"user_profile_summary">;
export type UserProfileSummaryUpdate = TablesUpdate<"user_profile_summary">;
export const UserProfileSummaryRowSchema = z.object({
  id: z.string().uuid(),
  user_type: z.string(),
  total_sessions: z.number().int(),
  total_events: z.number().int(),
  total_conversions: z.number().int(),
  first_seen_at: z.string().datetime().nullable(),
  last_seen_at: z.string().datetime().nullable(),
  most_frequent_country: z.string().nullable(),
  last_campaign_id_seen: z.string().nullable(),
  last_variant_id_seen: z.string().nullable(),
  last_insight_generated_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
// --- [FIN DE ADICIÓN SOBERANA v2.0.0] ---

export type UserActivityEventRow = Tables<"user_activity_events">;
export type UserActivityEventInsert = TablesInsert<"user_activity_events">;
export type UserActivityEventUpdate = TablesUpdate<"user_activity_events">;
export const UserActivityEventRowSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  user_id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  session_id: z.string(),
  event_type: z.string(),
  payload: z.any().nullable(),
});
