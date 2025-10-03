// RUTA: src/components/features/raz-prompts/PromptCreator.tsx
/**
 * @file PromptCreator.tsx
 * @description Componente contenedor "smart" para la creación de prompts.
 * @version 4.0.0 (Architectural Realignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { logger } from "@/shared/lib/logging";
import { usePromptCreator } from "@/shared/hooks/raz-prompts/use-prompt-creator";
import { PromptCreatorForm } from "./components/PromptCreatorForm"; // <-- RUTA CORREGIDA
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

interface PromptCreatorProps {
  content: NonNullable<Dictionary["promptCreator"]>;
}

export function PromptCreator({ content }: PromptCreatorProps) {
  logger.info("[Observabilidad] Renderizando PromptCreator v4.0");
  const { form, onSubmit, isPending } = usePromptCreator();

  return (
    <PromptCreatorForm
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      content={content}
    />
  );
}
