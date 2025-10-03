// RUTA: src/components/features/dev-tools/SuiteStyleComposer/SuiteTypographyTab.tsx
/**
 * @file SuiteTypographyTab.tsx
 * @description Aparato de UI atómico para la pestaña de tipografía, ahora con
 *              higiene de código de élite.
 * @version 3.1.0 (Code Hygiene)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { logger } from "@/shared/lib/logging";
import { GranularInputControl } from "./GranularInputControl";
import type { LoadedFragments } from "../types";
interface SuiteTypographyTabProps {
  allThemeFragments: LoadedFragments;
  selectedFontPreset: string;
  granularFonts: Record<string, string>;
  onFontPresetChange: (value: string) => void;
  onGranularChange: (
    category: "granularFonts",
    cssVar: string,
    value: string
  ) => void;
  content: {
    selectFontLabel: string;
    fontFilterPlaceholder: string;
    defaultPresetName: string;
    fontSizeLabel: string;
    fontWeightLabel: string;
    lineHeightLabel: string;
    letterSpacingLabel: string;
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

export function SuiteTypographyTab({
  allThemeFragments,
  selectedFontPreset,
  granularFonts,
  onFontPresetChange,
  onGranularChange,
  content,
}: SuiteTypographyTabProps): React.ReactElement {
  logger.trace("[SuiteTypographyTab] Renderizando v3.1 (Code Hygiene).");

  const fontOptions = useMemo(
    () => [
      { label: content.defaultPresetName, value: "default" },
      ...Object.keys(allThemeFragments.fonts).map((name) => ({
        label: name,
        value: name,
      })),
    ],
    [allThemeFragments.fonts, content.defaultPresetName]
  );

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <Label htmlFor="font-preset">{content.selectFontLabel}</Label>
        <Select value={selectedFontPreset} onValueChange={onFontPresetChange}>
          <SelectTrigger>
            <SelectValue placeholder={content.fontFilterPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <h4 className="font-semibold text-foreground pt-4 border-t">
        {content.fontSizeLabel}
      </h4>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          "--text-xs",
          "--text-sm",
          "--text-base",
          "--text-lg",
          "--text-xl",
          "--text-2xl",
        ].map((cssVar) => (
          <motion.div key={cssVar} variants={itemVariants}>
            <GranularInputControl
              id={cssVar}
              label={cssVar.replace("--text-", "Size ")}
              value={granularFonts?.[cssVar] || ""}
              onChange={(value) =>
                onGranularChange("granularFonts", cssVar, value)
              }
              placeholder="e.g., 1rem"
            />
          </motion.div>
        ))}
      </motion.div>

      <h4 className="font-semibold text-foreground pt-4 border-t">
        {content.fontWeightLabel}
      </h4>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          "--font-weight-light",
          "--font-weight-normal",
          "--font-weight-medium",
          "--font-weight-semibold",
          "--font-weight-bold",
        ].map((cssVar) => (
          <motion.div key={cssVar} variants={itemVariants}>
            <GranularInputControl
              id={cssVar}
              label={cssVar.replace("--font-weight-", "Weight ")}
              value={granularFonts?.[cssVar] || ""}
              onChange={(value) =>
                onGranularChange("granularFonts", cssVar, value)
              }
              placeholder="e.g., 400"
              type="number"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
