// RUTA: src/components/features/campaign-suite/TemplateBrowser/_components/TemplateCard.tsx
/**
 * @file TemplateCard.tsx
 * @description Componente de presentación atómico, con observabilidad y resiliencia.
 * @version 3.0.0 (Resilient & Observable)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion } from "framer-motion";
import React from "react";

import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
import { DynamicIcon } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";
import { TiltCard } from "@/components/ui/TiltCard";
import { logger } from "@/shared/lib/logging";
import type { CampaignTemplate } from "@/shared/lib/schemas/campaigns/template.schema";

interface TemplateCardProps {
  template: CampaignTemplate;
  onSelect: () => void;
  isPending: boolean;
}

export function TemplateCard({
  template,
  onSelect,
  isPending,
}: TemplateCardProps) {
  // --- INICIO: PILAR III (FULL OBSERVABILIDAD) ---
  // El logging ahora está correctamente formateado dentro de la función.
  logger.info(
    `[Observabilidad][CLIENTE] Renderizando TemplateCard para: ${template?.name || "Plantilla Desconocida"}`
  );
  // --- FIN: PILAR III ---

  // --- INICIO: GUARDIÁN DE RESILIENCIA ---
  if (!template || !template.name || !template.createdAt) {
    const errorMessage = "Datos de plantilla incompletos o inválidos.";
    logger.error(`[Guardián de Resiliencia] ${errorMessage}`, {
      templateData: template,
    });
    return (
      <Card className="h-full flex items-center justify-center p-4 border-destructive">
        <DeveloperErrorDisplay
          context="TemplateCard"
          errorMessage={errorMessage}
        />
      </Card>
    );
  }
  // --- FIN: GUARDIÁN DE RESILIENCIA ---

  const formattedDate = new Date(template.createdAt).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <TiltCard className="h-full">
        <Card className="h-full flex flex-col transition-all duration-300 ease-in-out hover:border-primary hover:shadow-2xl hover:shadow-primary/20">
          <CardHeader>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>
              {template.description || "Sin descripción."}
            </CardDescription>
          </CardHeader>
          <div className="flex-grow p-6 pt-0 text-sm text-muted-foreground">
            Creada: {formattedDate}
          </div>
          <CardFooter>
            <Button onClick={onSelect} disabled={isPending} className="w-full">
              {isPending ? (
                <DynamicIcon
                  name="LoaderCircle"
                  className="mr-2 h-4 w-4 animate-spin"
                />
              ) : (
                <DynamicIcon name="Wand" className="mr-2 h-4 w-4" />
              )}
              Usar esta Plantilla
            </Button>
          </CardFooter>
        </Card>
      </TiltCard>
    </motion.div>
  );
}
