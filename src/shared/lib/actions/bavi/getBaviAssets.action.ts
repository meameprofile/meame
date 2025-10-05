// RUTA: src/shared/lib/actions/bavi/getBaviAssets.action.ts
/**
 * @file getBaviAssets.action.ts
 * @description Server Action de producción para obtener activos de la BAVI.
 * @version 4.0.0 (Absolute Type Safety & Elite Compliance)
 * @author L.I.A. Legacy
 */
"use server";

import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import type { BaviAsset } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import { RaZPromptsSesaTagsSchema } from "@/shared/lib/schemas/raz-prompts/atomic.schema";
import { mapSupabaseToBaviAsset } from "./_shapers/bavi.shapers";

const GetBaviAssetsInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(9),
  query: z.string().optional(),
  tags: RaZPromptsSesaTagsSchema.partial().optional(),
});

export type GetBaviAssetsInput = z.infer<typeof GetBaviAssetsInputSchema>;

export async function getBaviAssetsAction(
  input: GetBaviAssetsInput
): Promise<ActionResult<{ assets: BaviAsset[]; total: number }>> {
  const traceId = logger.startTrace("getBaviAssetsAction_v4.0");
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("[Action] Intento no autorizado.", { traceId });
    return { success: false, error: "auth_required" };
  }

  try {
    const validatedInput = GetBaviAssetsInputSchema.safeParse(input);
    if (!validatedInput.success) {
      return { success: false, error: "Parámetros de búsqueda inválidos." };
    }

    const { page, limit, query, tags } = validatedInput.data;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let queryBuilder = supabase
      .from("bavi_assets")
      .select("*, bavi_variants(*)", { count: "exact" })
      .eq("user_id", user.id);

    if (query) {
      queryBuilder = queryBuilder.or(
        `asset_id.ilike.%${query}%,keywords.cs.{${query}}`
      );
    }
    if (tags) {
      for (const key in tags) {
        const tagValue = tags[key as keyof typeof tags];
        if (tagValue) queryBuilder = queryBuilder.eq(`tags->>${key}`, tagValue);
      }
    }

    const { data, error, count } = await queryBuilder
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) throw new Error(error.message);

    const validAssets: BaviAsset[] = [];
    for (const row of data || []) {
      try {
        // --- [INICIO DE CORRECCIÓN DE TIPO] ---
        // La aserción 'as any' ya no es necesaria. El tipo de 'row' es ahora
        // inferido correctamente por TypeScript a partir de la consulta.
        const asset = mapSupabaseToBaviAsset(row, traceId);
        // --- [FIN DE CORRECCIÓN DE TIPO] ---
        validAssets.push(asset);
      } catch (validationError) {
        logger.warn(
          `[Guardián] Activo BAVI corrupto omitido (ID: ${row.asset_id}).`,
          {
            error:
              validationError instanceof Error
                ? validationError.message
                : "Error de validación",
            traceId,
          }
        );
      }
    }

    logger.success(
      `[Action] Activos obtenidos: ${validAssets.length} de ${count ?? 0}.`
    );
    return { success: true, data: { assets: validAssets, total: count ?? 0 } };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo al obtener activos de BAVI.", { error: msg });
    return {
      success: false,
      error: "No se pudieron cargar los activos de la biblioteca.",
    };
  } finally {
    logger.endTrace(traceId);
  }
}
