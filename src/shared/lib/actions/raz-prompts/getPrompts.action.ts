// RUTA: src/shared/lib/actions/raz-prompts/getPrompts.action.ts
/**
 * @file getPrompts.action.ts
 * @description Server Action de élite que actúa como un Agregador de Datos,
 *              ahora completamente alineada con la Arquitectura de Contratos de Dominio Soberanos.
 * @version 13.0.0 (Sovereign Contract Aligned & Absolute Type Safety)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import {
  RaZPromptsEntrySchema,
  type RaZPromptsEntry,
} from "@/shared/lib/schemas/raz-prompts/entry.schema";
import { RaZPromptsSesaTagsSchema } from "@/shared/lib/schemas/raz-prompts/atomic.schema";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { logger } from "@/shared/lib/logging";
import type { RazPromptsEntryRow } from "@/shared/lib/schemas/raz-prompts/raz-prompts.contracts";

export type EnrichedRaZPromptsEntry = RaZPromptsEntry & {
  primaryImageUrl?: string;
};

const GetPromptsInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(9),
  query: z.string().optional(),
  tags: RaZPromptsSesaTagsSchema.partial().optional(),
});

export type GetPromptsInput = z.infer<typeof GetPromptsInputSchema>;

function mapSupabaseToCamelCase(supabaseEntry: RazPromptsEntryRow) {
  return {
    promptId: supabaseEntry.id,
    userId: supabaseEntry.user_id,
    workspaceId: supabaseEntry.workspace_id,
    title: supabaseEntry.title,
    status: supabaseEntry.status,
    aiService: supabaseEntry.ai_service,
    keywords: supabaseEntry.keywords,
    versions: supabaseEntry.versions,
    tags: supabaseEntry.tags,
    baviAssetIds: supabaseEntry.bavi_asset_ids,
    createdAt: supabaseEntry.created_at,
    updatedAt: supabaseEntry.updated_at,
  };
}

export async function getPromptsAction(
  input: GetPromptsInput
): Promise<
  ActionResult<{ prompts: EnrichedRaZPromptsEntry[]; total: number }>
> {
  const traceId = logger.startTrace("getPromptsAction_v13.0");
  logger.startGroup(`[Action] Obteniendo prompts...`, traceId);

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "auth_required" };
    }
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const validatedInput = GetPromptsInputSchema.safeParse(input);
    if (!validatedInput.success) {
      return { success: false, error: "Parámetros de búsqueda inválidos." };
    }
    const { page, limit, query, tags } = validatedInput.data;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let queryBuilder = supabase
      .from("razprompts_entries")
      .select("*, count()", { count: "exact" })
      .eq("user_id", user.id);

    if (query) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,keywords.cs.{${query.split(" ").join(",")}}`
      );
    }
    if (tags) {
      Object.entries(tags).forEach(([key, tagValue]) => {
        if (tagValue) {
          queryBuilder = queryBuilder.eq(`tags->>${key}`, tagValue);
        }
      });
    }

    const { data, error, count } = await queryBuilder
      .order("updated_at", { ascending: false })
      .range(start, end);

    if (error) throw new Error(error.message);
    const rawDataFromDb = (data as RazPromptsEntryRow[]) || [];

    const validatedPrompts: RaZPromptsEntry[] = rawDataFromDb
      .map(mapSupabaseToCamelCase)
      .map((item) => {
        const validation = RaZPromptsEntrySchema.safeParse(item);
        if (!validation.success) {
          logger.warn(
            `[Guardián] Dato de prompt corrupto ignorado: ${item.promptId}`,
            { errors: validation.error.flatten(), traceId }
          );
          return null;
        }
        return validation.data;
      })
      .filter((p): p is RaZPromptsEntry => p !== null);

    const assetIdsToFetch = Array.from(
      new Set(
        validatedPrompts
          .map((p) => p.baviAssetIds?.[0])
          .filter((id): id is string => !!id)
      )
    );

    const assetIdToPublicIdMap = new Map<string, string>();
    if (assetIdsToFetch.length > 0) {
      const { data: variantsData, error: variantsError } = await supabase
        .from("bavi_variants")
        .select("asset_id, public_id")
        .in("asset_id", assetIdsToFetch)
        .eq("state", "orig");

      if (variantsError) {
        logger.error(
          "[Action] Fallo al obtener variantes de BAVI, el enriquecimiento será parcial.",
          { error: variantsError.message, traceId }
        );
      } else if (variantsData) {
        for (const variant of variantsData) {
          assetIdToPublicIdMap.set(variant.asset_id, variant.public_id);
        }
      }
    }

    const enrichedPrompts = validatedPrompts.map(
      (prompt): EnrichedRaZPromptsEntry => {
        const primaryAssetId = prompt.baviAssetIds?.[0];
        if (primaryAssetId && assetIdToPublicIdMap.has(primaryAssetId)) {
          const publicId = assetIdToPublicIdMap.get(primaryAssetId);
          return {
            ...prompt,
            primaryImageUrl: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_400/${publicId}`,
          };
        }
        return prompt;
      }
    );

    return {
      success: true,
      data: { prompts: enrichedPrompts, total: count ?? 0 },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al obtener prompts.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: `No se pudieron cargar los prompts: ${errorMessage}`,
    };
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
