// RUTA: src/components/features/dev-tools/SuiteStyleComposer/SuiteGeometryTab.tsx
/**
 * @file SuiteGeometryTab.tsx
 * @description Aparato de UI atómico para la pestaña de geometría, ahora con
 *              higiene de código de élite y sin importaciones redundantes.
 * @version 3.1.0 (Code Hygiene)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion, type Variants } from "framer-motion";
import React, { useMemo } from "react";

import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { logger } from "@/shared/lib/logging";

import type { LoadedFragments } from "../types";

import { GranularInputControl } from "./GranularInputControl";
// --- [INICIO DE REFACTORIZACIÓN DE ÉLITE] ---
// Se elimina la importación del tipo 'SuiteThemeConfig' no utilizado.
// --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---

interface SuiteGeometryTabProps {
  allThemeFragments: LoadedFragments;
  selectedRadiusPreset: string;
  granularGeometry: Record<string, string>;
  onRadiusPresetChange: (value: string) => void;
  onGranularChange: (
    category: "granularGeometry",
    cssVar: string,
    value: string
  ) => void;
  content: {
    selectRadiusLabel: string;
    radiusFilterPlaceholder: string;
    defaultPresetName: string;
    borderRadiusLabel: string;
    borderWidthLabel: string;
    baseSpacingUnitLabel: string;
    inputHeightLabel: string;
  };
}

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function SuiteGeometryTab({
  allThemeFragments,
  selectedRadiusPreset,
  granularGeometry,
  onRadiusPresetChange,
  onGranularChange,
  content,
}: SuiteGeometryTabProps): React.ReactElement {
  logger.trace("[SuiteGeometryTab] Renderizando v3.1 (Code Hygiene).");

  const radiusOptions = useMemo(
    () => [
      { label: content.defaultPresetName, value: "default" },
      ...Object.keys(allThemeFragments.radii).map((name) => ({
        label: name,
        value: name,
      })),
    ],
    [allThemeFragments.radii, content.defaultPresetName]
  );

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <Label htmlFor="radius-preset">{content.selectRadiusLabel}</Label>
        <Select
          value={selectedRadiusPreset}
          onValueChange={onRadiusPresetChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={content.radiusFilterPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {radiusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <h4 className="font-semibold text-foreground pt-4 border-t">
        {content.borderRadiusLabel}
      </h4>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <GranularInputControl
            id="--radius"
            label="--radius"
            value={granularGeometry?.["--radius"] || ""}
            onChange={(value) =>
              onGranularChange("granularGeometry", "--radius", value)
            }
            placeholder="e.g., 0.5rem"
          />
        </motion.div>
      </motion.div>

      <h4 className="font-semibold text-foreground pt-4 border-t">
        {content.borderWidthLabel}
      </h4>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <GranularInputControl
            id="--border-width"
            label="--border-width"
            value={granularGeometry?.["--border-width"] || ""}
            onChange={(value) =>
              onGranularChange("granularGeometry", "--border-width", value)
            }
            placeholder="e.g., 1px"
          />
        </motion.div>
      </motion.div>

      <h4 className="font-semibold text-foreground pt-4 border-t">
        {content.baseSpacingUnitLabel}
      </h4>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <GranularInputControl
            id="--space"
            label="--space"
            value={granularGeometry?.["--space"] || ""}
            onChange={(value) =>
              onGranularChange("granularGeometry", "--space", value)
            }
            placeholder="e.g., 0.25rem"
          />
        </motion.div>
      </motion.div>

      <h4 className="font-semibold text-foreground pt-4 border-t">
        {content.inputHeightLabel}
      </h4>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <GranularInputControl
            id="--input-height"
            label="--input-height"
            value={granularGeometry?.["--input-height"] || ""}
            onChange={(value) =>
              onGranularChange("granularGeometry", "--input-height", value)
            }
            placeholder="e.g., 2.5rem"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
