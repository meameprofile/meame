// RUTA: src/components/features/form-builder/builder/SchemaFieldRenderer/components/FieldControl.tsx
/**
 * @file FieldControl.tsx
 * @description Componente despachador y de envoltura. Interpreta metadatos de
 *              schema y renderiza el campo de formulario atómico apropiado
 *              dentro de un FormItem contextualizado.
 * @version 8.0.0 (Architectural Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { FieldValues } from "react-hook-form";

import { useFocusStore } from "@/components/features/campaign-suite/_context/FocusContext";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/Form";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";

import { useFieldMetadata } from "../_hooks/use-field-metadata";
import type { FieldComponentProps } from "../_types/field.types";

// Importaciones directas a los componentes de campo atómicos
import { BooleanField } from "./fields/BooleanField";
import { EnumField } from "./fields/EnumField";
import { ImageField } from "./fields/ImageField/ImageField";
import { StringField } from "./fields/StringField";

interface FieldControlProps<TFieldValues extends FieldValues>
  extends FieldComponentProps<TFieldValues> {
  sectionName: string;
}

export function FieldControl<TFieldValues extends FieldValues>({
  field,
  sectionName,
  fieldName,
  fieldSchema,
  onValueChange,
}: FieldControlProps<TFieldValues>): React.ReactElement {
  const metadata = useFieldMetadata(fieldSchema, String(fieldName));
  const { setFocus, clearFocus } = useFocusStore();
  logger.trace(
    `[FieldControl] Despachando campo '${String(
      fieldName
    )}' con control: ${metadata.controlType}`
  );

  const handleFocus = () => {
    logger.trace(
      `[Focus] Foco establecido en: ${sectionName}.${String(fieldName)}`
    );
    setFocus(sectionName, String(fieldName));
  };
  const handleBlur = () => {
    logger.trace(
      `[Focus] Foco liberado de: ${sectionName}.${String(fieldName)}`
    );
    clearFocus();
  };

  const renderField = () => {
    const props = { field, fieldSchema, onValueChange, fieldName };
    switch (metadata.controlType) {
      case "switch":
        return <BooleanField {...props} />;
      case "select":
        return <EnumField {...props} placeholder={metadata.placeholder} />;
      case "image":
        return <ImageField {...props} />;
      case "input":
      default:
        return <StringField {...props} placeholder={metadata.placeholder} />;
    }
  };

  return (
    <FormItem onFocus={handleFocus} onBlur={handleBlur} className="group">
      <FormLabel
        className={cn(
          "transition-colors duration-200",
          "group-focus-within:text-primary"
        )}
      >
        {metadata.label}
      </FormLabel>
      {metadata.description && (
        <FormDescription>{metadata.description}</FormDescription>
      )}
      <FormControl>{renderField()}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
