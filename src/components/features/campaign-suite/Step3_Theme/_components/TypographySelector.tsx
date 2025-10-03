// RUTA: src/components/features/campaign-suite/Step3_Theme/_components/TypographySelector.tsx
/**
 * @file TypographySelector.tsx
 * @description Aparato de UI de élite para la selección visual de tipografías.
 *              Inyectado con MEA/UX para una experiencia de usuario superior,
 *              orquestando una animación de entrada en cascada.
 * @version 2.0.0 (Elite Leveling & MEA/UX Injection)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/shared/lib/utils/cn";
import { DynamicIcon } from "@/components/ui";
import { logger } from "@/shared/lib/logging";

// --- SSoT de Contratos de Datos y Animaciones ---

interface Typography {
  name: string;
  fonts?: {
    sans?: string;
    serif?: string;
  };
}

interface TypographySelectorProps {
  typographies: Typography[];
  selectedTypographyName: string | null;
  onSelect: (typographyName: string) => void;
  onPreview: (typography: Typography | null) => void;
  onCreate: () => void;
  emptyPlaceholder: string;
  createNewFontSetButton: string;
}

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Orquesta la animación de los hijos
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

// --- Componente de Élite ---

export function TypographySelector({
  typographies,
  selectedTypographyName,
  onSelect,
  onPreview,
  onCreate,
  emptyPlaceholder,
  createNewFontSetButton,
}: TypographySelectorProps): React.ReactElement {
  logger.trace(
    "[TypographySelector] Renderizando selector de tipografía v2.0."
  );

  // --- Renderizado del Estado Vacío (Pilar de Resiliencia) ---
  if (typographies.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-3 text-center py-8 text-muted-foreground">
          <DynamicIcon name="Type" className="h-10 w-10 mx-auto mb-3" />
          <p>{emptyPlaceholder}</p>
        </div>
        <motion.button
          variants={itemVariants}
          onClick={onCreate}
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted/50 p-4 transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <DynamicIcon name="Plus" className="h-8 w-8 mb-2" />
          <span className="text-sm font-semibold">{"Añadir Nuevo Set"}</span>
        </motion.button>
      </div>
    );
  }

  // --- Renderizado Principal (MEA/UX) ---
  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {typographies.map((typography) => {
        const fonts = typography.fonts ?? {}; // Guardia de resiliencia
        return (
          <motion.div
            key={typography.name}
            variants={itemVariants}
            onMouseEnter={() => onPreview(typography)}
            onMouseLeave={() => onPreview(null)}
            onClick={() => onSelect(typography.name)}
            className={cn(
              "cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:scale-105 hover:shadow-xl",
              selectedTypographyName === typography.name
                ? "border-primary ring-2 ring-primary/50"
                : "border-border"
            )}
          >
            <div className="h-20 w-full flex flex-col items-center justify-center rounded-md bg-muted/20 p-2">
              {fonts.sans && (
                <p
                  className="text-lg font-bold text-foreground overflow-hidden whitespace-nowrap"
                  style={{ fontFamily: `"${fonts.sans.split(",")[0]}"` }}
                >
                  {typography.name}
                </p>
              )}
              {fonts.serif && (
                <p
                  className="text-sm italic text-muted-foreground overflow-hidden whitespace-nowrap"
                  style={{ fontFamily: `"${fonts.serif.split(",")[0]}"` }}
                >
                  Serif Example
                </p>
              )}
            </div>
            <p className="mt-2 text-center text-sm font-semibold text-foreground">
              {typography.name}
            </p>
          </motion.div>
        );
      })}
      <motion.button
        variants={itemVariants}
        onClick={onCreate}
        className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted/50 p-4 transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
      >
        <DynamicIcon name="Plus" className="h-8 w-8 mb-2" />
        <span className="text-sm font-semibold">{createNewFontSetButton}</span>
      </motion.button>
    </motion.div>
  );
}
