// RUTA: src/shared/lib/actions/user-intelligence/getProfiledUsers.action.ts
/**
 * @file getProfiledUsers.action.ts
 * @description Server Action soberana para obtener una lista paginada de perfiles de usuario.
 * @version 5.0.0 (Architectural Integrity & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { UserProfileSummaryRow } from "@/shared/lib/schemas/analytics/analytics.contracts";
import {
  ProfiledUserSchema,
  type ProfiledUser,
} from "./user-intelligence.contracts";

const GetProfiledUsersInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

type GetProfiledUsersInput = z.infer<typeof GetProfiledUsersInputSchema>;

type JoinedRow = {
  avatar_url: string | null;
  full_name: string | null;
  user_profile_summary: UserProfileSummaryRow;
};

function isJoinedRow(row: unknown): row is JoinedRow {
  return (
    typeof row === "object" &&
    row !== null &&
    "user_profile_summary" in row &&
    typeof (row as { user_profile_summary: unknown }).user_profile_summary ===
      "object" &&
    (row as { user_profile_summary: unknown }).user_profile_summary !== null &&
    "id" in
      (row as { user_profile_summary: Record<string, unknown> })
        .user_profile_summary
  );
}

function mapSupabaseToProfiledUser(row: JoinedRow): ProfiledUser {
  return {
    userId: row.user_profile_summary.id,
    sessionId: row.user_profile_summary.id,
    userType:
      row.user_profile_summary.user_type === "tenant" ||
      row.user_profile_summary.user_type === "customer"
        ? "Registered"
        : "Anonymous",
    displayName:
      row.full_name || `Visitante #${row.user_profile_summary.id.slice(0, 7)}`,
    avatarUrl: row.avatar_url ?? null,
    firstSeenAt: row.user_profile_summary.first_seen_at!,
    lastSeenAt: row.user_profile_summary.last_seen_at!,
    totalEvents: row.user_profile_summary.total_events,
  };
}

export async function getProfiledUsersAction(
  input: GetProfiledUsersInput
): Promise<ActionResult<{ users: ProfiledUser[]; total: number }>> {
  const traceId = logger.startTrace("getProfiledUsersAction_v5.0");
  const groupId = logger.startGroup(
    `[UserInt Action] Obteniendo lista de perfiles...`
  );

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "auth_required" };
    }

    const validation = GetProfiledUsersInputSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, error: "Parámetros de paginación inválidos." };
    }

    const { page, limit } = validation.data;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from("profiles")
      .select("avatar_url, full_name, user_profile_summary!inner(*)", {
        count: "exact",
      })
      .order("last_seen_at", {
        referencedTable: "user_profile_summary",
        ascending: false,
      })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    const validData = (data || []).filter(isJoinedRow);

    if (data && data.length !== validData.length) {
      logger.warn("[UserInt Action] Se descartaron filas con joins fallidos.", {
        total: data.length,
        valid: validData.length,
        traceId,
      });
    }

    const users = (validData as unknown as JoinedRow[]).map(
      mapSupabaseToProfiledUser
    );

    const usersValidation = z.array(ProfiledUserSchema).safeParse(users);

    if (!usersValidation.success) {
      logger.error("[UserInt Action] Datos de perfiles corruptos en la DB.", {
        errors: usersValidation.error.flatten(),
        traceId,
      });
      throw new Error("Formato de datos de perfiles inesperado.");
    }

    logger.success(
      `[UserInt Action] ${users.length} perfiles obtenidos con éxito.`,
      { traceId }
    );
    return {
      success: true,
      data: { users: usersValidation.data, total: count ?? 0 },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[UserInt Action] Fallo crítico al obtener perfiles.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: "No se pudieron recuperar los perfiles de usuario.",
    };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
