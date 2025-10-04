// RUTA: src/shared/lib/schemas/analytics/analytics.contracts.ts
/**
 * @file analytics.contracts.ts
 * @description Contrato de Tipos Atómico y Soberano para el Dominio de Analíticas ("Aura").
 * @version 3.0.0 (Isomorphic Type Safety)
 * @author L.I.A. Legacy
 */
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

export type VisitorSessionRow = Tables<"visitor_sessions">;
export type VisitorSessionInsert = TablesInsert<"visitor_sessions">;
export type VisitorSessionUpdate = TablesUpdate<"visitor_sessions">;

export type VisitorCampaignEventRow = Tables<"visitor_campaign_events">;
export type VisitorCampaignEventInsert =
  TablesInsert<"visitor_campaign_events">;
export type VisitorCampaignEventUpdate =
  TablesUpdate<"visitor_campaign_events">;

export type AnonymousCampaignEventRow = Tables<"anonymous_campaign_events">;
export type AnonymousCampaignEventInsert =
  TablesInsert<"anonymous_campaign_events">;
export type AnonymousCampaignEventUpdate =
  TablesUpdate<"anonymous_campaign_events">;

export type UserActivityEventRow = Tables<"user_activity_events">;
export type UserActivityEventInsert = TablesInsert<"user_activity_events">;
export type UserActivityEventUpdate = TablesUpdate<"user_activity_events">;
