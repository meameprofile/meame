// RUTA: src/components/features/form-builder/builder/SchemaFieldRenderer/_types/field.types.ts
/**
 * @file field.types.ts
 * @description SSoT para los contratos de tipos del Motor de Renderizado de UI.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import type { z } from "zod";

/**
 * @interface FieldMetadata
 * @description Contrato para los metadatos de UI extraídos del schema de Zod.
 */
export interface FieldMetadata {
  label: string;
  placeholder?: string;
  description?: string;
  controlType:
    | "input"
    | "textarea"
    | "switch"
    | "select"
    | "image"
    | "array"
    | "color";
}

/**
 * @type FieldComponentProps
 * @description Contrato de props base y genérico para todos los componentes de campo.
 */
export type FieldComponentProps<TFieldValues extends FieldValues> = {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  fieldSchema: z.ZodTypeAny;
  onValueChange: (field: Path<TFieldValues>, value: unknown) => void;
  fieldName: Path<TFieldValues>;
};
