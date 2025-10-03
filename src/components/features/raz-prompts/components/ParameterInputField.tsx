// RUTA: src/components/features/raz-prompts/_components/ParameterInputField.tsx
/**
 * @file ParameterInputField.tsx
 * @description Aparato de presentación hiper-atómico para un campo de input numérico
 *              de parámetros de IA. Cumple los 7 Pilares de Calidad.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import type { CreatePromptFormData } from "@/shared/hooks/raz-prompts/use-prompt-creator";
import { logger } from "@/shared/lib/logging";

interface ParameterInputFieldProps {
  control: Control<CreatePromptFormData>;
  name: keyof CreatePromptFormData["parameters"];
  label: string;
  placeholder: string;
}

export function ParameterInputField({
  control,
  name,
  label,
  placeholder,
}: ParameterInputFieldProps): React.ReactElement {
  logger.trace(`[ParameterInputField] Renderizando para: ${name}`);
  return (
    <FormField
      control={control}
      name={`parameters.${name}`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder={placeholder}
              {...field}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? undefined : Number(e.target.value)
                )
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
// RUTA: src/components/features/raz-prompts/_components/ParameterInputField.tsx
