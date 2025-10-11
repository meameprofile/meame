// RUTA: src/components/features/campaign-suite/_components/shared/VariantInputField.tsx
/**
 * @file VariantInputField.tsx
 * @description Componente atómico para un campo <Input>.
 *              v5.1.0 (Generic Type Integrity Restoration): Se corrige la firma
 *              de la función para pasar correctamente el tipo genérico a las props,
 *              resolviendo un error crítico de TypeScript (TS2314).
 * @version 5.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";

interface VariantInputFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: React.ReactNode;
  placeholder: string;
  description?: React.ReactNode;
}

export function VariantInputField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
}: VariantInputFieldProps<TFieldValues>): React.ReactElement {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
