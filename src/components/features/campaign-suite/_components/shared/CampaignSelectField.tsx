// RUTA: src/components/features/campaign-suite/_components/shared/CampaignSelectField.tsx
/**
 * @file CampaignSelectField.tsx
 * @description Componente atómico para un campo <Select>, con integridad de ruta restaurada.
 * @version 3.0.0 (Architectural Integrity Restoration)
 * @author L.I.A. Legacy
 */
"use client";

import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField } from "@/components/ui/Form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
// --- [INICIO DE RESTAURACIÓN DE INTEGRIDAD ARQUITECTÓNICA] ---
import { FormFieldGroup } from "@/components/features/form-builder/FormFieldGroup";
// --- [FIN DE RESTAURACIÓN DE INTEGRIDAD ARQUITECTÓNICA] ---

interface CampaignSelectFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder: string;
  description?: string;
  options: { value: string; label: string }[];
}

export function CampaignSelectField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  options,
}: CampaignSelectFieldProps<TFieldValues>): React.ReactElement {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormFieldGroup label={label} description={description}>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormFieldGroup>
      )}
    />
  );
}
