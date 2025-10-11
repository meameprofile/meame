// RUTA: src/components/features/campaign-suite/Step3_Theme/_components/GeometrySelector.tsx
/**
 * @file GeometrySelector.tsx
 * @description Aparato de UI atómico y de élite para la selección visual de estilos de geometría.
 * @version 2.0.0 (Preset Management UI)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion } from "framer-motion";
import React from "react";

import {
  DynamicIcon,
  Button,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import type { ThemePreset } from "@/shared/lib/schemas/theme-preset.schema";
import { cn } from "@/shared/lib/utils/cn";

interface GeometrySelectorProps {
  geometries: ThemePreset[];
  selectedGeometryName: string | null;
  onSelect: (geometryName: string) => void;
  onPreview: (geometry: ThemePreset | null) => void;
  onCreate: () => void;
  onEdit: (geometry: ThemePreset) => void;
  onDelete: (geometry: ThemePreset) => void;
  emptyPlaceholder: string;
  createNewRadiusStyleButton: string;
}

export function GeometrySelector({
  geometries,
  selectedGeometryName,
  onSelect,
  onPreview,
  onCreate,
  onEdit,
  onDelete,
  emptyPlaceholder,
  createNewRadiusStyleButton,
}: GeometrySelectorProps): React.ReactElement {
  logger.trace("[GeometrySelector] Renderizando selector de geometría v2.0.");

  if (geometries.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-3 text-center py-8 text-muted-foreground">
          <DynamicIcon name="Ruler" className="h-10 w-10 mx-auto mb-3" />
          <p>{emptyPlaceholder}</p>
        </div>
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onCreate}
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted/50 p-4 transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <DynamicIcon name="Plus" className="h-8 w-8 mb-2" />
          <span className="text-sm font-semibold">{"Añadir Nuevo Estilo"}</span>
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {geometries.map((geometry) => {
        const radiusValue =
          (geometry.themeConfig as { geometry?: { "--radius"?: string } })
            ?.geometry?.["--radius"] || "0rem";
        const isWorkspacePreset = !!geometry.workspaceId;

        return (
          <motion.div
            key={geometry.id}
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            onMouseEnter={() => onPreview(geometry)}
            onMouseLeave={() => onPreview(null)}
            onClick={() => onSelect(geometry.name)}
            className={cn(
              "group relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:scale-105 hover:shadow-xl",
              selectedGeometryName === geometry.name
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
                          onEdit(geometry);
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
                          onDelete(geometry);
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
            <div
              className="h-20 w-full flex items-center justify-center bg-muted/20 p-2 border border-border"
              style={{ borderRadius: radiusValue }}
            >
              <div
                className="h-10 w-10 bg-primary/20 border border-primary"
                style={{ borderRadius: radiusValue }}
              />
            </div>
            <p className="mt-2 text-center text-sm font-semibold text-foreground">
              {geometry.name}
            </p>
          </motion.div>
        );
      })}
      <motion.button
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 1, y: 0 },
        }}
        onClick={onCreate}
        className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted/50 p-4 transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
      >
        <DynamicIcon name="Plus" className="h-8 w-8 mb-2" />
        <span className="text-sm font-semibold">
          {createNewRadiusStyleButton}
        </span>
      </motion.button>
    </motion.div>
  );
}
