// RUTA: src/components/features/campaign-suite/_components/WizardNavigation.tsx (NIVELADO)
/**
 * @file WizardNavigation.tsx
 * @description Aparato de UI atómico para la navegación del asistente, ahora
 *              consciente del contexto para una UX de élite.
 * @version 2.0.0 (Context-Aware & Elite UX)
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
  isFirstStep?: boolean; // <-- NUEVA PROP
  isPending?: boolean;
  backButtonText?: string;
  nextButtonText?: string;
  loadingText?: string;
}

export function WizardNavigation({
  onBack,
  onNext,
  isFirstStep = false, // <-- VALOR POR DEFECTO
  isPending = false,
  backButtonText = "Retroceder",
  nextButtonText = "Guardar y Continuar",
  loadingText = "Guardando...",
}: WizardNavigationProps): React.ReactElement {
  logger.trace("[WizardNavigation] Renderizando botones de navegación v2.0.");
  return (
    <div className="flex justify-between items-center pt-6 border-t">
      {/* --- RENDERIZADO CONDICIONAL PARA UNA UX LIMPIA --- */}
      {isFirstStep ? (
        <div /> /* Un div vacío para mantener el layout con justify-between */
      ) : (
        <Button variant="ghost" onClick={onBack} disabled={isPending}>
          {backButtonText}
        </Button>
      )}
      {/* --- FIN RENDERIZADO CONDICIONAL --- */}

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
