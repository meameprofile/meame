// RUTA: src/shared/hooks/bavi/use-asset-uploader.ts
/**
 * @file use-asset-uploader.ts
 * @description Hook "cerebro" soberano para la lógica de subida de activos a la BAVI.
 * @version 8.0.0 (Holistic Elite Leveling)
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
}

export function useAssetUploader({
  content,
  sesaLabels,
  sesaOptions,
}: UseAssetUploaderProps) {
  const traceId = useMemo(() => logger.startTrace("useAssetUploader_v8.0"), []);
  useEffect(() => {
    logger.info("[useAssetUploader] Hook montado.", { traceId });
    return () => logger.endTrace(traceId);
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
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        logger.traceEvent(traceId, "Archivo seleccionado vía dropzone.", {
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
          .replace(/[^a-z0-9]/g, "-");

        form.setValue("finalFileName", selectedFile.name);
        form.setValue("assetId", `i-generic-${sanitizedBaseName}-01`);
        setExtractedMetadata({
          Tipo: selectedFile.type,
          Tamaño: `${(selectedFile.size / 1024).toFixed(2)} KB`,
          Modificado: new Date(selectedFile.lastModified).toLocaleString(),
        });
      }
    },
    [form, preview, traceId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  const onSubmit = (data: AssetUploadMetadata) => {
    const submitTraceId = logger.startTrace("useAssetUploader.onSubmit");
    logger.startGroup(`[AssetUploader] Procesando envío...`, submitTraceId);

    if (!file) {
      toast.error("Ningún archivo seleccionado.");
      logger.endGroup();
      return;
    }
    if (!activeWorkspaceId) {
      toast.error("Error de contexto", {
        description: "No hay un workspace activo.",
      });
      logger.error("[Guardián] Envío abortado: falta workspaceId.", {
        traceId: submitTraceId,
      });
      logger.endGroup();
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      const finalFile = new File([file], data.finalFileName, {
        type: file.type,
      });
      formData.append("file", finalFile);
      formData.append("metadata", JSON.stringify(data));
      formData.append("workspaceId", activeWorkspaceId);

      logger.traceEvent(submitTraceId, "Invocando uploadAssetAction...");
      const result = await uploadAssetAction(formData);

      if (result.success) {
        toast.success("¡Ingestión del activo completada!");
        setUploadResult(result.data);
        form.reset();
        setFile(null);
        setPreview(null);
        setExtractedMetadata(null);
        logger.success("[AssetUploader] Ingestión de activo exitosa.", {
          traceId: submitTraceId,
        });
      } else {
        toast.error("Error de ingestión", { description: result.error });
        logger.error("[AssetUploader] Fallo en la ingestión.", {
          error: result.error,
          traceId: submitTraceId,
        });
      }
      logger.endGroup();
      logger.endTrace(submitTraceId);
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
