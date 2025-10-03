// RUTA: src/components/features/form-builder/builder/SchemaFieldRenderer/components/FieldControl.tsx
/**
 * @file FieldControl.tsx
 * @description Componente despachador puro. Interpreta metadatos de schema
 *              y renderiza el componente de campo atómico apropiado.
 * @version 6.0.0 (Elite Observability & Resilience)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { FieldValues } from "react-hook-form";
import { logger } from "@/shared/lib/logging";
import type { FieldComponentProps } from "../_types/field.types";
import { useFieldMetadata } from "../_hooks/use-field-metadata";
import { FieldWrapper } from "./FieldWrapper";
import * as Fields from "./fields";

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
  logger.trace(
    `[FieldControl] Despachando campo '${String(fieldName)}' con control: ${metadata.controlType}`
  );

  const renderField = () => {
    const props = { field, fieldSchema, onValueChange, fieldName };
    switch (metadata.controlType) {
      case "switch":
        return <Fields.BooleanField {...props} />;
      case "select":
        return (
          <Fields.EnumField {...props} placeholder={metadata.placeholder} />
        );
      case "image":
        return <Fields.ImageField {...props} />;
      case "input": // Este es el caso por defecto
      default:
        // Aquí podríamos tener más lógica para diferenciar entre 'input' y 'textarea'
        // basándonos en 'ui:control' si fuera necesario.
        return (
          <Fields.StringField {...props} placeholder={metadata.placeholder} />
        );
    }
  };

  return (
    <FieldWrapper
      metadata={metadata}
      sectionName={sectionName}
      fieldName={String(fieldName)}
    >
      {renderField()}
    </FieldWrapper>
  );
}
