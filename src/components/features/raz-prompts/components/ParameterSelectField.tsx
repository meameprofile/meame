// RUTA: src/components/features/raz-prompts/components/ParameterSelectField.tsx
/**
 * @file ParameterSelectField.tsx
 * @description Aparato de presentación hiper-atómico para un campo de selección
 *              de parámetros de IA. Cumple los 8 Pilares de Calidad.
 * @version 3.0.0 (Type-Safe Nested Path)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { Control, Path } from "react-hook-form";
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
import type { CreatePromptFormData } from "@/shared/hooks/raz-prompts/use-prompt-creator";
import { logger } from "@/shared/lib/logging";

interface ParameterSelectFieldProps {
  control: Control<CreatePromptFormData>;
  // --- [INICIO DE REFACTORIZACIÓN DE CONTRATO] ---
  // La prop 'name' ahora es segura para campos anidados.
  name: Path<CreatePromptFormData>;
  // --- [FIN DE REFACTORIZACIÓN DE CONTRATO] ---
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
}

export function ParameterSelectField({
  control,
  name,
  label,
  placeholder,
  options,
}: ParameterSelectFieldProps): React.ReactElement {
  logger.trace(`[ParameterSelectField] Renderizando para: ${name}`);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={String(field.value ?? "")}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
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
  );
}
