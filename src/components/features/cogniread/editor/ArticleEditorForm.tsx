// RUTA: src/components/features/cogniread/editor/ArticleEditorForm.tsx
/**
 * @file ArticleEditorForm.tsx
 * @description Componente de presentación para el formulario del editor de artículos.
 * @version 6.2.0 (Prop Contract Fix)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  Button,
  DynamicIcon,
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import type { CogniReadArticle } from "@/shared/lib/schemas/cogniread/article.schema";
import { StudyDnaTab, ContentTab, EcosystemTab } from "./tabs";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

type EditorContent = NonNullable<Dictionary["cogniReadEditor"]>;

interface ArticleEditorFormProps {
  form: UseFormReturn<CogniReadArticle>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isPending: boolean;
  content: EditorContent;
}

export function ArticleEditorForm({
  form,
  onSubmit,
  isPending,
  content,
}: ArticleEditorFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="dna" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dna">{content.tabs.dna}</TabsTrigger>
              <TabsTrigger value="content">{content.tabs.content}</TabsTrigger>
              <TabsTrigger value="ecosystem">
                {content.tabs.ecosystem}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dna" className="mt-6">
              <StudyDnaTab form={form} content={content.studyDnaTab} />
            </TabsContent>

            <TabsContent value="content" className="mt-6">
              <ContentTab form={form} content={content.contentTab} />
            </TabsContent>

            <TabsContent value="ecosystem" className="mt-6">
              <EcosystemTab form={form} content={content.ecosystemTab} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <div className="flex justify-end mt-6">
        <Button type="submit" disabled={isPending} size="lg">
          {isPending && (
            <DynamicIcon
              name="LoaderCircle"
              className="mr-2 h-4 w-4 animate-spin"
            />
          )}
          {isPending ? content.saveButtonLoading : content.saveButton}
        </Button>
      </div>
    </form>
  );
}
