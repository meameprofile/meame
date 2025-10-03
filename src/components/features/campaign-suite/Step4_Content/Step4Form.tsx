// RUTA: src/components/features/campaign-suite/Step4_Content/Step4Form.tsx
/**
 * @file Step4Form.tsx
 * @description Orquestador de presentación puro para el Paso 4.
 *              Delega la renderización a componentes atómicos y animados.
 * @version 10.0.0 (Atomic & Observable)
 * @author L.I.A. Legacy
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
import type { CampaignDraft } from "@/shared/lib/types/campaigns/draft.types";
import { WizardNavigation } from "@/components/features/campaign-suite/_components/WizardNavigation";
import { SectionList } from "./_components/SectionList";
import { EditorOrchestrator } from "./_components/EditorOrchestrator";
import type { Step4ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step4.schema";
import type { z } from "zod";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { DeveloperErrorDisplay } from "../../dev-tools";

type Content = z.infer<typeof Step4ContentSchema>;

interface Step4FormProps {
  content: Content;
  draft: CampaignDraft;
  onEditSection: (sectionName: string) => void;
  onCloseEditor: () => void;
  editingSection: string | null;
  onUpdateContent: (
    sectionName: string,
    locale: Locale,
    field: string,
    value: unknown
  ) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step4Form({
  content,
  draft,
  onEditSection,
  onCloseEditor,
  editingSection,
  onUpdateContent,
  onBack,
  onNext,
}: Step4FormProps): React.ReactElement {
  logger.trace("[Step4Form] Renderizando orquestador de presentación v10.0.");

  if (!content) {
    return (
      <DeveloperErrorDisplay
        context="Step4Form"
        errorMessage="Contenido i18n no proporcionado."
      />
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{content.title}</CardTitle>
          <CardDescription>{content.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <SectionList
            layoutConfig={draft.layoutConfig}
            onEditSection={onEditSection}
            content={{
              editButtonText: content.editButtonText,
              emptyStateTitle: content.emptyStateTitle,
              emptyStateDescription: content.emptyStateDescription,
            }}
          />
        </CardContent>
        <CardFooter>
          <WizardNavigation
            onBack={onBack}
            onNext={onNext}
            nextButtonText={content.nextButtonText}
          />
        </CardFooter>
      </Card>

      <EditorOrchestrator
        draft={draft}
        editingSection={editingSection}
        onCloseEditor={onCloseEditor}
        onUpdateContent={onUpdateContent}
      />
    </>
  );
}
