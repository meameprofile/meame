// RUTA: src/components/features/form-builder/builder/SchemaFieldRenderer/_hooks/use-field-metadata.ts
/**
 * @file use-field-metadata.ts
 * @description Hook puro para interpretar las "pistas" de UI desde un schema de Zod.
 * @version 1.2.0 (Syntax Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
import { useMemo } from "react";
import type { z } from "zod";

import { logger } from "@/shared/lib/logging";

import type { FieldMetadata } from "../_types/field.types";

export function useFieldMetadata(
  fieldSchema: z.ZodTypeAny,
  fieldName: string
): FieldMetadata {
  logger.trace(`[useFieldMetadata] Interpretando schema para: ${fieldName}`);

  return useMemo(() => {
    const description = fieldSchema.description || "";
    const hints = new Map<string, string>();
    description.split("|").forEach((part) => {
      const [key, ...valueParts] = part.split(":");
      if (key && valueParts.length > 0) {
        hints.set(key.trim(), valueParts.join(":").trim());
      }
    });

    const typeName = fieldSchema._def.typeName;
    let controlType: FieldMetadata["controlType"] = "input";

    if (hints.get("ui:control") as FieldMetadata["controlType"]) {
      controlType = hints.get("ui:control") as FieldMetadata["controlType"];
    } else if (typeName === "ZodBoolean") {
      controlType = "switch";
    } else if (typeName === "ZodEnum") {
      controlType = "select";
    } else if (
      typeName === "ZodString" &&
      (description.includes("image_url") ||
        description.includes("image_asset_id"))
    ) {
      controlType = "image";
    }

    return {
      label:
        hints.get("ui:label") ||
        fieldName
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
      placeholder: hints.get("ui:placeholder"),
      description: hints.get("ui:description"),
      controlType,
    };
  }, [fieldSchema, fieldName]);
}
