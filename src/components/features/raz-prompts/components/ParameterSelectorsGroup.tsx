// RUTA: src/components/features/raz-prompts/components/ParameterSelectorsGroup.tsx
/**
 * @file ParameterSelectorsGroup.tsx
 * @description Orquestador de presentación para los parámetros de la IA,
 *              con integridad de ruta restaurada y resiliencia de élite.
 * @version 6.0.0 (Architectural Integrity & Elite Resilience)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useMemo } from "react";
import type { Control } from "react-hook-form";
import { motion, type Variants } from "framer-motion";
import { FormLabel } from "@/components/ui"; // <-- SE AÑADE FormLabel
import type { CreatePromptFormData } from "@/shared/hooks/raz-prompts/use-prompt-creator";
import type { z } from "zod";
import { logger } from "@/shared/lib/logging";
import { ParameterSelectField } from "./ParameterSelectField";
import { IDEOGRAM_PARAMETERS_CONFIG } from "@/shared/lib/config/raz-prompts/parameters.config";
import type { PromptCreatorContentSchema } from "@/shared/lib/schemas/raz-prompts/prompt-creator.i18n.schema";
import { DeveloperErrorDisplay } from "../../dev-tools";

type Content = z.infer<typeof PromptCreatorContentSchema>;

interface ParameterSelectorsGroupProps {
  control: Control<CreatePromptFormData>;
  content: Content;
}

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export function ParameterSelectorsGroup({
  control,
  content,
}: ParameterSelectorsGroupProps) {
  const traceId = useMemo(
    () => logger.startTrace("ParameterSelectorsGroup_v6.0"),
    []
  );
  logger.info("[ParameterSelectorsGroup] Renderizando v6.0.", { traceId });

  // --- Guardián de Resiliencia de Contrato ---
  if (!content?.parameterOptions || !content?.sesaLabels) {
    const errorMsg =
      "Contrato de UI violado: Faltan datos de i18n para los parámetros.";
    logger.error(`[Guardián] ${errorMsg}`, { traceId });
    return (
      <DeveloperErrorDisplay
        context="ParameterSelectorsGroup"
        errorMessage={errorMsg}
      />
    );
  }

  return (
    // Se reemplaza FormFieldGroup por un div y un FormLabel soberano.
    <div className="space-y-3">
      <FormLabel>{content.parametersGroupLabel}</FormLabel>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
      >
        {IDEOGRAM_PARAMETERS_CONFIG.map((config) => {
          const options = content.parameterOptions[config.id] || [];
          return (
            <motion.div key={config.id} variants={fieldVariants}>
              <ParameterSelectField
                control={control}
                name={`parameters.${config.id}`}
                label={
                  content.sesaLabels[
                    config.labelKey as keyof typeof content.sesaLabels
                  ]
                }
                placeholder={
                  content.sesaLabels[
                    config.placeholderKey as keyof typeof content.sesaLabels
                  ]
                }
                options={options}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
