// app/[locale]/(dev)/cogniread/editor/_components/tabs/ContentTab.tsx
/**
 * @file ContentTab.tsx
 * @description Componente de presentación para la pestaña "Contenido Multilingüe", ahora internacionalizado.
 * @version 2.0.0 (Full i18n Compliance)
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
import { supportedLocales, type Locale } from "@/shared/lib/i18n/i18n.config";
import type { CogniReadArticle } from "@/shared/lib/schemas/cogniread/article.schema";
import { logger } from "@/shared/lib/logging";
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
    "[ContentTab] Renderizando formulario de contenido multilingüe v2.0."
  );

  return (
    <Form {...form}>
      <div className="space-y-8">
        <Tabs defaultValue={supportedLocales[0]} className="w-full">
          <TabsList>
            {supportedLocales.map((locale) => (
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
                    {/* Consume i18n */}
                    <FormControl>
                      <Input
                        placeholder={content.titlePlaceholder}
                        {...field}
                      />{" "}
                      {/* Consume i18n */}
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
                    {/* Consume i18n */}
                    <FormControl>
                      <Input placeholder={content.slugPlaceholder} {...field} />{" "}
                      {/* Consume i18n */}
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
                    {/* Consume i18n */}
                    <FormControl>
                      <Textarea
                        placeholder={content.summaryPlaceholder} // Consume i18n
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
                    {/* Consume i18n */}
                    <FormControl>
                      <Textarea
                        placeholder={content.bodyPlaceholder} // Consume i18n
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
