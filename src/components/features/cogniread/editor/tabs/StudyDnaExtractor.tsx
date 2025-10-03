// RUTA: src/components/features/cogniread/editor/tabs/StudyDnaExtractor.tsx
/**
 * @file StudyDnaExtractor.tsx
 * @description Componente de cliente para la extracción de StudyDNA asistida por IA.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Textarea,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Label,
  DynamicIcon,
} from "@/components/ui";
import { GEMINI_MODELS } from "@/shared/lib/ai/models.config";
import { extractStudyDnaAction } from "@/shared/lib/actions/cogniread/extractStudyDna.action";
import type { StudyDna } from "@/shared/lib/schemas/cogniread/article.schema";

interface StudyDnaExtractorProps {
  onExtractionSuccess: (data: StudyDna) => void;
  content: {
    title: string;
    description: string;
    textAreaLabel: string;
    textAreaPlaceholder: string;
    modelSelectLabel: string;
    extractButton: string;
    extractButtonLoading: string;
  };
}

export function StudyDnaExtractor({
  onExtractionSuccess,
  content,
}: StudyDnaExtractorProps) {
  const [studyText, setStudyText] = useState("");
  const [selectedModel, setSelectedModel] = useState(GEMINI_MODELS[0].id);
  const [isPending, startTransition] = useTransition();

  const handleExtract = () => {
    startTransition(async () => {
      const result = await extractStudyDnaAction({
        studyText,
        modelId: selectedModel,
      });
      if (result.success) {
        toast.success("¡ADN del Estudio extraído con éxito!");
        onExtractionSuccess(result.data);
      } else {
        toast.error("Error en la extracción", { description: result.error });
      }
    });
  };

  return (
    <Card className="bg-muted/30 border-dashed">
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
        <CardDescription>{content.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="study-text">{content.textAreaLabel}</Label>
          <Textarea
            id="study-text"
            placeholder={content.textAreaPlaceholder}
            className="min-h-[200px] font-mono text-xs"
            value={studyText}
            onChange={(e) => setStudyText(e.target.value)}
          />
        </div>
        <div className="flex items-end gap-4">
          <div className="space-y-2 flex-grow">
            <Label htmlFor="ai-model">{content.modelSelectLabel}</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger id="ai-model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GEMINI_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleExtract}
            disabled={isPending || studyText.length < 100}
            size="lg"
          >
            {isPending && (
              <DynamicIcon
                name="LoaderCircle"
                className="mr-2 h-4 w-4 animate-spin"
              />
            )}
            {isPending ? content.extractButtonLoading : content.extractButton}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
