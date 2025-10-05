// RUTA: src/components/features/campaign-suite/Step2_Layout/Step2Form.tsx
/**
 * @file Step2Form.tsx
 * @description Componente de Presentación Puro para la UI del Paso 2 (Layout),
 *              con observabilidad inyectada y delegación de datos robusta.
 * @version 8.0.0 (Observable & Resilient Data Delegation)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import type { LayoutConfigItem } from "@/shared/lib/types/campaigns/draft.types";
import { LayoutBuilder } from "./LayoutBuilder";
import { WizardNavigation } from "@/components/features/campaign-suite/_components/WizardNavigation";
import { z } from "zod";
import { Step2ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step2.schema";

type Step2Content = z.infer<typeof Step2ContentSchema>;

interface Step2FormProps {
  content: Step2Content;
  layoutConfig: LayoutConfigItem[];
  onLayoutChange: (newLayout: LayoutConfigItem[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step2Form({
  content,
  layoutConfig,
  onLayoutChange,
  onBack,
  onNext,
}: Step2FormProps): React.ReactElement {
  logger.trace(
    "[Step2Form] Renderizando formulario de presentación puro (v8.0)."
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
        <CardDescription>{content.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-10">
        <LayoutBuilder
          initialLayout={layoutConfig}
          onLayoutChange={onLayoutChange}
          content={{
            libraryTitle: content.libraryTitle,
            canvasTitle: content.canvasTitle,
            addSectionButtonText: content.addSectionButtonText,
            emptyLibraryText: content.emptyLibraryText,
            emptyCanvasText: content.emptyCanvasText,
          }}
        />
      </CardContent>
      <CardFooter className="sticky bottom-0 bg-background/95 backdrop-blur-sm py-4 border-t z-10">
        <WizardNavigation
          onBack={onBack}
          onNext={onNext}
          nextButtonText={content.nextButtonText}
        />
      </CardFooter>
    </Card>
  );
}
