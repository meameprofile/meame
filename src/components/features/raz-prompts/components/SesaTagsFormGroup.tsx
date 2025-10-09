// RUTA: src/components/features/raz-prompts/components/SesaTagsFormGroup.tsx
/**
 * @file SesaTagsFormGroup.tsx
 * @description Aparato de presentación atómico para la cuadrícula de selectores SESA.
 *              v5.0.0 (Architectural Restoration): Se elimina el componente
 *              FormFieldGroup obsoleto para adherirse al PRU.
 * @version 5.0.0
 * @author L.I.A. Legacy
 */
"use client";
import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import {
  RaZPromptsSesaTagsSchema,
  type RaZPromptsSesaTags,
} from "@/shared/lib/schemas/raz-prompts/atomic.schema";
import type { PromptCreatorContentSchema } from "@/shared/lib/schemas/raz-prompts/prompt-creator.i18n.schema";
import { logger } from "@/shared/lib/logging";
import type { z } from "zod";

type SesaContent = Pick<
  z.infer<typeof PromptCreatorContentSchema>,
  "sesaLabels" | "sesaOptions"
>;

interface SesaTagsFormGroupProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  content: {
    [K in keyof SesaContent["sesaLabels"]]: string;
  } & {
    options: SesaContent["sesaOptions"];
  };
}

const sesaFields: (keyof RaZPromptsSesaTags)[] = Object.keys(
  RaZPromptsSesaTagsSchema.shape
) as (keyof RaZPromptsSesaTags)[];

export function SesaTagsFormGroup<TFieldValues extends FieldValues>({
  control,
  content,
}: SesaTagsFormGroupProps<TFieldValues>) {
  logger.trace(
    "[SesaTagsFormGroup] Renderizando cuadrícula de tags SESA v5.0."
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {sesaFields.map((tagName) => (
        <FormField
          key={tagName}
          control={control}
          name={`tags.${tagName}` as Path<TFieldValues>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{content[tagName]}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {content.options[tagName].map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
