// app/[locale]/(dev)/dev/campaign-suite/_actions/saveCampaignAsset.action.ts
/**
 * @file saveCampaignAsset.action.ts
 * @description Server Action para guardar un activo de campaña (ej. logo).
 *              Implementa el contrato de retorno estandarizado `ActionResult<T>`.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";

interface SaveAssetSuccessPayload {
  path: string;
}

/**
 * @function saveCampaignAssetAction
 * @description Recibe un archivo vía FormData, lo guarda en el directorio de
 *              activos de la campaña/variante y devuelve la ruta pública.
 * @returns {Promise<ActionResult<SaveAssetSuccessPayload>>}
 */
export async function saveCampaignAssetAction(
  campaignId: string,
  variantId: string,
  formData: FormData
): Promise<ActionResult<SaveAssetSuccessPayload>> {
  const file = formData.get("file") as File;
  if (!file) {
    logger.warn("[saveCampaignAssetAction] Intento de guardado sin archivo.");
    return { success: false, error: "No se proporcionó ningún archivo." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const assetsDir = path.join(
      process.cwd(),
      "content",
      "campaigns",
      campaignId,
      "assets",
      variantId
    );

    // Asegura que el directorio de destino exista
    await fs.mkdir(assetsDir, { recursive: true });

    const filePath = path.join(assetsDir, file.name);
    await fs.writeFile(filePath, buffer);

    // Devuelve la ruta pública que usará el componente <Image> de Next.js
    const publicPath = `/content/campaigns/${campaignId}/assets/${variantId}/${file.name}`;

    logger.success("Activo de campaña guardado con éxito.", {
      path: publicPath,
    });
    return { success: true, data: { path: publicPath } };
  } catch (error) {
    logger.error("Error al guardar el activo de campaña:", { error });
    return {
      success: false,
      error: "No se pudo guardar el archivo en el servidor.",
    };
  }
}
// app/[locale]/(dev)/dev/campaign-suite/_actions/saveCampaignAsset.action.ts
