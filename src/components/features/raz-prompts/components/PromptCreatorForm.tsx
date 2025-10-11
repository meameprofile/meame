// RUTA: src/components/features/raz-prompts/components/PromptCreatorForm.tsx
/**
 * @file PromptCreatorForm.tsx
 * @description Orquestador de presentación de élite para el creador de prompts.
 *              v10.0.0 (Architectural Integrity Restoration): Se elimina el
 *              anti-patrón FormFieldGroup para restaurar la integridad del
 *              contexto de react-hook-form.
 * @version 10.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { motion, type Variants } from "framer-motion";
import React, { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import {
  Form,
  Button,
  DynamicIcon,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  FormLabel, // Se importa FormLabel para reemplazar FormFieldGroup
} from "@/components/ui";
import type { CreatePromptFormData } from "@/shared/hooks/raz-prompts/use-prompt-creator";
import { logger } from "@/shared/lib/logging";
import type { PromptCreatorContentSchema } from "@/shared/lib/schemas/raz-prompts/prompt-creator.i18n.schema";

import { DeveloperErrorDisplay } from "../../dev-tools";

import { ParameterSelectorsGroup } from "./ParameterSelectorsGroup";
import { PromptDiscoveryGroup } from "./PromptDiscoveryGroup";
import { PromptIdentityGroup } from "./PromptIdentityGroup";
import { SesaTagsFormGroup } from "./SesaTagsFormGroup";

type Content = z.infer<typeof PromptCreatorContentSchema>;

interface PromptCreatorFormProps {
  form: UseFormReturn<CreatePromptFormData>;
  onSubmit: (data: CreatePromptFormData) => void;
  isPending: boolean;
  content: Content;
}

const formContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

export function PromptCreatorForm({
  form,
  onSubmit,
  isPending,
  content,
}: PromptCreatorFormProps) {
  const traceId = useMemo(
    () => logger.startTrace("PromptCreatorForm_v10.0"),
    []
  );
  logger.info("[PromptCreatorForm] Renderizando orquestador v10.0.", {
    traceId,
  });

  if (!content) {
    const errorMsg = "Contrato de UI violado: La prop 'content' es requerida.";
    logger.error(`[Guardián] ${errorMsg}`, { traceId });
    return (
      <DeveloperErrorDisplay
        context="PromptCreatorForm"
        errorMessage={errorMsg}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.titleLabel}</CardTitle>
        <CardDescription>{content.formDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <motion.form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            variants={formContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <PromptIdentityGroup
              control={form.control}
              content={content}
              variants={fieldVariants}
            />

            {/* --- INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA --- */}
            <motion.div variants={fieldVariants} className="space-y-3">
              <FormLabel>{content.tagsGroupLabel}</FormLabel>
              <SesaTagsFormGroup
                control={form.control}
                content={{
                  ...content.sesaLabels,
                  options: content.sesaOptions,
                }}
              />
            </motion.div>
            {/* --- FIN DE REFACTORIZACIÓN ARQUITECTÓNICA --- */}

            <motion.div variants={fieldVariants}>
              <ParameterSelectorsGroup
                control={form.control}
                content={content}
              />
            </motion.div>

            <PromptDiscoveryGroup
              control={form.control}
              content={content}
              variants={fieldVariants}
            />

            <motion.div
              variants={fieldVariants}
              className="flex justify-end pt-4 border-t"
            >
              <Button type="submit" disabled={isPending} size="lg">
                {isPending && (
                  <DynamicIcon
                    name="LoaderCircle"
                    className="mr-2 h-4 w-4 animate-spin"
                  />
                )}
                {isPending
                  ? content.submitButtonLoadingText
                  : content.submitButtonText}
              </Button>
            </motion.div>
          </motion.form>
        </Form>
      </CardContent>
    </Card>
  );
}
