// RUTA: src/components/features/cogniread/editor/tabs/StudyDnaTab.tsx
/**
 * @file StudyDnaTab.tsx
 * @description Componente de presentación para la pestaña "ADN del Estudio",
 *              ahora con la funcionalidad de extracción por IA integrada.
 * @version 4.1.0 (Build Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";

import { SchemaFieldRenderer } from "@/components/features/form-builder/builder/SchemaFieldRenderer";
import {
  Form,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Separator,
} from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import {
  StudyDnaSchema,
  type CogniReadArticle,
  type StudyDna,
} from "@/shared/lib/schemas/cogniread/article.schema";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

import { StudyDnaExtractor } from "./StudyDnaExtractor";

type StudyDnaTabContent = NonNullable<
  Dictionary["cogniReadEditor"]
>["studyDnaTab"];

interface StudyDnaTabProps {
  form: UseFormReturn<CogniReadArticle>;
  content: StudyDnaTabContent;
}

export function StudyDnaTab({ form, content }: StudyDnaTabProps) {
  logger.info("[StudyDnaTab] Renderizando v4.1 (Build Integrity Restoration).");
  const dnaFields = Object.keys(StudyDnaSchema.shape) as (keyof StudyDna)[];

  const handleExtractionSuccess = (extractedData: StudyDna) => {
    logger.info(
      "[StudyDnaTab] Datos recibidos desde el extractor. Actualizando formulario..."
    );
    form.reset({ ...form.getValues(), studyDna: extractedData });
  };

  return (
    <div className="space-y-8">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-semibold text-primary">
            {content.extractor.accordionTitle}
          </AccordionTrigger>
          <AccordionContent>
            <StudyDnaExtractor
              onExtractionSuccess={handleExtractionSuccess}
              content={content.extractor}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      <Form {...form}>
        <div className="space-y-8">
          {dnaFields.map((fieldName) => (
            <SchemaFieldRenderer
              key={fieldName}
              control={form.control}
              sectionName="studyDna"
              fieldName={`studyDna.${fieldName}`}
              fieldSchema={StudyDnaSchema.shape[fieldName]}
              onValueChange={() => {}}
            />
          ))}
        </div>
      </Form>
    </div>
  );
}
