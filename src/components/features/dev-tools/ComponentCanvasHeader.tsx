// components/dev/ComponentCanvasHeader.tsx
/**
 * @file src/components/dev/ComponentCanvasHeader.tsx
 * @description Componente de presentación para el encabezado del Dev Component Canvas.
 * @version 2.0.0 (Full i18n & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { DynamicIcon } from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

type HeaderContent = NonNullable<Dictionary["componentCanvasHeader"]>;

interface ComponentCanvasHeaderProps {
  entryName: string;
  content: HeaderContent;
}

export function ComponentCanvasHeader({
  entryName,
  content,
}: ComponentCanvasHeaderProps): React.ReactElement {
  logger.info("[ComponentCanvasHeader] Renderizando v2.0 (Full i18n).");
  return (
    <>
      <div className="absolute inset-0 border-4 border-dashed border-accent/20 rounded-lg pointer-events-none z-0"></div>
      <div className="absolute -top-3 -left-3 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-background text-xs font-bold z-10">
        <DynamicIcon name="LayoutGrid" className="h-4 w-4" />
      </div>
      <h1 className="text-3xl font-bold text-primary mb-4">{entryName}</h1>
      <p className="text-muted-foreground mb-6">{content.description}</p>
    </>
  );
}
// components/dev/ComponentCanvasHeader.tsx
