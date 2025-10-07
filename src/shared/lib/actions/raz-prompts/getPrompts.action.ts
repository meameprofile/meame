// RUTA: src/shared/lib/actions/raz-prompts/getPrompts.action.ts
/**
 * @file getPrompts.action.ts
 * @description Server Action (Agregador) para obtener y enriquecer prompts.
 * @version 14.4.0 (Observability Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import { type RaZPromptsEntry } from "@/shared/lib/schemas/raz-prompts/entry.schema";
import { RaZPromptsSesaTagsSchema } from "@/shared/lib/schemas/raz-prompts/atomic.schema";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { logger } from "@/shared/lib/logging";
import type { RazPromptsEntryRow } from "@/shared/lib/schemas/raz-prompts/raz-prompts.contracts";
import { mapSupabaseToCamelCase } from "./_shapers/raz-prompts.shapers";

export type EnrichedRaZPromptsEntry = RaZPromptsEntry & {
  primaryImageUrl?: string;
};

const GetPromptsInputSchema = z.object({
  workspaceId: z.string().uuid("Se requiere un ID de workspace válido."),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(9),
  query: z.string().optional(),
  tags: RaZPromptsSesaTagsSchema.partial().optional(),
});

export type GetPromptsInput = z.infer<typeof GetPromptsInputSchema>;

export async function getPromptsAction(
  input: GetPromptsInput
): Promise<
  ActionResult<{ prompts: EnrichedRaZPromptsEntry[]; total: number }>
> {
  const traceId = logger.startTrace("getPromptsAction_v14.4");
  const groupId = logger.startGroup(
    `[Action] Obteniendo y enriqueciendo prompts...`,
    traceId
  );

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };

    const validatedInput = GetPromptsInputSchema.safeParse(input);
    if (!validatedInput.success)
      return { success: false, error: "Parámetros inválidos." };

    const { page, limit, query, tags, workspaceId } = validatedInput.data;

    const { data: memberCheck, error: memberError } = await supabase.rpc(
      "is_workspace_member",
      { workspace_id_to_check: workspaceId }
    );
    if (memberError || !memberCheck)
      throw new Error("Acceso denegado al workspace.");

    let queryBuilder = supabase
      .from("razprompts_entries")
      .select("*, count()", { count: "exact" })
      .eq("workspace_id", workspaceId);

    if (query)
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,keywords.cs.{${query.split(" ").join(",")}}`
      );
    if (tags)
      Object.entries(tags).forEach(
        ([k, v]) => v && queryBuilder.eq(`tags->>${k}`, v)
      );

    const { data, error, count } = await queryBuilder
      .order("updated_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw new Error(error.message);

    const validatedPrompts: RaZPromptsEntry[] = (
      (data as RazPromptsEntryRow[]) || []
    )
      .map((row) => {
        try {
          return mapSupabaseToCamelCase(row, traceId);
        } catch {
          return null;
        }
      })
      .filter((p): p is RaZPromptsEntry => p !== null);

    const assetIdsToFetch = Array.from(
      new Set(
        validatedPrompts.flatMap((p) =>
          p.baviAssetIds?.[0] ? [p.baviAssetIds[0]] : []
        )
      )
    );

    const assetIdToPublicIdMap = new Map<string, string>();

    if (assetIdsToFetch.length > 0) {
      const { data: variantsData, error: variantsError } = await supabase
        .from("bavi_variants")
        .select("asset_id, public_id")
        .in("asset_id", assetIdsToFetch)
        .eq("state", "orig");

      if (variantsError)
        logger.warn("[Action] Fallo parcial al obtener variantes de BAVI.", {
          error: variantsError.message,
          traceId,
        });
      else
        variantsData?.forEach((v) =>
          assetIdToPublicIdMap.set(v.asset_id, v.public_id)
        );
    }

    const enrichedPrompts = validatedPrompts.map((prompt) => {
      const primaryAssetId = prompt.baviAssetIds?.[0];
      if (primaryAssetId && assetIdToPublicIdMap.has(primaryAssetId)) {
        const publicId = assetIdToPublicIdMap.get(primaryAssetId);
        return {
          ...prompt,
          primaryImageUrl: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_400/${publicId}`,
        };
      }
      return prompt;
    });

    return {
      success: true,
      data: { prompts: enrichedPrompts, total: count ?? 0 },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al obtener prompts.", {
      error: msg,
      traceId,
    });
    return {
      success: false,
      error: `No se pudieron cargar los prompts: ${msg}`,
    };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
