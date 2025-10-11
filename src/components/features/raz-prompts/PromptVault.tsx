// RUTA: src/components/features/raz-prompts/PromptVault.tsx
/**
 * @file PromptVault.tsx
 * @description Componente contenedor "inteligente" para la Bóveda de Prompts.
 * @version 8.0.0 (Architectural Realignment)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";

import { usePromptVault } from "@/shared/hooks/raz-prompts/use-prompt-vault";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

import { PromptVaultDisplay } from "./components/PromptVaultDisplay"; // <-- RUTA CORREGIDA

interface PromptVaultProps {
  content: NonNullable<Dictionary["promptCreator"]>;
  vaultContent: NonNullable<Dictionary["promptVault"]>;
}

export function PromptVault({
  content,
  vaultContent,
}: PromptVaultProps): React.ReactElement {
  logger.trace("[PromptVault] Renderizando contenedor smart (v8.0).");

  const hookState = usePromptVault();

  const onViewPromptDetails = (promptId: string) => {
    logger.info(`[PromptVault] Acción: Ver detalles del prompt: ${promptId}`);
  };

  return (
    <PromptVaultDisplay
      {...hookState}
      onViewDetails={onViewPromptDetails}
      content={content}
      vaultContent={vaultContent}
    />
  );
}
