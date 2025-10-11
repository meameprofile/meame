// RUTA: src/shared/hooks/campaign-suite/use-content-editor.ts
/**
 * @file use-content-editor.ts
 * @description Hook "cerebro" de élite para la lógica del Editor de Contenido de la SDC.
 *              Encapsula la gestión del formulario (react-hook-form) y el estado local.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { defaultLocale, type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";

interface UseContentEditorProps {
  sectionName: string;
  sectionSchema: z.ZodObject<z.ZodRawShape>;
  draft: CampaignDraft;
  onUpdateContent: (
    sectionName: string,
    locale: Locale,
    field: string,
    value: unknown
  ) => void;
  onClose: () => void;
}

export function useContentEditor({
  sectionName,
  sectionSchema,
  draft,
  onUpdateContent,
  onClose,
}: UseContentEditorProps) {
  logger.trace(`[useContentEditor] Hook inicializado para: ${sectionName}`);

  const [activeLocale, setActiveLocale] = useState<Locale>(defaultLocale);

  const form = useForm<z.infer<typeof sectionSchema>>({
    resolver: zodResolver(sectionSchema),
    defaultValues: draft.contentData[sectionName]?.[activeLocale] || {},
    mode: "onBlur",
  });

  const handlePersistChange = (field: string, value: unknown) => {
    onUpdateContent(sectionName, activeLocale, field, value);
  };

  const onSubmit = () => {
    logger.success(
      `[useContentEditor] Contenido para ${sectionName} guardado. Cerrando panel.`
    );
    onClose();
  };

  return {
    form,
    activeLocale,
    setActiveLocale,
    handlePersistChange,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
