// RUTA: src/components/features/campaign-suite/Step3_Theme/_components/PaletteSelector.tsx
/**
 * @file PaletteSelector.tsx
 * @description Aparato de UI atómico y de élite para la selección visual de paletas de colores.
 * @version 2.0.0 (Preset Management UI)
 * @author L.I.A. Legacy
 */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils/cn";
import {
  DynamicIcon,
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import type { ThemePreset } from "@/shared/lib/schemas/theme-preset.schema";

interface PaletteSelectorProps {
  palettes: ThemePreset[];
  selectedPaletteName: string | null;
  onSelect: (paletteName: string) => void;
  onPreview: (palette: ThemePreset | null) => void;
  onCreate: () => void;
  onEdit: (palette: ThemePreset) => void;
  onDelete: (palette: ThemePreset) => void;
  createNewPaletteButton: string;
}

const PaletteSwatch = ({ color }: { color?: string }) => (
  <div
    className="h-full w-full"
    style={{ backgroundColor: color ? `hsl(${color})` : "transparent" }}
  />
);

export function PaletteSelector({
  palettes,
  selectedPaletteName,
  onSelect,
  onPreview,
  onCreate,
  onEdit,
  onDelete,
  createNewPaletteButton,
}: PaletteSelectorProps) {
  logger.trace(
    "[PaletteSelector] Renderizando selector visual de paletas v2.0."
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {palettes.map((palette) => {
        const colors =
          (palette.themeConfig as { colors?: Record<string, string> })
            ?.colors ?? {};
        const isWorkspacePreset = !!palette.workspaceId;

        return (
          <motion.div
            key={palette.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => onPreview(palette)}
            onMouseLeave={() => onPreview(null)}
            onClick={() => onSelect(palette.name)}
            className={cn(
              "group relative cursor-pointer rounded-lg border-2 p-2 transition-all duration-200 hover:scale-105 hover:shadow-xl",
              selectedPaletteName === palette.name
                ? "border-primary ring-2 ring-primary/50"
                : "border-muted/50"
            )}
          >
            {isWorkspacePreset && (
              <div className="absolute top-1 right-1 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(palette);
                        }}
                      >
                        <DynamicIcon name="Pencil" className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar Preset</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(palette);
                        }}
                      >
                        <DynamicIcon name="Trash2" className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Eliminar Preset</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            <div className="h-20 w-full flex overflow-hidden rounded-md border">
              <PaletteSwatch color={colors.primary} />
              <PaletteSwatch color={colors.secondary} />
              <PaletteSwatch color={colors.accent} />
              <PaletteSwatch color={colors.background} />
              <PaletteSwatch color={colors.foreground} />
            </div>
            <p className="mt-2 text-center text-sm font-semibold text-foreground">
              {palette.name}
            </p>
          </motion.div>
        );
      })}
      <button
        onClick={onCreate}
        className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted/50 p-2 transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
      >
        <DynamicIcon name="Plus" className="h-8 w-8 mb-2" />
        <span className="text-sm font-semibold">{createNewPaletteButton}</span>
      </button>
    </div>
  );
}
