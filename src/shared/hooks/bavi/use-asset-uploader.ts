// RUTA: src/shared/hooks/bavi/use-asset-uploader.ts
/**
 * @file use-asset-uploader.ts
 * @description Hook "cerebro" soberano para la lógica de subida de activos a la BAVI.
 * @version 12.0.0 (Holistic Observability, Resilience & Contract Alignment)
 * @author L.I.A. Legacy
 */
"use client";

import {
  useState,
  useCallback,
  useEffect,
  useTransition,
  useMemo,
} from "react";
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

type UploaderContent = NonNullable<Dictionary["baviUploader"]>;
type SesaLabels = NonNullable<Dictionary["promptCreator"]>["sesaLabels"];
type SesaOptions = NonNullable<Dictionary["promptCreator"]>["sesaOptions"];

interface UseAssetUploaderProps {
  content: UploaderContent;
  sesaLabels: SesaLabels;
  sesaOptions: SesaOptions;
  onUploadSuccess?: () => void;
}

export function useAssetUploader({
  content,
  sesaLabels,
  sesaOptions,
  onUploadSuccess,
}: UseAssetUploaderProps) {
  const traceId = useMemo(
    () => logger.startTrace("useAssetUploader_Lifecycle_v12.0"),
    []
  );
  useEffect(() => {
    const groupId = logger.startGroup(
      `[useAssetUploader] Hook montado y listo.`
    );
    logger.info("Hook de subida de activos inicializado.", { traceId });
    return () => {
      logger.endGroup(groupId);
      logger.endTrace(traceId);
    };
  }, [traceId]);

  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadApiResponse | null>(
    null
  );
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId
  );
  const [extractedMetadata, setExtractedMetadata] = useState<Record<
    string,
    string | number
  > | null>(null);

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
      const groupId = logger.startGroup(
        "[AssetUploader] Procesando archivo soltado...",
        dropTraceId
      );
      try {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
          logger.traceEvent(dropTraceId, "Archivo seleccionado.", {
            name: selectedFile.name,
            size: selectedFile.size,
          });
          setFile(selectedFile);
          if (preview) URL.revokeObjectURL(preview);
          const previewUrl = URL.createObjectURL(selectedFile);
          setPreview(previewUrl);

          const baseName = selectedFile.name.split(".").slice(0, -1).join(".");
          const sanitizedBaseName = baseName
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-");

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = (data: AssetUploadMetadata) => {
    const submitTraceId = logger.startTrace("useAssetUploader.onSubmit");
    const groupId = logger.startGroup(
      `[AssetUploader] Procesando envío de formulario...`,
      submitTraceId
    );

    if (!file || !activeWorkspaceId) {
      toast.error("Error de Precondición", {
        description: "Falta el archivo o el workspace activo.",
      });
      logger.error(
        "[Guardián] Envío abortado: falta archivo o workspace activo.",
        { hasFile: !!file, hasWorkspace: !!activeWorkspaceId, traceId }
      );
      logger.endGroup(groupId);
      logger.endTrace(submitTraceId, { error: true });
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        const finalFile = new File([file], data.finalFileName, {
          type: file.type,
        });
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
          logger.success("[AssetUploader] Ingestión de activo exitosa.", {
            traceId: submitTraceId,
          });
          if (onUploadSuccess) {
            logger.traceEvent(
              submitTraceId,
              "Invocando callback onUploadSuccess..."
            );
            onUploadSuccess();
          }
        } else {
          toast.error("Error en la Ingestión del Activo", {
            description: result.error,
          });
          logger.error("[AssetUploader] Fallo en 'uploadAssetAction'.", {
            error: result.error,
            traceId: submitTraceId,
          });
        }
      } catch (exception) {
        const errorMessage =
          exception instanceof Error ? exception.message : "Error desconocido.";
        toast.error("Error Inesperado", {
          description: "Ocurrió un fallo no controlado.",
        });
        logger.error("[AssetUploader] Excepción no controlada.", {
          error: errorMessage,
          traceId: submitTraceId,
        });
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
