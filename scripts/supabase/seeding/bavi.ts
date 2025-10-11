// RUTA: scripts/supabase/seeding/bavi.ts
/**
 * @file bavi.ts
 * @description Script de siembra para poblar las tablas de la BAVI en Supabase,
 *              ahora con observabilidad y resiliencia de élite.
 * @version 8.1.0 (Logger v20+ Contract Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import { promises as fs } from "fs";
import * as path from "path";

import type { User } from "@supabase/supabase-js";
import { z } from "zod";

import type { Json } from "@/shared/lib/supabase/database.types";

import type {
  BaviAssetInsert,
  BaviVariantInsert,
} from "../../../src/shared/lib/schemas/bavi/bavi.contracts";
import { scriptLogger as logger } from "../../_utils/logger";
import { createScriptClient } from "../../_utils/supabaseClient";
import type { ScriptActionResult as ActionResult } from "../../_utils/types";

const BaviVariantSchema = z.object({
  versionId: z.string(),
  publicId: z.string(),
  state: z.enum(["orig", "enh"]),
  dimensions: z.object({ width: z.number(), height: z.number() }),
});

const BaviAssetSchema = z.object({
  assetId: z.string(),
  status: z.enum(["active", "archived", "pending"]),
  provider: z.enum(["cloudinary"]),
  description: z.string().optional(),
  tags: z.any().optional(),
  variants: z.array(BaviVariantSchema).min(1),
  metadata: z.object({ altText: z.record(z.string()) }),
  promptId: z.string().min(1).nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const BaviManifestSchema = z.object({
  assets: z.array(BaviAssetSchema),
});

export default async function seedBavi(): Promise<
  ActionResult<{ seededAssets: number }>
> {
  const traceId = logger.startTrace("seedBavi_v8.1");
  const groupId = logger.startGroup(
    "🌱 Iniciando siembra de DB para BAVI (Holistic)..."
  );

  try {
    const supabaseAdmin = createScriptClient();
    const superUserEmail = "superuser@webvork.dev";

    const {
      data: { users },
      error: userError,
    } = await supabaseAdmin.auth.admin.listUsers();
    if (userError)
      throw new Error(`Error al listar usuarios: ${userError.message}`);

    const superUser = users.find((user: User) => user.email === superUserEmail);
    if (!superUser)
      throw new Error(
        `Superusuario con email '${superUserEmail}' no encontrado.`
      );

    const { data: workspace, error: workspaceError } = await supabaseAdmin
      .from("workspaces")
      .select("id")
      .eq("owner_id", superUser.id)
      .single();
    if (workspaceError || !workspace)
      throw new Error(`Workspace para superusuario no encontrado.`);

    logger.success(
      `Superusuario y Workspace encontrados. ID Usuario: ${superUser.id}, ID Workspace: ${workspace.id}`
    );

    const manifestPath = path.join(
      process.cwd(),
      "content/bavi/bavi.manifest.json"
    );
    const manifestContent = await fs.readFile(manifestPath, "utf-8");
    const manifest = BaviManifestSchema.parse(JSON.parse(manifestContent));

    logger.info(
      `Se encontraron ${manifest.assets.length} activos en el manifiesto para sembrar.`
    );
    let seededCount = 0;

    for (const asset of manifest.assets) {
      const assetPayload: BaviAssetInsert = {
        asset_id: asset.assetId,
        provider: asset.provider,
        status: asset.status,
        description: asset.description,
        prompt_id: asset.promptId,
        tags: asset.tags as Json,
        metadata: asset.metadata as Json,
        user_id: superUser.id,
        workspace_id: workspace.id,
        created_at: asset.createdAt,
        updated_at: asset.updatedAt,
      };

      const { error: assetError } = await supabaseAdmin
        .from("bavi_assets")
        .upsert(assetPayload);
      if (assetError) {
        logger.error(`Error al sembrar el activo ${asset.assetId}:`, {
          error: assetError,
        });
        continue;
      }

      for (const variant of asset.variants) {
        const variantPayload: BaviVariantInsert = {
          variant_id: variant.versionId,
          asset_id: asset.assetId,
          public_id: variant.publicId,
          state: variant.state,
          width: variant.dimensions.width,
          height: variant.dimensions.height,
        };
        const { error: variantError } = await supabaseAdmin
          .from("bavi_variants")
          .upsert(variantPayload);
        if (variantError)
          logger.error(`Error al sembrar la variante ${variant.versionId}:`, {
            error: variantError,
          });
      }
      seededCount++;
    }

    logger.success(
      `Siembra de BAVI completada. ${seededCount} activos procesados.`
    );
    return { success: true, data: { seededAssets: seededCount } };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("Fallo catastrófico en el script de siembra de BAVI.", {
      error: errorMessage,
      traceId,
    });
    return { success: false, error: errorMessage };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
