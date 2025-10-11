// RUTA: src/components/features/raz-prompts/components/PromptVaultDisplay.tsx
/**
 * @file PromptVaultDisplay.tsx
 * @description Componente de presentación puro y de élite para la Bóveda de Prompts,
 *              ahora orquestando una experiencia de usuario memorable (MEA/UX).
 * @version 3.0.0 (Elite MEA/UX Orchestrator)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion, type Variants } from "framer-motion";
import React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";
import type { usePromptVault } from "@/shared/hooks/raz-prompts/use-prompt-vault";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

import { PromptGrid } from "./PromptGrid";
import { VaultFilters } from "./VaultFilters";
import { VaultPagination } from "./VaultPagination";

type HookState = ReturnType<typeof usePromptVault>;
interface PromptVaultDisplayProps extends HookState {
  onViewDetails: (promptId: string) => void;
  content: NonNullable<Dictionary["promptCreator"]>;
  vaultContent: NonNullable<Dictionary["promptVault"]>;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function PromptVaultDisplay({
  prompts,
  isPending,
  currentPage,
  searchQuery,
  totalPages,
  activeFilters,
  handleSearch,
  handleFilterChange,
  handlePageChange,
  setSearchQuery,
  onViewDetails,
  content,
  vaultContent,
}: PromptVaultDisplayProps): React.ReactElement {
  logger.trace(
    "[PromptVaultDisplay] Renderizando orquestador de presentación v3.0."
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card>
        <CardHeader>
          <CardTitle>{vaultContent.title}</CardTitle>
          <CardDescription>{vaultContent.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div variants={sectionVariants}>
            <VaultFilters
              searchQuery={searchQuery}
              activeFilters={activeFilters}
              onSearchChange={setSearchQuery}
              onFilterChange={handleFilterChange}
              onSearchSubmit={handleSearch}
              content={vaultContent}
              sesaOptions={content.sesaOptions}
              isPending={isPending}
            />
          </motion.div>
          <motion.div variants={sectionVariants}>
            <PromptGrid
              prompts={prompts}
              isLoading={isPending && prompts.length === 0}
              onViewDetails={onViewDetails}
              content={vaultContent}
              sesaOptions={content.sesaOptions}
            />
          </motion.div>
          <motion.div variants={sectionVariants}>
            <VaultPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isPending={isPending}
              content={vaultContent}
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
