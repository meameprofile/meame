// RUTA: src/components/features/campaign-suite/_components/shared/CampaignSelectField.tsx
/**
 * @file CampaignSelectField.tsx
 * @description Componente atómico para un campo <Select>.
 *              v5.1.0 (Generic Type Integrity Restoration): Se corrige la firma
 *              de la función para pasar correctamente el tipo genérico a las props,
 *              resolviendo un error crítico de TypeScript (TS2314).
 * @version 5.1.0
 * @author L.I.A. Legacy
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

interface CampaignSelectFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: React.ReactNode;
  placeholder: string;
  description?: React.ReactNode;
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
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
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
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
