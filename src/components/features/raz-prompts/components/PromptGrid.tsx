// RUTA: src/components/features/raz-prompts/components/PromptGrid.tsx
/**
 * @file PromptGrid.tsx
 * @description Componente de presentación puro para renderizar la cuadrícula
 *              de prompts, inyectado con animaciones MEA/UX.
 * @version 3.0.0 (Elite MEA/UX Injection)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion, type Variants } from "framer-motion";
import React from "react";

import { DynamicIcon, Skeleton } from "@/components/ui";
import type { EnrichedRaZPromptsEntry } from "@/shared/lib/actions/raz-prompts";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

import { PromptCard } from "./PromptCard";

type VaultContent = NonNullable<Dictionary["promptVault"]>;
type SesaOptions = NonNullable<Dictionary["promptCreator"]>["sesaOptions"];

interface PromptGridProps {
  prompts: EnrichedRaZPromptsEntry[];
  isLoading: boolean;
  onViewDetails: (promptId: string) => void;
  content: VaultContent;
  sesaOptions: SesaOptions;
}

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export function PromptGrid({
  prompts,
  isLoading,
  onViewDetails,
  content,
  sesaOptions,
}: PromptGridProps): React.ReactElement {
  logger.trace("[PromptGrid] Renderizando v3.0 (MEA/UX Injected)");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-96 w-full" />
        ))}
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 text-muted-foreground min-h-[300px] flex flex-col justify-center items-center"
      >
        <DynamicIcon name="FolderSearch" className="h-12 w-12 mx-auto mb-4" />
        <p className="font-semibold text-lg">{content.noPromptsFound}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.promptId}
          prompt={prompt}
          onViewDetails={onViewDetails}
          sesaOptions={sesaOptions}
          content={content}
          variants={cardVariants}
        />
      ))}
    </motion.div>
  );
}
