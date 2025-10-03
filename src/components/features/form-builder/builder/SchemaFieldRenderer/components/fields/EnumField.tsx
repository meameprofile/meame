// RUTA: src/components/features/form-builder/builder/SchemaFieldRenderer/_components/fields/EnumField.tsx
/**
 * @file EnumField.tsx
 * @description Aparato hiper-atómico para renderizar un control <Select> para campos Zod enum.
 * @version 1.0.0 (Elite Engine)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { FieldValues } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import type { FieldComponentProps } from "../../_types/field.types";
import { logger } from "@/shared/lib/logging";
import type { z } from "zod";

interface EnumFieldProps<TFieldValues extends FieldValues>
  extends FieldComponentProps<TFieldValues> {
  placeholder?: string;
}

export function EnumField<TFieldValues extends FieldValues>({
  field,
  onValueChange,
  fieldName,
  fieldSchema,
  placeholder,
}: EnumFieldProps<TFieldValues>): React.ReactElement {
  logger.trace(`[EnumField] Renderizando para: ${String(fieldName)}`);

  const enumOptions = (fieldSchema as z.ZodEnum<[string, ...string[]]>)._def
    .values;

  return (
    <Select
      onValueChange={(value) => {
        field.onChange(value);
        onValueChange(fieldName, value);
      }}
      defaultValue={field.value}
    >
      <SelectTrigger
        onBlur={field.onBlur}
        ref={field.ref}
        className="transition-all duration-200 hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary"
      >
        <SelectValue placeholder={placeholder || "Selecciona una opción"} />
      </SelectTrigger>
      <SelectContent>
        {enumOptions.map((option: string) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
