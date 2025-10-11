// src/shared/lib/actions/bavi/createAssetVariant.action.ts
/**
 * @file createAssetVariant.action.ts
 * @description Server Action para crear y persistir una nueva variante de un activo BAVI.
 * @version 1.1.0 (Reference Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

import { logger } from "@/shared/lib/logging";
import type { BaviVariantInsert } from "@/shared/lib/schemas/bavi/bavi.contracts";
import { createServerClient } from "@/shared/lib/supabase/server";
import type { ActionResult } from "@/shared/lib/types/actions.types";

const AssetTransformationsSchema = z.object({
  width: z.number().optional(),
  height: z.number().optional(),
  quality: z.union([z.number(), z.literal("auto")]),
  format: z.enum(["auto", "jpg", "png"]),
  removeBackground: z.boolean(),
  improve: z.boolean(),
});

const CreateVariantInputSchema = z.object({
  assetId: z.string(),
  workspaceId: z.string().uuid(),
  originalPublicId: z.string(),
  transformations: AssetTransformationsSchema,
});

type CreateVariantInput = z.infer<typeof CreateVariantInputSchema>;

export async function createAssetVariantAction(
  input: CreateVariantInput
): Promise<ActionResult<{ newVariantId: string }>> {
  const traceId = logger.startTrace("createAssetVariantAction_v1.1");
  const groupId = logger.startGroup(
    `[Action] Creando variante para activo: ${input.assetId}`
  );

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const validation = CreateVariantInputSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, error: "Datos de transformación inválidos." };
    }
    const { assetId, workspaceId, originalPublicId, transformations } =
      validation.data;

    const t: string[] = [];
    if (transformations.width) t.push(`w_${transformations.width}`);
    if (transformations.height) t.push(`h_${transformations.height}`);
    if (transformations.width || transformations.height) t.push("c_limit");
    t.push(`q_${transformations.quality}`);
    t.push(`f_${transformations.format}`);
    if (transformations.improve) t.push("e_improve");
    if (transformations.removeBackground) t.push("e_background_removal");
    const transformationString = t.join(",");
    const sourceUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformationString}/${originalPublicId}`;

    // --- [INICIO DE NIVELACIÓN DE LÓGICA v1.1.0] ---
    const newVariantId = `v${Date.now()}`; // Variable renombrada
    const newPublicId = `webvork/assets/${workspaceId}/${assetId}/${newVariantId}`; // Uso de la variable renombrada
    // --- [FIN DE NIVELACIÓN DE LÓGICA v1.1.0] ---

    logger.traceEvent(
      traceId,
      "Subiendo versión derivada a Cloudinary desde URL remota."
    );
    const uploadResponse = await cloudinary.uploader.upload(sourceUrl, {
      public_id: newPublicId,
    });

    // --- [INICIO DE NIVELACIÓN DE LÓGICA v1.1.0] ---
    const newVariantPayload: BaviVariantInsert = {
      asset_id: assetId,
      variant_id: newVariantId, // Uso de la variable renombrada
      public_id: uploadResponse.public_id,
      state: "enh",
      width: uploadResponse.width,
      height: uploadResponse.height,
    };
    // --- [FIN DE NIVELACIÓN DE LÓGICA v1.1.0] ---

    const { error: insertError } = await supabase
      .from("bavi_variants")
      .insert(newVariantPayload);
    if (insertError) throw insertError;

    // --- [INICIO DE NIVELACIÓN DE LÓGICA v1.1.0] ---
    logger.success(
      `[Action] Nueva variante '${newVariantId}' creada y persistida con éxito.`
    );
    // La propiedad abreviada ahora es válida.
    return { success: true, data: { newVariantId } };
    // --- [FIN DE NIVELACIÓN DE LÓGICA v1.1.0] ---
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Action] Fallo crítico al crear la variante.", {
      error: errorMessage,
      traceId,
    });
    return {
      success: false,
      error: "No se pudo guardar la nueva variante del activo.",
    };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
