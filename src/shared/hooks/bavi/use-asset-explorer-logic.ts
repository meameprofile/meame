// RUTA: src/shared/hooks/bavi/use-asset-uploader.ts
/**
 * @file use-asset-uploader.ts
 * @description Hook "cerebro" soberano para la lógica de subida de activos a la BAVI.
 *              Este aparato encapsula toda la gestión de estado del formulario (react-hook-form),
 *              la lógica de arrastrar y soltar (react-dropzone), y la orquestación
 *              de la acción de servidor para la ingesta de activos.
 *
 * @version 10.0.0 (Holistic Observability & Elite Documentation)
 * @author L.I.A. Legacy
 *
 * @architecture_notes
 * - **Pilar I (Hiper-Atomización)**: Abstrae toda la complejidad lógica del componente de
 *   presentación `AssetUploaderForm`, que se convierte en un componente "puro".
 * - **Pilar II (Contrato Estricto)**: Utiliza `zodResolver` para una validación de formulario
 *   robusta y segura a nivel de tipos.
 * - **Pilar III (Observabilidad Profunda)**: Implementa un sistema de tracing anidado. Un
 *   `traceId` principal monitorea el ciclo de vida del hook, mientras que trazas
 *   atómicas y eventos granulares monitorean cada acción del usuario.
 * - **Pilar VI (Documentación Soberana)**: Proporciona documentación TSDoc/JSDoc exhaustiva
 *   para el hook, sus parámetros y cada propiedad de su valor de retorno.
 * - **Pilar VIII (Resiliencia)**: Incluye guardianes de contrato para validar la
 *   existencia de un `workspaceId` activo antes de intentar una subida.
 */
"use client";

import { useState, useCallback, useEffect, useTransition, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import type { UploadApiResponse } from "cloudinary";
import { uploadAssetAction } from "@/shared/lib/actions/bavi";
import {
  assetUploadMetadataSchema,
  type AssetUploadMetadata,
} from "@/shared/lib/schemas/bavi/upload.schema";
import { useWorkspaceStore } from "@/shared/lib/stores/use-workspace.store";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { logger } from "@/shared/lib/logging";

// --- Contratos de Tipo para el Hook ---

type UploaderContent = NonNullable<Dictionary["baviUploader"]>;
type SesaLabels = NonNullable<Dictionary["promptCreator"]>["sesaLabels"];
type SesaOptions = NonNullable<Dictionary["promptCreator"]>["sesaOptions"];

interface UseAssetUploaderProps {
  content: UploaderContent;
  sesaLabels: SesaLabels;
  sesaOptions: SesaOptions;
}

/**
 * @function useAssetUploader
 * @description Hook "cerebro" que encapsula toda la lógica para el componente de subida de activos.
 * @param {UseAssetUploaderProps} props - Propiedades de configuración y contenido i18n.
 * @returns Un objeto que contiene el estado del formulario, manejadores de eventos y
 *          todas las propiedades necesarias para el componente de presentación.
 */
export function useAssetUploader({
  content,
  sesaLabels,
  sesaOptions,
}: UseAssetUploaderProps) {
  const traceId = useMemo(() => logger.startTrace("useAssetUploader_Lifecycle_v10.0"), []);
  useEffect(() => {
    const groupId = logger.startGroup(`[useAssetUploader] Hook montado y listo.`);
    return () => {
      logger.endGroup(groupId);
      logger.endTrace(traceId);
    };
  }, [traceId]);

  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadApiResponse | null>(null);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const [extractedMetadata, setExtractedMetadata] = useState<Record<string, string | number> | null>(null);

  const form = useForm<AssetUploadMetadata>({
    resolver: zodResolver(assetUploadMetadataSchema),
    defaultValues: {
      finalFileName: "",
      assetId: "",
      keywords: [],
      sesaTags: {},
      altText: { "it-IT": "" },
      promptId: "",
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const dropTraceId = logger.startTrace("useAssetUploader.onDrop");
      const groupId = logger.startGroup("[AssetUploader] Procesando archivo soltado...", dropTraceId);
      try {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
          logger.traceEvent(dropTraceId, "Archivo seleccionado.", { name: selectedFile.name, size: selectedFile.size });
          setFile(selectedFile);
          if (preview) URL.revokeObjectURL(preview);
          const previewUrl = URL.createObjectURL(selectedFile);
          setPreview(previewUrl);

          const baseName = selectedFile.name.split(".").slice(0, -1).join(".");
          const sanitizedBaseName = baseName.toLowerCase().replace(/[^a-z0-9]/g, "-");

          form.setValue("finalFileName", selectedFile.name);
          form.setValue("assetId", `i-generic-${sanitizedBaseName}-01`);
          setExtractedMetadata({
            Tipo: selectedFile.type,
            Tamaño: `${(selectedFile.size / 1024).toFixed(2)} KB`,
            Modificado: new Date(selectedFile.lastModified).toLocaleString(),
          });
        }
      } finally {
        logger.endGroup(groupId);
        logger.endTrace(dropTraceId);
      }
    },
    [form, preview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });

  useEffect(() => {
    // Limpieza del objeto URL para prevenir fugas de memoria.
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = (data: AssetUploadMetadata) => {
    const submitTraceId = logger.startTrace("useAssetUploader.onSubmit");
    const groupId = logger.startGroup(`[AssetUploader] Procesando envío de formulario...`, submitTraceId);

    if (!file) {
      toast.error("Ningún archivo seleccionado para subir.");
      logger.endGroup(groupId);
      logger.endTrace(submitTraceId, { error: true });
      return;
    }
    if (!activeWorkspaceId) {
      toast.error("Error de Contexto", { description: "No hay un workspace activo para asociar el activo." });
      logger.error("[Guardián] Envío abortado: falta workspaceId.", { traceId: submitTraceId });
      logger.endGroup(groupId);
      logger.endTrace(submitTraceId, { error: true });
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        // Se reconstruye el objeto File con el nombre final para que el servidor lo reciba correctamente.
        const finalFile = new File([file], data.finalFileName, { type: file.type });
        formData.append("file", finalFile);
        formData.append("metadata", JSON.stringify(data));
        formData.append("workspaceId", activeWorkspaceId);

        logger.traceEvent(submitTraceId, "Invocando 'uploadAssetAction'...");
        const result = await uploadAssetAction(formData);

        if (result.success) {
          toast.success("¡Ingestión del activo completada con éxito!");
          setUploadResult(result.data);
          form.reset();
          setFile(null);
          setPreview(null);
          setExtractedMetadata(null);
          logger.success("[AssetUploader] Ingestión de activo exitosa.", { traceId: submitTraceId });
        } else {
          toast.error("Error en la Ingestión del Activo", { description: result.error });
          logger.error("[AssetUploader] Fallo en la acción 'uploadAssetAction'.", { error: result.error, traceId: submitTraceId });
        }
      } catch (exception) {
        const errorMessage = exception instanceof Error ? exception.message : "Error desconocido.";
        toast.error("Error Inesperado", { description: "Ocurrió un fallo no controlado." });
        logger.error("[AssetUploader] Excepción no controlada durante la subida.", { error: errorMessage, traceId: submitTraceId });
      } finally {
        logger.endGroup(groupId);
        logger.endTrace(submitTraceId);
      }
    });
  };

  const sesaContentForForm = { sesaLabels, sesaOptions };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
    preview,
    uploadResult,
    getRootProps,
    getInputProps,
    isDragActive,
    content,
    sesaContent: sesaContentForForm,
    extractedMetadata,
  };
}
