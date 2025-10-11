// RUTA: src/components/features/campaign-suite/Step2_Layout/LayoutBuilder.tsx
/**
 * @file LayoutBuilder.tsx
 * @description Orquestador de lógica y estado para la composición de layouts.
 *              Este componente "cerebro" maneja toda la interacción de dnd-kit.
 * @version 6.0.0 (ACS Path & Build Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import React, { useState, useEffect, useCallback } from "react";
import type { z } from "zod";

import { DynamicIcon } from "@/components/ui";
import { showComboToast } from "@/components/ui/ComboToast";
import {
  sectionsConfig,
  type SectionName,
} from "@/shared/lib/config/sections.config";
import { strategicCombos } from "@/shared/lib/config/strategic-combos.config";
import { logger } from "@/shared/lib/logging";
import type { Step2ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step2.schema";
import type { LayoutConfigItem } from "@/shared/lib/types/campaigns/draft.types";
import { detectStrategicCombos } from "@/shared/lib/utils/campaign-suite/combo.detector";

import { LayoutCanvas } from "./_components/LayoutCanvas";
import { SectionLibrary } from "./_components/SectionLibrary";

const availableSections = Object.keys(sectionsConfig).map((name) => ({
  id: name,
  name,
}));
type Content = z.infer<typeof Step2ContentSchema>;

interface LayoutBuilderProps {
  initialLayout: LayoutConfigItem[];
  onLayoutChange: (newLayout: LayoutConfigItem[]) => void;
  content: Pick<
    Content,
    | "libraryTitle"
    | "canvasTitle"
    | "addSectionButtonText"
    | "emptyLibraryText"
    | "emptyCanvasText"
  >;
}

export function LayoutBuilder({
  initialLayout,
  onLayoutChange,
  content,
}: LayoutBuilderProps) {
  logger.info("[LayoutBuilder] Renderizando orquestador v6.0 (ACS Aligned).");
  const [activeLayout, setActiveLayout] =
    useState<LayoutConfigItem[]>(initialLayout);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [comboSections, setComboSections] = useState(new Set<string>());

  const checkCombos = useCallback((layout: LayoutConfigItem[]) => {
    const layoutNames = layout.map((item) => item.name);
    const newComboSections = new Set<string>();

    for (const combo of strategicCombos) {
      for (let i = 0; i <= layoutNames.length - combo.sections.length; i++) {
        const subLayout = layoutNames.slice(i, i + combo.sections.length);
        if (JSON.stringify(subLayout) === JSON.stringify(combo.sections)) {
          combo.sections.forEach((sectionName: SectionName) =>
            newComboSections.add(sectionName)
          );
        }
      }
    }
    setComboSections(newComboSections);
  }, []);

  useEffect(() => {
    checkCombos(activeLayout);
  }, [activeLayout, checkCombos]);

  const handleLayoutUpdate = useCallback(
    (newLayout: LayoutConfigItem[], changedSection: SectionName) => {
      setActiveLayout(newLayout);
      onLayoutChange(newLayout);
      const detectedCombo = detectStrategicCombos(newLayout, changedSection);
      if (detectedCombo) {
        showComboToast(detectedCombo);
      }
    },
    [onLayoutChange]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const handleDragStart = (event: DragStartEvent) =>
    setActiveId(event.active.id as string);

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = activeLayout.findIndex(
        (item) => item.name === active.id
      );
      const newIndex = activeLayout.findIndex((item) => item.name === over.id);
      const newLayout = arrayMove(activeLayout, oldIndex, newIndex);
      handleLayoutUpdate(newLayout, newLayout[newIndex].name as SectionName);
    }
  };

  const addSection = (sectionName: string) => {
    const newLayout = [...activeLayout, { name: sectionName }];
    handleLayoutUpdate(newLayout, sectionName as SectionName);
  };

  const removeSection = (sectionName: string) => {
    const newLayout = activeLayout.filter(
      (section) => section.name !== sectionName
    );
    const lastSection =
      newLayout.length > 0
        ? (newLayout[newLayout.length - 1].name as SectionName)
        : "Hero"; // Placeholder, can be improved
    handleLayoutUpdate(newLayout, lastSection);
  };

  const sectionsInLayout = new Set(activeLayout.map((s) => s.name));
  const availableSectionsFiltered = availableSections.filter(
    (s) => !sectionsInLayout.has(s.name)
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SectionLibrary
          availableSections={availableSectionsFiltered}
          onAddSection={addSection}
          title={content.libraryTitle}
          emptyLibraryText={content.emptyLibraryText}
        />
        <LayoutCanvas
          activeLayout={activeLayout}
          onRemoveSection={removeSection}
          title={content.canvasTitle}
          comboSections={comboSections}
          emptyCanvasText={content.emptyCanvasText}
        />
      </div>
      <DragOverlay>
        {activeId ? (
          <div className="flex items-center justify-between p-3 border rounded-md bg-primary/10 shadow-lg touch-none">
            <div className="flex items-center gap-2">
              <DynamicIcon
                name="GripVertical"
                className="h-5 w-5 text-primary"
              />
              <span className="font-bold text-primary">{activeId}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
