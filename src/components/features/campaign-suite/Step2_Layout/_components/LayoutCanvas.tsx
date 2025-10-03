// RUTA: src/components/features/campaign-suite/Step2_Layout/_components/LayoutCanvas.tsx
/**
 * @file LayoutCanvas.tsx
 * @description Aparato atómico para el lienzo de layout reordenable, restaurado y nivelado.
 *              Es un componente de presentación puro que renderiza los ítems y emite eventos.
 * @version 2.2.0 (Code Regression Restoration & Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import type { LayoutConfigItem } from "@/shared/lib/types/campaigns/draft.types";
import { Button, DynamicIcon } from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";

/**
 * @interface SortableItemProps
 * @description Contrato de props para el sub-componente interno SortableItem.
 */
interface SortableItemProps {
  id: string;
  isComboPart: boolean;
  isLastItem: boolean;
  isNextItemInCombo: boolean;
  onRemove: (id: string) => void;
}

/**
 * @component SortableItem
 * @description Sub-componente de presentación puro que representa un ítem arrastrable.
 */
function SortableItem({
  id,
  isComboPart,
  isLastItem,
  isNextItemInCombo,
  onRemove,
}: SortableItemProps) {
  // Pilar III (Observabilidad)
  logger.trace(`[SortableItem] Renderizando para: ${id}`);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      // Pilar II (Theming)
      className={cn(
        "relative flex items-center justify-between p-3 border rounded-md bg-background shadow-sm touch-none transition-all duration-300",
        isComboPart && "border-primary ring-2 ring-primary/50"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2">
        <DynamicIcon
          name="GripVertical"
          className="h-5 w-5 text-muted-foreground cursor-grab"
        />
        <span className="font-medium">{id}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onRemove(id)}>
        <DynamicIcon name="X" className="h-4 w-4 text-destructive" />
      </Button>
      {/* MEA/UX: Conector visual para combos estratégicos */}
      {!isLastItem && (
        <div className="absolute left-5 -bottom-3 h-3 w-0.5 bg-border">
          {isNextItemInCombo && (
            <motion.div
              className="absolute inset-0 bg-primary"
              initial={{ scaleY: 0, originY: 0 }}
              animate={{ scaleY: 1, originY: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          )}
        </div>
      )}
    </motion.div>
  );
}

// SSoT de Tipos para Props del componente principal
interface LayoutCanvasProps {
  activeLayout: LayoutConfigItem[];
  comboSections: Set<string>;
  onRemoveSection: (sectionName: string) => void;
  title: string;
  emptyCanvasText: string;
}

export function LayoutCanvas({
  activeLayout,
  comboSections,
  onRemoveSection,
  title,
  emptyCanvasText,
}: LayoutCanvasProps) {
  // Pilar III (Observabilidad)
  logger.trace("[LayoutCanvas] Renderizando lienzo v2.2 (Restored).");
  return (
    <div className="md:col-span-2 p-4 border rounded-lg bg-muted/20 min-h-[400px]">
      <h3 className="font-semibold mb-4">{title}</h3>
      <AnimatePresence>
        <SortableContext
          items={activeLayout.map((item) => item.name)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {/* Pilar VI (Resiliencia): Manejo del estado vacío */}
            {activeLayout.length > 0 ? (
              activeLayout.map((item, index) => {
                const isComboPart = comboSections.has(item.name);
                const isNextItemInCombo =
                  isComboPart &&
                  index < activeLayout.length - 1 &&
                  comboSections.has(activeLayout[index + 1].name);
                return (
                  <SortableItem
                    key={item.name}
                    id={item.name}
                    onRemove={onRemoveSection}
                    isComboPart={isComboPart}
                    isLastItem={index === activeLayout.length - 1}
                    isNextItemInCombo={isNextItemInCombo}
                  />
                );
              })
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground text-center py-10"
              >
                {emptyCanvasText}
              </motion.p>
            )}
          </div>
        </SortableContext>
      </AnimatePresence>
    </div>
  );
}
