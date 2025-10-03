// RUTA: src/components/features/campaign-suite/Step5_Management/_components/ManagementActions.tsx
/**
 * @file ManagementActions.tsx
 * @description Orquestador de presentación puro para el panel de acciones del Paso 5.
 * @version 3.0.0 (Architectural Decoupling & Elite Compliance)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { AlertDialogTrigger } from "@/components/ui/AlertDialog";
import { logger } from "@/shared/lib/logging";
import { SaveAsTemplateDialog } from "./SaveAsTemplateDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { FadingLines, DotsWave } from "@/components/ui/Loaders";
import type { z } from "zod";
import type { Step5ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step5.schema";

type Content = z.infer<typeof Step5ContentSchema>;

interface ManagementActionsProps {
  onBack: () => void;
  onPublish: () => void;
  onPackage: () => void;
  onSaveAsTemplate: (name: string, description: string) => void;
  isPublishing: boolean;
  isPackaging: boolean;
  isDeleting: boolean;
  isSavingTemplate: boolean;
  isLaunchReady: boolean;
  publishButtonText: string;
  packageButtonText: string;
  deleteButtonText: string;
  templateButtonText: string;
  templateDialogContent: Content["templateDialog"];
}

export function ManagementActions({
  onBack,
  onPublish,
  onPackage,
  onSaveAsTemplate,
  isPublishing,
  isPackaging,
  isDeleting,
  isSavingTemplate,
  isLaunchReady,
  publishButtonText,
  packageButtonText,
  deleteButtonText,
  templateButtonText,
  templateDialogContent,
}: ManagementActionsProps): React.ReactElement {
  logger.trace(
    "[ManagementActions] Renderizando orquestador de presentación v3.0."
  );

  const isAnyActionPending =
    isPublishing || isPackaging || isDeleting || isSavingTemplate;
  const isLaunchDisabled = isAnyActionPending || !isLaunchReady;

  return (
    // --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
    // Se elimina el componente <WizardNavigation> y se reemplaza con un layout
    // de Flexbox para un control total y desacoplado de los botones de acción.
    <div className="flex justify-between items-center pt-6 border-t">
      <Button variant="ghost" onClick={onBack} disabled={isAnyActionPending}>
        Retroceder
      </Button>
      <div className="flex flex-wrap gap-2 justify-end">
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isAnyActionPending}>
            {isDeleting && <DotsWave className="mr-2 h-4 w-4" />}
            {deleteButtonText}
          </Button>
        </AlertDialogTrigger>

        <SaveAsTemplateDialog
          onSave={onSaveAsTemplate}
          isSaving={isSavingTemplate}
          isDisabled={isAnyActionPending}
          buttonText={templateButtonText}
          content={templateDialogContent}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block">
                <Button
                  variant="secondary"
                  onClick={onPackage}
                  disabled={isLaunchDisabled}
                >
                  {isPackaging && <FadingLines className="mr-2 h-4 w-4" />}
                  {packageButtonText}
                </Button>
              </div>
            </TooltipTrigger>
            {!isLaunchReady && (
              <TooltipContent>
                <p>
                  Completa el checklist de lanzamiento para habilitar la
                  exportación.
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block">
                <Button
                  onClick={onPublish}
                  disabled={isLaunchDisabled}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isPublishing && <FadingLines className="mr-2 h-4 w-4" />}
                  {publishButtonText}
                </Button>
              </div>
            </TooltipTrigger>
            {!isLaunchReady && (
              <TooltipContent>
                <p>
                  Completa el checklist de lanzamiento para habilitar la
                  publicación.
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
    // --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
  );
}
