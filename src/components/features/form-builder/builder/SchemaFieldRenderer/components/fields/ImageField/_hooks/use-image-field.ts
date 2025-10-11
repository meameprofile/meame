// RUTA: src/components/features/form-builder/builder/SchemaFieldRenderer/components/fields/ImageField/_hooks/use-image-field.ts
/**
 * @file use-image-field.ts
 * @description Hook "cerebro" puro para la lógica de acciones del ImageField.
 *              v5.0.0 (Elite Observability & Resilience): Inyectado con un sistema
 *              de tracing completo y guardianes de resiliencia para una operación robusta.
 * @version 5.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import type { FieldValues, Path } from "react-hook-form";
import { toast } from "sonner";

import { useDraftMetadataStore } from "@/shared/hooks/campaign-suite/use-draft-metadata.store";
import { saveCampaignAssetAction } from "@/shared/lib/actions/campaign-suite/saveCampaignAsset.action";
import { logger } from "@/shared/lib/logging";
import type { BaviAsset } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";

export function useImageField<TFieldValues extends FieldValues>(
  onValueChange: (field: Path<TFieldValues>, value: unknown) => void,
  fieldName: Path<TFieldValues>
) {
  const traceId = useMemo(
    () => logger.startTrace("useImageField_Lifecycle"),
    []
  );
  useEffect(() => {
    logger.info("[useImageField] Hook montado y listo.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const { baseCampaignId, draftId } = useDraftMetadataStore();
  const [isUploading, setIsUploading] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const handleImageUpload = useCallback(
    async (formData: FormData) => {
      // --- GUARDIÁN DE CONTEXTO ---
      if (!baseCampaignId || !draftId) {
        const errorMsg =
          "ID de borrador no encontrado. Guarda el Paso 0 para habilitar la subida.";
        logger.error(`[Guardián] ${errorMsg}`, { traceId });
        toast.error("Error de Contexto", { description: errorMsg });
        return;
      }

      setIsUploading(true);
      logger.traceEvent(traceId, "Iniciando subida de activo de campaña...");
      const result = await saveCampaignAssetAction(
        baseCampaignId,
        draftId,
        formData
      );
      setIsUploading(false);

      if (result.success) {
        onValueChange(fieldName, result.data.path);
        toast.success("Imagen subida con éxito.");
        logger.success(
          `[useImageField] Activo subido y campo actualizado: ${result.data.path}`,
          { traceId }
        );
      } else {
        toast.error("Fallo al subir imagen", { description: result.error });
        logger.error("[useImageField] Fallo en saveCampaignAssetAction.", {
          error: result.error,
          traceId,
        });
      }
    },
    [baseCampaignId, draftId, fieldName, onValueChange, traceId]
  );

  const handleRemoveImage = useCallback(() => {
    logger.traceEvent(traceId, "Acción: Eliminar imagen del campo.");
    onValueChange(fieldName, null);
    toast.info("Imagen eliminada del campo.");
  }, [fieldName, onValueChange, traceId]);

  const handleAssetSelected = useCallback(
    (asset: BaviAsset) => {
      logger.traceEvent(
        traceId,
        `Acción: Activo BAVI seleccionado: ${asset.assetId}`
      );
      const primaryVariant = asset.variants.find((v) => v.state === "orig");

      // --- GUARDIÁN DE RESILIENCIA DE ACTIVO ---
      if (!primaryVariant?.publicId) {
        const errorMsg =
          "El activo seleccionado no tiene una variante principal válida.";
        logger.error(`[Guardián] ${errorMsg}`, { asset, traceId });
        toast.error("Activo Inválido", { description: errorMsg });
        return;
      }

      const imageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${primaryVariant.publicId}`;
      onValueChange(fieldName, imageUrl);
      setIsSelectorOpen(false);
      toast.success(`Activo "${asset.assetId}" seleccionado.`);
      logger.success(
        `[useImageField] Campo actualizado con URL de BAVI: ${imageUrl}`,
        { traceId }
      );
    },
    [fieldName, onValueChange, traceId]
  );

  return {
    isUploading,
    isSelectorOpen,
    setIsSelectorOpen,
    handleImageUpload,
    handleRemoveImage,
    handleAssetSelected,
  };
}
