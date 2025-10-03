// RUTA: src/shared/lib/actions/bavi/getBaviAssets.action.ts
/**
 * @file getBaviAssets.action.ts
 * @description Server Action de producción para obtener una lista paginada y
 *              filtrada de activos de la BAVI, consultando directamente Supabase.
 * @version 2.1.0 (Type-Safe & Linter-Compliant)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { z } from "zod";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import {
  BaviAssetSchema,
  type BaviAsset,
} from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import {
  RaZPromptsSesaTagsSchema,
  type RaZPromptsSesaTags,
} from "@/shared/lib/schemas/raz-prompts/atomic.schema";
// Se elimina la importación no utilizada.
// import { normalizeKeywords } from "@/shared/lib/utils/search/keyword-normalizer";

// --- [INICIO DE REFACTORIZACIÓN DE ÉLITE: CONTRATOS DE TIPO SOBERANOS] ---
// Contratos que modelan la respuesta de Supabase con snake_case.
interface SupabaseBaviVariant {
  variant_id: string;
  public_id: string;
  state: "orig" | "enh";
  width: number;
  height: number;
}

interface SupabaseBaviAsset {
  asset_id: string;
  provider: "cloudinary";
  prompt_id: string | null;
  tags: Partial<RaZPromptsSesaTags> | null;
  metadata: { altText?: Record<string, string> } | null;
  created_at: string;
  updated_at: string;
  bavi_variants: SupabaseBaviVariant[];
}
// --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---

const GetBaviAssetsInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  query: z.string().optional(),
  tags: RaZPromptsSesaTagsSchema.partial().optional(),
});

export type GetBaviAssetsInput = z.infer<typeof GetBaviAssetsInputSchema>;

export async function getBaviAssetsAction(
  input: GetBaviAssetsInput
): Promise<ActionResult<{ assets: BaviAsset[]; total: number }>> {
  const traceId = logger.startTrace("getBaviAssetsAction_v2.1");
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("[Action] Intento no autorizado de obtener activos BAVI.", {
      traceId,
    });
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
      // Futura implementación de búsqueda por palabras clave aquí.
    }

    if (tags) {
      for (const key in tags) {
        const tagValue = tags[key as keyof RaZPromptsSesaTags];
        if (tagValue) {
          queryBuilder = queryBuilder.eq(`tags->>${key}`, tagValue);
        }
      }
    }

    const { data, error, count } = await queryBuilder
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) throw new Error(error.message);

    // Se aplica el tipo soberano a la respuesta de la base de datos.
    const reshapedAssets = (data as SupabaseBaviAsset[]).map(
      (asset: SupabaseBaviAsset): BaviAsset => {
        // <-- Tipo explícito para 'asset'
        const transformedAsset = {
          assetId: asset.asset_id,
          provider: asset.provider,
          promptId: asset.prompt_id ?? undefined,
          tags: asset.tags ?? undefined,
          variants: asset.bavi_variants.map((v: SupabaseBaviVariant) => ({
            // <-- Tipo explícito para 'v'
            versionId: v.variant_id,
            publicId: v.public_id,
            state: v.state,
            dimensions: { width: v.width, height: v.height },
          })),
          metadata: asset.metadata ?? { altText: {} },
          createdAt: asset.created_at,
          updatedAt: asset.updated_at,
        };
        return BaviAssetSchema.parse(transformedAsset);
      }
    );

    logger.success(
      `[getBaviAssetsAction] Activos obtenidos: ${reshapedAssets.length} de ${
        count ?? 0
      }.`
    );
    return {
      success: true,
      data: { assets: reshapedAssets, total: count ?? 0 },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[getBaviAssetsAction] Fallo al obtener activos de BAVI.", {
      error: errorMessage,
    });
    return {
      success: false,
      error: "No se pudieron cargar los activos de la biblioteca.",
    };
  } finally {
    logger.endTrace(traceId);
  }
}
