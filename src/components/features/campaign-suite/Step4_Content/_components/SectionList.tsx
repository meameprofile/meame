// RUTA: src/components/features/campaign-suite/Step4_Content/_components/SectionList.tsx
/**
 * @file SectionList.tsx
 * @description Aparato de presentación atómico para mostrar la lista de secciones.
 * @version 3.0.0 (ACS Path Restoration & MEA)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { LayoutConfigItem } from "@/shared/lib/types/campaigns/draft.types";
import { logger } from "@/shared/lib/logging";
import { motion } from "framer-motion";

interface SectionListProps {
  layoutConfig: LayoutConfigItem[];
  onEditSection: (sectionName: string) => void;
  content: {
    editButtonText: string;
    emptyStateTitle: string;
    emptyStateDescription: string;
  };
}

export function SectionList({
  layoutConfig,
  onEditSection,
  content,
}: SectionListProps): React.ReactElement {
  logger.trace(
    "[SectionList] Renderizando lista de secciones del layout (v3.0)."
  );

  return (
    <div className="space-y-4 mb-10">
      {layoutConfig.length > 0 ? (
        layoutConfig.map((section) => (
          <motion.div
            key={section.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0px 4px 15px rgba(var(--primary-rgb), 0.1)",
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center justify-between p-4 border rounded-lg bg-muted/20 transition-colors hover:border-primary/50"
          >
            <div className="flex items-center gap-3">
              <DynamicIcon
                name="GripVertical"
                className="h-5 w-5 text-muted-foreground"
              />
              <span className="font-medium text-foreground">
                {section.name}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditSection(section.name)}
            >
              <DynamicIcon name="Pencil" className="mr-2 h-4 w-4" />
              {content.editButtonText}
            </Button>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h4 className="font-semibold text-foreground">
            {content.emptyStateTitle}
          </h4>
          <p className="text-muted-foreground text-sm mt-2">
            {content.emptyStateDescription}
          </p>
        </div>
      )}
    </div>
  );
}
