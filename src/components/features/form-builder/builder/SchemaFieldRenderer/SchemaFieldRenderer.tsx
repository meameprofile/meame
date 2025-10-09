// RUTA: src/components/features/form-builder/builder/SchemaFieldRenderer/SchemaFieldRenderer.tsx
/**
 * @file SchemaFieldRenderer.tsx
 * @description Orquestador de élite que integra RHF con el motor de renderizado de UI.
 *              v5.0.0 (Barrel File Eradication & Elite Compliance): Se refactorizan
 *              las importaciones para que sean explícitas y se inyecta logging granular.
 * @version 5.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { z } from "zod";
import type { Control, FieldValues, Path } from "react-hook-form";
import { FormField } from "@/components/ui/Form";
import { logger } from "@/shared/lib/logging";

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v5.0.0] ---
// Se eliminó la dependencia del archivo barril (.../components/index.ts).
// Cada componente ahora se importa directamente desde su archivo soberano.
import { FieldControl } from "./components/FieldControl";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v5.0.0] ---

interface SchemaFieldRendererProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  sectionName: string;
  fieldName: Path<TFieldValues>;
  fieldSchema: z.ZodTypeAny;
  onValueChange: (field: Path<TFieldValues>, value: unknown) => void;
}

export function SchemaFieldRenderer<TFieldValues extends FieldValues>({
  control,
  sectionName,
  fieldName,
  fieldSchema,
  onValueChange,
}: SchemaFieldRendererProps<TFieldValues>): React.ReactElement {
  logger.trace(
    `[SchemaFieldRenderer v5.0] Orquestando campo: ${String(
      fieldName
    )} en sección: ${sectionName}`
  );

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FieldControl
          field={field}
          sectionName={sectionName}
          fieldName={fieldName}
          fieldSchema={fieldSchema}
          onValueChange={onValueChange}
        />
      )}
    />
  );
}
