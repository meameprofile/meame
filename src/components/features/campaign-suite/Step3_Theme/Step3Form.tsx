// RUTA: src/components/features/campaign-suite/Step3_Theme/Step3Form.tsx
/**
 * @file Step3Form.tsx
 * @description Orquestador de presentación puro para el Paso 3, inyectado con MEA/UX y resiliencia.
 * @version 8.0.0 (MEA/UX Injection & Elite Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { logger } from "@/shared/lib/logging";
import type { ThemeConfig } from "@/shared/lib/types/campaigns/draft.types";
import { WizardNavigation } from "@/components/features/campaign-suite/_components/WizardNavigation";
import type { Step3ContentSchema } from "@/shared/lib/schemas/campaigns/steps/step3.schema";
import type { z } from "zod";
import { DynamicIcon } from "@/components/ui";
import { DeveloperErrorDisplay } from "../../dev-tools";

type Content = z.infer<typeof Step3ContentSchema>;

interface Step3FormProps {
  content: Content;
  themeConfig: ThemeConfig;
  onBack: () => void;
  onNext: () => void;
  onLaunchComposer: () => void;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export function Step3Form({
  content,
  themeConfig,
  onBack,
  onNext,
  onLaunchComposer,
}: Step3FormProps): React.ReactElement {
  logger.trace(
    "[Step3Form] Renderizando formulario de presentación v8.0 (MEA/UX)."
  );

  if (!content || !themeConfig) {
    return (
      <DeveloperErrorDisplay
        context="Step3Form"
        errorMessage="Faltan props de contenido o configuración."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
        <CardDescription>{content.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          className="space-y-4 p-6 border rounded-lg bg-muted/20"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="font-semibold text-lg text-foreground">Tema Activo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <p>
              <strong>{content.colorsLabel}:</strong>{" "}
              <span className="font-mono text-primary">
                {themeConfig.colorPreset || "Default"}
              </span>
            </p>
            <p>
              <strong>{content.fontsLabel}:</strong>{" "}
              <span className="font-mono text-primary">
                {themeConfig.fontPreset || "Default"}
              </span>
            </p>
            <p>
              <strong>{content.radiiLabel}:</strong>{" "}
              <span className="font-mono text-primary">
                {themeConfig.radiusPreset || "Default"}
              </span>
            </p>
          </div>
          <Button variant="outline" onClick={onLaunchComposer} className="mt-4">
            <DynamicIcon name="Palette" className="mr-2 h-4 w-4" />
            {content.composerTitle}
          </Button>
        </motion.div>
      </CardContent>
      <CardFooter>
        <WizardNavigation
          onBack={onBack}
          onNext={onNext}
          nextButtonText={content.nextButtonText}
        />
      </CardFooter>
    </Card>
  );
}
