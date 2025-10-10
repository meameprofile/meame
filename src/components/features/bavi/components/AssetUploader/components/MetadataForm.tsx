// RUTA: src/components/features/bavi/components/AssetUploader/components/MetadataForm.tsx
/**
 * @file MetadataForm.tsx
 * @description Componente de presentación puro para el formulario de metadatos de BAVI,
 *              con MEA/UX inyectada.
 * @version 7.0.0 (Holistic & MEA/UX Injected)
 * @author L.I.A. Legacy
 */
"use client";
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@/components/ui";
import type { Control } from "react-hook-form";
import type { AssetUploadMetadata } from "@/shared/lib/schemas/bavi/upload.schema";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { logger } from "@/shared/lib/logging";
import { motion } from "framer-motion";

type UploaderContent = NonNullable<Dictionary["baviUploader"]>;

interface MetadataFormProps {
  control: Control<AssetUploadMetadata>;
  content: UploaderContent;
  extractedMetadata: Record<string, string | number> | null;
}

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function MetadataForm({
  control,
  content,
  extractedMetadata,
}: MetadataFormProps): React.ReactElement {
  logger.trace("[MetadataForm] Renderizando formulario de metadatos v7.0.");

  return (
    <motion.div
      className="space-y-4"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fieldVariants}>
        <FormField
          control={control}
          name="finalFileName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{content.finalFileNameLabel}</FormLabel>
              <FormControl>
                <Input
                  placeholder={content.finalFileNamePlaceholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      {extractedMetadata && (
        <motion.div
          variants={fieldVariants}
          className="text-xs text-muted-foreground space-y-1 border p-2 rounded-md bg-muted/20"
        >
          {Object.entries(extractedMetadata).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {value}
            </p>
          ))}
        </motion.div>
      )}

      <motion.div variants={fieldVariants}>
        <FormField
          control={control}
          name="assetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{content.assetIdLabel}</FormLabel>
              <FormControl>
                <Input placeholder={content.assetIdPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div variants={fieldVariants}>
        <FormField
          control={control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{content.keywordsLabel}</FormLabel>
              <FormControl>
                <Input
                  placeholder={content.keywordsPlaceholder}
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(",").map((k) => k.trim())
                    )
                  }
                  value={
                    Array.isArray(field.value) ? field.value.join(", ") : ""
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div variants={fieldVariants}>
        <FormField
          control={control}
          name="altText.it-IT"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{content.altTextLabel}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={content.altTextPlaceholder}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div variants={fieldVariants}>
        <FormField
          control={control}
          name="promptId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{content.promptIdLabel}</FormLabel>
              <FormControl>
                <Input
                  placeholder={content.promptIdPlaceholder}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>
    </motion.div>
  );
}
