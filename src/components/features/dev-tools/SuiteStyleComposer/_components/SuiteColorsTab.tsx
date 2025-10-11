// RUTA: src/components/features/dev-tools/SuiteStyleComposer/SuiteColorsTab.tsx
/**
 * @file SuiteColorsTab.tsx
 * @description Aparato atómico para la selección visual de paletas de colores.
 *              v3.0.0 (Type & Path Integrity Restoration): Se restaura la
 *              integridad de los tipos y las rutas de importación.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion } from "framer-motion";
import React from "react";

import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { cn } from "@/shared/lib/utils";

import type { LoadedFragments } from "../types";

// --- [INICIO DE REFACTORIZACIÓN DE CONTRATO] ---
interface ContentProps {
  selectThemeLabel: string;
  defaultPresetName: string;
  colorFilterPlaceholder: string; // <-- Propiedad añadida al contrato
}
// --- [FIN DE REFACTORIZACIÓN DE CONTRATO] ---

interface SuiteColorsTabProps {
  allThemeFragments: LoadedFragments;
  selectedColorPreset: string;
  onColorPresetChange: (value: string) => void;
  content: ContentProps; // <-- El tipo ahora es explícito y correcto
}

const PaletteSwatch = ({ color }: { color?: string }) => (
  <div
    className="h-full w-full"
    style={{ backgroundColor: color ? `hsl(${color})` : "transparent" }}
  />
);

export function SuiteColorsTab({
  allThemeFragments,
  selectedColorPreset,
  onColorPresetChange,
  content,
}: SuiteColorsTabProps) {
  const palettes = (
    Object.entries(allThemeFragments.colors) as [
      string,
      Partial<AssembledTheme>,
    ][]
  ).map(([name, data]) => ({
    name,
    colors: data.colors ?? {},
  }));

  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-4">{content.selectThemeLabel}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {palettes.map((palette) => (
          <motion.div
            key={palette.name}
            onClick={() => onColorPresetChange(palette.name)}
            whileHover={{ scale: 1.05 }}
            className={cn(
              "cursor-pointer rounded-lg border-2 p-2 transition-all duration-200 hover:shadow-xl",
              selectedColorPreset === palette.name
                ? "border-primary ring-2 ring-primary/50"
                : "border-muted/50"
            )}
          >
            <div className="h-20 w-full flex overflow-hidden rounded-md border">
              <PaletteSwatch color={palette.colors.primary} />
              <PaletteSwatch color={palette.colors.secondary} />
              <PaletteSwatch color={palette.colors.accent} />
              <PaletteSwatch color={palette.colors.background} />
              <PaletteSwatch color={palette.colors.foreground} />
            </div>
            <p className="mt-2 text-center text-sm font-semibold text-foreground capitalize">
              {palette.name}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
