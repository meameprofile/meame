// RUTA: src/components/features/cogniread/editor/tabs/ContentTab.tsx
/**
 * @file ContentTab.tsx
 * @description Componente de presentación para la pestaña "Contenido Multilingüe", ahora internacionalizado.
 * @version 3.0.0 (Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
// --- [INICIO DE REFACTORIZACIÓN DE CONTRATO] ---
import {
  ROUTING_LOCALES as supportedLocales,
  type Locale,
} from "@/shared/lib/i18n/i18n.config";
// --- [FIN DE REFACTORIZACIÓN DE CONTRATO] ---
import { logger } from "@/shared/lib/logging";
import type { CogniReadArticle } from "@/shared/lib/schemas/cogniread/article.schema";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

type ContentTabContent = NonNullable<
  Dictionary["cogniReadEditor"]
>["contentTab"];

interface ContentTabProps {
  form: UseFormReturn<CogniReadArticle>;
  content: ContentTabContent; // Recibir content
}

export function ContentTab({
  form,
  content,
}: ContentTabProps): React.ReactElement {
  logger.trace(
    "[ContentTab] Renderizando formulario de contenido multilingüe v3.0."
  );

  return (
    <Form {...form}>
      <div className="space-y-8">
        <Tabs defaultValue={supportedLocales[0]} className="w-full">
          <TabsList>
            {/* Se añade el tipo explícito para resolver TS7006 */}
            {supportedLocales.map((locale: Locale) => (
              <TabsTrigger key={locale} value={locale}>
                {locale.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>

          {supportedLocales.map((locale: Locale) => (
            <TabsContent key={locale} value={locale} className="mt-6 space-y-6">
              <FormField
                control={form.control}
                name={`content.${locale}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {content.titleLabel} ({locale})
                    </FormLabel>{" "}
                    <FormControl>
                      <Input
                        placeholder={content.titlePlaceholder}
                        {...field}
                      />{" "}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`content.${locale}.slug`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {content.slugLabel} ({locale})
                    </FormLabel>{" "}
                    <FormControl>
                      <Input
                        placeholder={content.slugPlaceholder}
                        {...field}
                      />{" "}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`content.${locale}.summary`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {content.summaryLabel} ({locale})
                    </FormLabel>{" "}
                    <FormControl>
                      <Textarea
                        placeholder={content.summaryPlaceholder}
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`content.${locale}.body`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {content.bodyLabel} ({locale})
                    </FormLabel>{" "}
                    <FormControl>
                      <Textarea
                        placeholder={content.bodyPlaceholder}
                        className="min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Form>
  );
}
