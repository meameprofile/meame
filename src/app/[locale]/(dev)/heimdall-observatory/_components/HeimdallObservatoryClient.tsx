// RUTA: src/app/[locale]/(dev)/heimdall-observatory/_components/HeimdallObservatoryClient.tsx
/**
 * @file HeimdallObservatoryClient.tsx
 * @description Orquestador de cliente para el Observatorio Heimdall.
 * @version 1.0.0
 * @author L.I.A. Legacy
 */
"use client";
import React, { useState } from "react";
import type { HeimdallEventRow } from "@/shared/lib/telemetry/heimdall.contracts";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
} from "@/components/ui";
import { getHeimdallInsightAction } from "@/shared/lib/actions/telemetry/getHeimdallInsight.action";

interface HeimdallObservatoryClientProps {
  initialEvents: HeimdallEventRow[];
}

export function HeimdallObservatoryClient({
  initialEvents,
}: HeimdallObservatoryClientProps) {
  const [selectedEvent, setSelectedEvent] = useState<HeimdallEventRow | null>(
    null
  );
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedEvent) return;
    setIsThinking(true);
    setAnalysis(null);
    const result = await getHeimdallInsightAction({
      eventId: selectedEvent.event_id,
    });
    if (result.success) {
      setAnalysis(result.data);
    } else {
      setAnalysis(`Error en el análisis: ${result.error}`);
    }
    setIsThinking(false);
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4 h-screen">
      <div className="col-span-1 flex flex-col gap-2 overflow-y-auto">
        <h2 className="text-lg font-bold">Eventos Recientes</h2>
        {initialEvents.map((event) => (
          <Button
            key={event.event_id}
            variant="outline"
            onClick={() => setSelectedEvent(event)}
          >
            {event.event_name} -{" "}
            {new Date(event.timestamp).toLocaleTimeString()}
          </Button>
        ))}
      </div>
      <div className="col-span-2 flex flex-col gap-4">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Detalle del Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(selectedEvent, null, 2)}
            </pre>
          </CardContent>
        </Card>
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Análisis de IA (Mimir)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button
              onClick={handleAnalyze}
              disabled={!selectedEvent || isThinking}
            >
              {isThinking ? "Analizando..." : "Analizar con Temeo"}
            </Button>
            <Textarea
              value={analysis || ""}
              readOnly
              className="h-full"
              placeholder="El análisis de la IA aparecerá aquí..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
