// RUTA: src/components/features/bavi/components/AssetUploader/components/AssetUploaderForm.tsx
/**
 * @file AssetUploaderForm.tsx
 * @description Componente de presentación puro para la UI del AssetUploader.
 *              Forjado con observabilidad de élite y un guardián de resiliencia de contrato.
 * @version 1.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import type { DropzoneRootProps, DropzoneInputProps } from "react-dropzone";
import type { UploadApiResponse } from "cloudinary";
import { Form, Button, DynamicIcon } from "@/components/ui";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import { AssetDropzone } from "./AssetDropzone";
import { MetadataForm } from "./MetadataForm";
import { UploadPreview } from "./UploadPreview";
import { SesaTagsFormGroup } from "@/components/features/raz-prompts/components/SesaTagsFormGroup";
import type { AssetUploadMetadata } from "@/shared/lib/schemas/bavi/upload.schema";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { logger } from "@/shared/lib/logging";

type UploaderContent = NonNullable<Dictionary["baviUploader"]>;
type SesaContent = {
  sesaLabels: NonNullable<Dictionary["promptCreator"]>["sesaLabels"];
  sesaOptions: NonNullable<Dictionary["promptCreator"]>["sesaOptions"];
};

interface AssetUploaderFormProps {
  form: UseFormReturn<AssetUploadMetadata>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isPending: boolean;
  preview: string | null;
  uploadResult: UploadApiResponse | null;
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  isDragActive: boolean;
  content: UploaderContent;
  sesaContent: SesaContent;
}

export function AssetUploaderForm({
  form,
  onSubmit,
  isPending,
  preview,
  uploadResult,
  getRootProps,
  getInputProps,
  isDragActive,
  content,
  sesaContent,
}: AssetUploaderFormProps) {
  const traceId = logger.startTrace("AssetUploaderForm_Render");
  logger.trace("[AssetUploaderForm] Renderizando formulario de presentación.", {
    traceId,
  });

  // --- GUARDIÁN DE RESILIENCIA DE CONTRATO ---
  if (!content || !sesaContent.sesaLabels || !sesaContent.sesaOptions) {
    const errorMsg =
      "Contrato de UI violado: Faltan props de contenido requeridas.";
    logger.error(`[Guardián] ${errorMsg}`, { traceId });
    logger.endTrace(traceId);
    return (
      <DeveloperErrorDisplay
        context="AssetUploaderForm"
        errorMessage={errorMsg}
      />
    );
  }

  logger.endTrace(traceId);
  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
      >
        <AssetDropzone
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          preview={preview}
          text={
            isDragActive
              ? "Suelta para iniciar la magia..."
              : content.dropzoneDefault
          }
        />
        <div className="space-y-6">
          <MetadataForm control={form.control} content={content} />
          <SesaTagsFormGroup
            control={form.control}
            content={{
              ...sesaContent.sesaLabels,
              options: sesaContent.sesaOptions,
            }}
          />
          <Button
            type="submit"
            disabled={isPending || !preview}
            className="w-full"
            size="lg"
          >
            {isPending && (
              <DynamicIcon
                name="LoaderCircle"
                className="mr-2 h-4 w-4 animate-spin"
              />
            )}
            {content.submitButtonText}
          </Button>
          <UploadPreview uploadResult={uploadResult} />
        </div>
      </form>
    </Form>
  );
}
