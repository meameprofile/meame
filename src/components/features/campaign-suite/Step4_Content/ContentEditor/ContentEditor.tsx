// RUTA: src/components/features/campaign-suite/Step4_Content/ContentEditor/ContentEditor.tsx
/**
 * @file ContentEditor.tsx
 * @description Orquestador de presentación puro para el editor de contenido.
 *              Consume el hook 'useContentEditor' para separar la lógica de la vista.
 * @version 8.0.0 (Atomic Refactor)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion } from "framer-motion";
import React from "react";
import type { z } from "zod";

import { useContentEditor } from "@/shared/hooks/campaign-suite/use-content-editor";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

import { ContentEditorBody } from "./ContentEditorBody";
import { ContentEditorFooter } from "./ContentEditorFooter";
import { ContentEditorHeader } from "./ContentEditorHeader";

interface ContentEditorProps {
  sectionName: string;
  sectionSchema: z.ZodObject<z.ZodRawShape>;
  draft: CampaignDraft;
  onClose: () => void;
  onUpdateContent: (
    sectionName: string,
    locale: Locale,
    field: string,
    value: unknown
  ) => void;
}

export function ContentEditor({
  sectionName,
  sectionSchema,
  draft,
  onClose,
  onUpdateContent,
}: ContentEditorProps): React.ReactElement {
  logger.info(
    `[ContentEditor] Renderizando orquestador puro para: ${sectionName} (v8.0)`
  );

  // El componente consume el hook que encapsula toda la lógica
  const { form, activeLocale, setActiveLocale, handlePersistChange, onSubmit } =
    useContentEditor({
      sectionName,
      sectionSchema,
      draft,
      onUpdateContent,
      onClose,
    });

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-full max-w-2xl bg-background border-l shadow-2xl z-50 flex flex-col"
    >
      <ContentEditorHeader sectionName={sectionName} onClose={onClose} />

      <ContentEditorBody
        form={form}
        activeLocale={activeLocale}
        setActiveLocale={setActiveLocale}
        sectionSchema={sectionSchema}
        onPersistChange={handlePersistChange}
        onSubmit={onSubmit}
        sectionName={sectionName}
      />

      <ContentEditorFooter onClose={onClose} onSubmit={onSubmit} />
    </motion.div>
  );
}
