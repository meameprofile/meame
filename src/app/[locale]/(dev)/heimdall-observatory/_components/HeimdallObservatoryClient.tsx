// RUTA: src/app/[locale]/(dev)/heimdall-observatory/_components/HeimdallObservatoryClient.tsx
/**
 * @file HeimdallObservatoryClient.tsx
 * @description Orquestador de cliente para el Observatorio Heimdall.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState, useTransition } from "react";
import type { z } from "zod";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
} from "@/components/ui";
import { getHeimdallInsightAction } from "@/shared/lib/actions/telemetry/getHeimdallInsight.action";
import type { HeimdallObservatoryContentSchema } from "@/shared/lib/schemas/pages/dev/heimdall-observatory.i18n.schema";
import type { HeimdallEventRow } from "@/shared/lib/telemetry/heimdall.contracts";

type Content = z.infer<typeof HeimdallObservatoryContentSchema>;

interface HeimdallObservatoryClientProps {
  initialEvents: HeimdallEventRow[];
  content: Content;
}

export function HeimdallObservatoryClient({
  initialEvents,
  content,
}: HeimdallObservatoryClientProps) {
  const [selectedEvent, setSelectedEvent] = useState<HeimdallEventRow | null>(
    null
  );
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isThinking, startTransition] = useTransition();

  const handleAnalyze = () => {
    if (!selectedEvent) return;
    startTransition(async () => {
      setAnalysis(null);
      const result = await getHeimdallInsightAction({
        eventId: selectedEvent.event_id,
      });
      if (result.success) {
        setAnalysis(JSON.stringify(JSON.parse(result.data), null, 2));
      } else {
        setAnalysis(`Error en el análisis: ${result.error}`);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      <Card className="lg:col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle>{content.recentsPanel.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto">
          <div className="space-y-2">
            {initialEvents.map((event) => (
              <Button
                key={event.event_id}
                variant={
                  selectedEvent?.event_id === event.event_id
                    ? "secondary"
                    : "outline"
                }
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex flex-col">
                  <span className="font-semibold">{event.event_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>{content.detailPanel.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-48 bg-muted p-2 rounded-md">
              {JSON.stringify(selectedEvent, null, 2)}
            </pre>
          </CardContent>
        </Card>
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>{content.mimirPanel.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-grow">
            <Button
              onClick={handleAnalyze}
              disabled={!selectedEvent || isThinking}
            >
              {isThinking
                ? content.mimirPanel.thinkingButton
                : content.mimirPanel.analyzeButton}
            </Button>
            <Textarea
              value={analysis || ""}
              readOnly
              className="h-full flex-grow font-mono text-xs"
              placeholder={content.mimirPanel.placeholder}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
