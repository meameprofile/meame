// app/[locale]/(dev)/dev/campaign-suite/_components/WizardNavigation.tsx
/**
 * @file WizardNavigation.tsx
 * @description Aparato de UI atómico y genérico para la navegación del asistente.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { logger } from "@/shared/lib/logging";

interface WizardNavigationProps {
  onBack: () => void;
  onNext: () => void;
  isPending?: boolean;
  backButtonText?: string;
  nextButtonText?: string;
  loadingText?: string;
}

export function WizardNavigation({
  onBack,
  onNext,
  isPending = false,
  backButtonText = "Retroceder",
  nextButtonText = "Guardar y Continuar",
  loadingText = "Guardando...",
}: WizardNavigationProps): React.ReactElement {
  logger.trace("[WizardNavigation] Renderizando botones de navegación.");
  return (
    <div className="flex justify-between items-center pt-6 border-t">
      <Button variant="ghost" onClick={onBack} disabled={isPending}>
        {backButtonText}
      </Button>
      <Button onClick={onNext} variant="default" disabled={isPending}>
        {isPending && (
          <DynamicIcon
            name="LoaderCircle"
            className="mr-2 h-4 w-4 animate-spin"
          />
        )}
        {isPending ? loadingText : nextButtonText}
      </Button>
    </div>
  );
}
// app/[locale]/(dev)/dev/campaign-suite/_components/WizardNavigation.tsx
