// RUTA: src/components/features/raz-prompts/components/PromptCreatorForm.tsx
/**
 * @file PromptCreatorForm.tsx
 * @description Orquestador de presentación de élite para el creador de prompts.
 *              Ensambla grupos de campos atómicos para una máxima granularidad.
 * @version 9.0.0 (Architectural Integrity & Elite Compliance)
 * @author L.I.A. Legacy
 */
"use client";

import React, { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { motion, type Variants } from "framer-motion";
import {
  Form,
  Button,
  DynamicIcon,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui";
import { FormFieldGroup } from "@/components/features/form-builder/FormFieldGroup";
import { SesaTagsFormGroup } from "./SesaTagsFormGroup";
import { ParameterSelectorsGroup } from "./ParameterSelectorsGroup";
import { PromptIdentityGroup } from "./PromptIdentityGroup";
import { PromptDiscoveryGroup } from "./PromptDiscoveryGroup";
import type { CreatePromptFormData } from "@/shared/hooks/raz-prompts/use-prompt-creator";
import type { z } from "zod";
import type { PromptCreatorContentSchema } from "@/shared/lib/schemas/raz-prompts/prompt-creator.i18n.schema";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "../../dev-tools";

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
    () => logger.startTrace("PromptCreatorForm_v9.0"),
    []
  );
  logger.info("[PromptCreatorForm] Renderizando orquestador v9.0.", {
    traceId,
  });

  // --- Guardián de Resiliencia de Contrato ---
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

            <motion.div variants={fieldVariants}>
              <FormFieldGroup label={content.tagsGroupLabel}>
                <SesaTagsFormGroup
                  control={form.control}
                  content={{
                    ...content.sesaLabels,
                    options: content.sesaOptions,
                  }}
                />
              </FormFieldGroup>
            </motion.div>

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
