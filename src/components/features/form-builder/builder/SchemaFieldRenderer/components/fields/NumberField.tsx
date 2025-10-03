// components/forms/builder/SchemaFieldRenderer/_components/fields/NumberField.tsx
/**
 * @file NumberField.tsx
 * @description Aparato hiper-atómico para renderizar un control <Input type="number">.
 * @version 1.0.0 (Elite Engine)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import type { FieldComponentProps } from "../../_types/field.types";
import { logger } from "@/shared/lib/logging";

export function NumberField<TFieldValues extends FieldValues>({
  field,
  onValueChange,
  fieldName,
}: FieldComponentProps<TFieldValues>): React.ReactElement {
  logger.trace(`[NumberField] Renderizando para campo: ${String(fieldName)}`);
  return (
    <Input
      type="number"
      {...field}
      value={field.value ?? ""}
      onBlur={(e) => {
        field.onBlur();
        const numValue = e.target.value === "" ? null : Number(e.target.value);
        onValueChange(fieldName, numValue);
      }}
      className="transition-all duration-200 hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary"
    />
  );
}
// components/forms/builder/SchemaFieldRenderer/_components/fields/NumberField.tsx
