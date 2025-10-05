// RUTA: src/shared/lib/actions/user-intelligence/getProfiledUsers.action.ts
/**
 * @file getProfiledUsers.action.ts
 * @description Server Action soberana para obtener una lista paginada de perfiles de usuario.
 * @version 2.2.0 (Database Relation Query Restored): Se corrige la consulta a Supabase
 *              para usar un inner join explícito, resolviendo el `SelectQueryError`
 *              y el error de tipo TS2345.
 * @version 2.2.0
 * @author L.I.A. Legacy
 */
"use server";

import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { UserProfileSummaryRow } from "@/shared/lib/schemas/analytics/analytics.contracts";

export const ProfiledUserSchema = z.object({
  userId: z.string().uuid().nullable(),
  sessionId: z.string(),
  userType: z.enum(["Registered", "Anonymous"]),
  displayName: z.string(),
  avatarUrl: z.string().nullable(),
  firstSeenAt: z.string().datetime(),
  lastSeenAt: z.string().datetime(),
  totalEvents: z.number().int(),
});

export type ProfiledUser = z.infer<typeof ProfiledUserSchema>;

const GetProfiledUsersInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

type GetProfiledUsersInput = z.infer<typeof GetProfiledUsersInputSchema>;

function mapSupabaseToProfiledUser(
  row: UserProfileSummaryRow & {
    profiles: { avatar_url: string | null; full_name: string | null } | null;
  }
): ProfiledUser {
  return {
    userId: row.id,
    sessionId: row.id,
    userType:
      row.user_type === "tenant" || row.user_type === "customer"
        ? "Registered"
        : "Anonymous",
    displayName: row.profiles?.full_name || `Visitante #${row.id.slice(0, 7)}`,
    avatarUrl: row.profiles?.avatar_url ?? null,
    firstSeenAt: row.first_seen_at!,
    lastSeenAt: row.last_seen_at!,
    totalEvents: row.total_events,
  };
}

export async function getProfiledUsersAction(
  input: GetProfiledUsersInput
): Promise<ActionResult<{ users: ProfiledUser[]; total: number }>> {
  const traceId = logger.startTrace("getProfiledUsersAction_v2.2");
  logger.startGroup(
    `[UserInt Action] Obteniendo lista de perfiles...`,
    traceId
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

    // --- [INICIO DE REFACTORIZACIÓN DE QUERY v2.2.0] ---
    // Se utiliza un inner join explícito (!inner) para forzar la relación a través de `profiles`.
    // Esto asegura que solo se devuelvan perfiles que existen en ambas tablas y
    // resuelve el `SelectQueryError` de forma definitiva.
    const { data, error, count } = await supabase
      .from("user_profile_summary")
      .select("*, profiles!inner(avatar_url, full_name)", { count: "exact" })
      .order("last_seen_at", { ascending: false })
      .range(offset, offset + limit - 1);
    // --- [FIN DE REFACTORIZACIÓN DE QUERY v2.2.0] ---

    if (error) throw new Error(error.message);

    const users = data.map(mapSupabaseToProfiledUser);
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
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
