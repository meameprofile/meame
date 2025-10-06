// RUTA: src/components/features/campaign-suite/Step4_Content/ContentEditor/ContentEditorBody.tsx
/**
 * @file ContentEditorBody.tsx
 * @description Cuerpo del editor de contenido, ahora con higiene de código de élite.
 * @version 6.0.0 (Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Form, Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { SchemaFieldRenderer } from "@/components/features/form-builder/builder/SchemaFieldRenderer";
// --- [INICIO DE REFACTORIZACIÓN DE CONTRATO] ---
import {
  ROUTING_LOCALES as supportedLocales,
  type Locale,
} from "@/shared/lib/i18n/i18n.config";
// --- [FIN DE REFACTORIZACIÓN DE CONTRATO] ---
import { logger } from "@/shared/lib/logging";

interface ContentEditorBodyProps {
  form: UseFormReturn<z.infer<z.ZodObject<z.ZodRawShape>>>;
  activeLocale: Locale;
  setActiveLocale: (locale: Locale) => void;
  sectionSchema: z.ZodObject<z.ZodRawShape>;
  onPersistChange: (field: string, value: unknown) => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  sectionName: string;
}

export function ContentEditorBody({
  form,
  activeLocale,
  setActiveLocale,
  sectionSchema,
  onPersistChange,
  onSubmit,
  sectionName,
}: ContentEditorBodyProps): React.ReactElement {
  logger.trace("[ContentEditorBody v6.0] Renderizando.");
  const fieldsToRender = Object.keys(sectionSchema.shape);

  return (
    <div className="p-6 flex-grow overflow-y-auto">
      <Tabs
        value={activeLocale}
        onValueChange={(value) => setActiveLocale(value as Locale)}
        className="h-full flex flex-col"
      >
        <TabsList>
          {/* Se añade el tipo explícito para resolver TS7006 */}
          {supportedLocales.map((locale: Locale) => (
            <TabsTrigger key={locale} value={locale}>
              {locale.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-grow mt-4 overflow-y-auto pr-2">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              {fieldsToRender.map((fieldName) => (
                <SchemaFieldRenderer
                  key={`${activeLocale}-${fieldName}`}
                  control={form.control}
                  sectionName={sectionName}
                  fieldName={fieldName}
                  fieldSchema={sectionSchema.shape[fieldName]}
                  onValueChange={onPersistChange}
                />
              ))}
            </form>
          </Form>
        </div>
      </Tabs>
    </div>
  );
}
