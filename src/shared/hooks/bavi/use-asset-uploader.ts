// RUTA: src/shared/hooks/bavi/use-asset-uploader.ts
/**
 * @file use-asset-uploader.ts
 * @description Hook "cerebro" soberano para la lógica de subida de activos a la BAVI.
 *              v6.0.0 (Data Contract Alignment & Elite Observability): Se corrige la
 *              estructura de datos de `sesaContent` para alinearla con el contrato
 *              del componente de presentación, resolviendo el error TS2322.
 *              Inyectado con observabilidad de ciclo de vida completo.
 * @version 6.0.0
 *@author RaZ Podestá - MetaShark Tech
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
  const traceId = useMemo(
    () => logger.startTrace("useAssetUploader_Lifecycle_v6.0"),
    []
  );
  useEffect(() => {
    logger.info("[useAssetUploader] Hook montado y listo.", { traceId });
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

  const form = useForm<AssetUploadMetadata>({
    resolver: zodResolver(assetUploadMetadataSchema),
    defaultValues: {
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
        setFile(selectedFile);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(selectedFile));
        const baseName = selectedFile.name.split(".").slice(0, -1).join(".");
        form.setValue(
          "assetId",
          `i-generic-${baseName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-01`
        );
      }
    },
    [form, preview]
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
    if (!file) {
      toast.error("Nessun file selezionato.");
      return;
    }
    if (!activeWorkspaceId) {
      toast.error("Error de contexto", {
        description: "No hay un workspace activo seleccionado.",
      });
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("metadata", JSON.stringify(data));
      formData.append("workspaceId", activeWorkspaceId);

      const result = await uploadAssetAction(formData);
      if (result.success) {
        toast.success("Ingestione dell'asset completata!");
        setUploadResult(result.data);
        form.reset();
        setFile(null);
        setPreview(null);
      } else {
        toast.error("Errore di ingestione", { description: result.error });
      }
    });
  };

  // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO] ---
  // Se ensambla el objeto `sesaContent` con la estructura anidada correcta
  // que espera el componente de presentación `AssetUploaderForm`.
  const sesaContentForForm = {
    sesaLabels,
    sesaOptions,
  };
  // --- [FIN DE REFACTORIZACIÓN DE CONTRATO] ---

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
    sesaContent: sesaContentForForm, // Se pasa el objeto corregido
  };
}
