// RUTA: src/components/features/campaign-suite/_components/shared/VariantInputField.tsx
/**
 * @file VariantInputField.tsx
 * @description Componente atómico para un campo <Input>, con integridad de ruta restaurada.
 * @version 3.0.0 (Architectural Integrity Restoration)
 * @author L.I.A. Legacy
 */
"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
// --- [INICIO DE RESTAURACIÓN DE INTEGRIDAD ARQUITECTÓNICA] ---
import { FormFieldGroup } from "@/components/features/form-builder/FormFieldGroup";
// --- [FIN DE RESTAURACIÓN DE INTEGRIDAD ARQUITECTÓNICA] ---

interface VariantInputFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder: string;
  description?: string;
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
        <FormFieldGroup label={label} description={description}>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
        </FormFieldGroup>
      )}
    />
  );
}
