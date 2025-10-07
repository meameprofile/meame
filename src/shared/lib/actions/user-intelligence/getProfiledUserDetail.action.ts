// RUTA: src/shared/lib/actions/user-intelligence/getProfiledUserDetail.action.ts
/**
 * @file getProfiledUserDetail.action.ts
 * @description Server Action soberana para obtener la vista de 360 grados de un perfil de usuario.
 *              v4.0.0 (Holistic Observability & Contract Compliance): Nivelado para
 *              cumplir con el contrato de API del logger soberano v20+.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import { decryptServerData } from "@/shared/lib/utils/server-encryption";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { VisitorCampaignEventRow } from "@/shared/lib/schemas/analytics/analytics.contracts";

const UaParserResultSchema = z
  .object({
    ua: z.string(),
    browser: z
      .object({ name: z.string().optional(), version: z.string().optional() })
      .optional(),
    engine: z
      .object({ name: z.string().optional(), version: z.string().optional() })
      .optional(),
    os: z
      .object({ name: z.string().optional(), version: z.string().optional() })
      .optional(),
    device: z
      .object({
        vendor: z.string().optional(),
        model: z.string().optional(),
        type: z.string().optional(),
      })
      .optional(),
    cpu: z.object({ architecture: z.string().optional() }).optional(),
  })
  .passthrough();

type UaParserResult = z.infer<typeof UaParserResultSchema>;

export interface ProfiledUserDetail {
  sessionId: string;
  userId: string | null;
  fingerprintId: string;
  userType: "Registered" | "Anonymous";
  displayName: string;
  avatarUrl: string | null;
  ip: string | null;
  geo: {
    countryCode: string | null;
    city: string | null;
    region: string | null;
  } | null;
  userAgent: UaParserResult;
  events: VisitorCampaignEventRow[];
}

export async function getProfiledUserDetailAction(
  sessionId: string
): Promise<ActionResult<ProfiledUserDetail>> {
  const traceId = logger.startTrace("getProfiledUserDetailAction_v4.0");
  const groupId = logger.startGroup(
    `[UserInt Action] Obteniendo detalle para sesión: ${sessionId}`
  );

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };

    const { data: sessionData, error: sessionError } = await supabase
      .from("visitor_sessions")
      .select("*, visitor_campaign_events(*)")
      .eq("session_id", sessionId)
      .single();

    if (sessionError) throw new Error(sessionError.message);
    if (!sessionData) throw new Error("Sesión no encontrada.");

    let profileData: {
      full_name: string | null;
      avatar_url: string | null;
    } | null = null;
    if (sessionData.user_id) {
      const { data: pData, error: pError } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", sessionData.user_id)
        .single();
      if (pError && pError.code !== "PGRST116") throw pError;
      profileData = pData;
    }

    const [ip, geo, userAgentString] = await Promise.all([
      sessionData.ip_address_encrypted
        ? decryptServerData(sessionData.ip_address_encrypted)
        : null,
      sessionData.geo_encrypted
        ? decryptServerData(JSON.stringify(sessionData.geo_encrypted))
        : null,
      sessionData.user_agent_encrypted
        ? decryptServerData(sessionData.user_agent_encrypted)
        : null,
    ]);

    const userAgent = userAgentString
      ? UaParserResultSchema.parse(JSON.parse(userAgentString))
      : UaParserResultSchema.parse({ ua: "" }); // Fallback seguro

    const result: ProfiledUserDetail = {
      sessionId: sessionData.session_id,
      userId: sessionData.user_id,
      fingerprintId: sessionData.fingerprint_id || "N/A",
      userType: sessionData.user_id ? "Registered" : "Anonymous",
      displayName:
        profileData?.full_name ||
        `Visitante #${sessionData.fingerprint_id?.slice(0, 7)}`,
      avatarUrl: profileData?.avatar_url ?? null,
      ip,
      geo: geo ? JSON.parse(geo) : null,
      userAgent,
      events:
        (sessionData.visitor_campaign_events as VisitorCampaignEventRow[]) ||
        [],
    };

    logger.success(
      `[UserInt Action] Perfil de sesión ${sessionId} ensamblado con éxito.`,
      { traceId }
    );
    return { success: true, data: result };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[UserInt Action] Fallo crítico al obtener detalle de perfil.",
      { error: errorMessage, traceId }
    );
    return {
      success: false,
      error: "No se pudo recuperar el perfil de usuario.",
    };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
