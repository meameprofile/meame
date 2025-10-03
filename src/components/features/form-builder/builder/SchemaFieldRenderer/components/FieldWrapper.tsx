// RUTA: src/components/features/form-builder/builder/SchemaFieldRenderer/components/FieldWrapper.tsx
/**
 * @file FieldWrapper.tsx
 * @description Componente de envoltura de alto orden para campos de formulario.
 *              v4.0.0 (Elite Observability): Inyectado con logging granular para
 *              trazar los eventos de foco del usuario.
 * @version 4.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/Form";
import { useFocusStore } from "@/components/features/campaign-suite/_context/FocusContext";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import type { FieldMetadata } from "../_types/field.types";

interface FieldWrapperProps {
  children: React.ReactNode;
  metadata: FieldMetadata;
  sectionName: string;
  fieldName: string;
}

export function FieldWrapper({
  children,
  metadata,
  sectionName,
  fieldName,
}: FieldWrapperProps): React.ReactElement {
  logger.trace(`[FieldWrapper] Envolviendo campo: ${fieldName}`);
  const { setFocus, clearFocus } = useFocusStore();

  const handleFocus = () => {
    logger.trace(`[Focus] Foco establecido en: ${sectionName}.${fieldName}`);
    setFocus(sectionName, fieldName);
  };

  const handleBlur = () => {
    logger.trace(`[Focus] Foco liberado de: ${sectionName}.${fieldName}`);
    clearFocus();
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
      <FormControl>{children}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
