// RUTA: src/components/features/campaign-suite/Step3_Theme/_components/GeometrySelector.tsx
/**
 * @file GeometrySelector.tsx
 * @description Aparato de UI atómico y de élite para la selección visual de estilos de geometría.
 * @version 1.1.0 (Architectural Realignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils/cn";
import { DynamicIcon } from "@/components/ui";
import { logger } from "@/shared/lib/logging";

interface Geometry {
  name: string;
  geometry?: {
    "--radius"?: string;
  };
}

interface GeometrySelectorProps {
  geometries: Geometry[];
  selectedGeometryName: string | null;
  onSelect: (geometryName: string) => void;
  onPreview: (geometry: Geometry | null) => void;
  onCreate: () => void;
  emptyPlaceholder: string;
  createNewRadiusStyleButton: string;
}

export function GeometrySelector({
  geometries,
  selectedGeometryName,
  onSelect,
  onPreview,
  onCreate,
  emptyPlaceholder,
  createNewRadiusStyleButton,
}: GeometrySelectorProps): React.ReactElement {
  logger.trace("[GeometrySelector] Renderizando selector de geometría.");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {geometries.length === 0 && (
        <div className="lg:col-span-3 text-center py-8 text-muted-foreground">
          <DynamicIcon name="Ruler" className="h-10 w-10 mx-auto mb-3" />
          <p>{emptyPlaceholder}</p>
        </div>
      )}
      {geometries.map((geometry) => {
        const radiusValue = geometry.geometry?.["--radius"] || "0rem";
        return (
          <motion.div
            key={geometry.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => onPreview(geometry)}
            onMouseLeave={() => onPreview(null)}
            onClick={() => onSelect(geometry.name)}
            className={cn(
              "cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:scale-105 hover:shadow-xl",
              selectedGeometryName === geometry.name
                ? "border-primary ring-2 ring-primary/50"
                : "border-muted/50"
            )}
          >
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
      <button
        onClick={onCreate}
        className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted/50 p-4 transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
      >
        <DynamicIcon name="Plus" className="h-8 w-8 mb-2" />
        <span className="text-sm font-semibold">
          {geometries.length === 0
            ? "Añadir Nuevo Estilo"
            : createNewRadiusStyleButton}
        </span>
      </button>
    </div>
  );
}
