// src/shared/hooks/bavi/useAssetEditor.ts
/**
 * @file useAssetEditor.ts
 * @description Hook "cerebro" para la lógica del editor de activos de BAVI.
 *              Forjado con seguridad de tipos absoluta, observabilidad hiper-granular
 *              y un flujo de trabajo transaccional para la creación de variantes.
 * @version 2.0.0 (Logical Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import {
  useState,
  useCallback,
  useTransition,
  useMemo,
  useEffect,
} from "react";
import { toast } from "sonner";

import { createAssetVariantAction } from "@/shared/lib/actions/bavi/createAssetVariant.action";
import { logger } from "@/shared/lib/logging";
import type { BaviAsset } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";

export interface AssetTransformations {
  width?: number;
  height?: number;
  quality: number | "auto";
  format: "auto" | "jpg" | "png";
  removeBackground: boolean;
  improve: boolean;
}

export function useAssetEditor(
  asset: BaviAsset | null,
  onSaveSuccess: () => void
) {
  const traceId = useMemo(
    () => logger.startTrace("useAssetEditor_Lifecycle_v2.0"),
    []
  );
  const [isPending, startTransition] = useTransition();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId
  );

  const [transformations, setTransformations] = useState<AssetTransformations>({
    quality: "auto",
    format: "auto",
    removeBackground: false,
    improve: false,
  });

  useEffect(() => {
    logger.info("[useAssetEditor] Hook montado y operacional.", {
      traceId,
      assetId: asset?.assetId,
    });
    setTransformations({
      quality: "auto",
      format: "auto",
      removeBackground: false,
      improve: false,
    });
    return () => {
      logger.endTrace(traceId);
    };
  }, [asset, traceId]);

  const updateTransformation = useCallback(
    <K extends keyof AssetTransformations>(
      key: K,
      value: AssetTransformations[K]
    ) => {
      setTransformations((prev) => {
        logger.traceEvent(
          traceId,
          "Mutación de Estado: Transformación actualizada",
          {
            key,
            from: prev[key],
            to: value,
          }
        );
        return { ...prev, [key]: value };
      });
    },
    [traceId]
  );

  const handleSaveAsVariant = () => {
    if (!asset || !activeWorkspaceId || asset.variants.length === 0) {
      const errorMsg =
        "Precondición fallida: falta activo, workspace o variante original.";
      logger.error(`[useAssetEditor] ${errorMsg}`, {
        assetExists: !!asset,
        workspaceExists: !!activeWorkspaceId,
        traceId,
      });
      toast.error("Error de Precondición", {
        description: "No se puede guardar la variante.",
      });
      return;
    }

    logger.traceEvent(traceId, "Intención de Usuario: Guardar como Variante");
    startTransition(async () => {
      const groupId = logger.startGroup(
        `[useAssetEditor] Persistiendo variante para asset: ${asset.assetId}`
      );

      // --- [INICIO DE NIVELACIÓN DE LÓGICA v2.0.0] ---
      const result = await createAssetVariantAction({
        assetId: asset.assetId,
        workspaceId: activeWorkspaceId,
        originalPublicId: asset.variants[0].publicId, // Acceso correcto al publicId
        transformations,
      });
      // --- [FIN DE NIVELACIÓN DE LÓGICA v2.0.0] ---

      if (result.success) {
        logger.success(`[useAssetEditor] Server Action completada.`, {
          traceId,
          newVariantId: result.data.newVariantId,
        });
        toast.success("Nueva variante guardada con éxito.", {
          description: `ID de la variante: ${result.data.newVariantId}`,
        });
        onSaveSuccess();
      } else {
        logger.error(`[useAssetEditor] Server Action falló.`, {
          traceId,
          error: result.error,
        });
        toast.error("Error al guardar la variante", {
          description: result.error,
        });
      }
      logger.endGroup(groupId);
    });
  };

  const getTransformedUrl = useCallback(() => {
    if (!asset || asset.variants.length === 0) return "";

    // --- [INICIO DE NIVELACIÓN DE LÓGICA v2.0.0] ---
    const publicId = asset.variants[0].publicId; // Acceso correcto al publicId
    // --- [FIN DE NIVELACIÓN DE LÓGICA v2.0.0] ---
    const t: string[] = [];

    if (transformations.width) t.push(`w_${transformations.width}`);
    if (transformations.height) t.push(`h_${transformations.height}`);
    if (transformations.width || transformations.height) t.push("c_limit");
    if (transformations.quality) t.push(`q_${transformations.quality}`);
    if (transformations.format) t.push(`f_${transformations.format}`);
    if (transformations.improve) t.push("e_improve");
    if (transformations.removeBackground) t.push("e_background_removal");

    const transformationString = t.join(",");
    const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

    return transformationString
      ? `${baseUrl}/${transformationString}/${publicId}`
      : `${baseUrl}/${publicId}`;
  }, [asset, transformations]);

  return {
    transformations,
    updateTransformation,
    getTransformedUrl,
    handleSaveAsVariant,
    isPending,
  };
}
