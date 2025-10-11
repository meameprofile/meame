// RUTA: src/components/features/form-builder/builder/SchemaFieldRenderer/_components/fields/BooleanField.tsx
/**
 * @file BooleanField.tsx
 * @description Aparato hiper-atómico para renderizar un control <Switch>.
 * @version 1.1.0 (Syntax Restoration & Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { FieldValues } from "react-hook-form";

import { Switch } from "@/components/ui/Switch";
import { logger } from "@/shared/lib/logging";

import type { FieldComponentProps } from "../../_types/field.types";

export function BooleanField<TFieldValues extends FieldValues>({
  field,
  onValueChange,
  fieldName,
}: FieldComponentProps<TFieldValues>): React.ReactElement {
  logger.trace(`[BooleanField] Renderizando para campo: ${String(fieldName)}`);
  return (
    <div className="flex items-center space-x-2 h-10 group">
      <Switch
        checked={field.value}
        onCheckedChange={(checked) => {
          field.onChange(checked);
          onValueChange(fieldName, checked);
        }}
        className="transition-all duration-200 group-hover:scale-105 group-focus-within:ring-2 group-focus-within:ring-primary"
      />
    </div>
  );
}
