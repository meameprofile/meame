// RUTA: src/components/dev/AssetBlueprint.tsx
/**
 * @file AssetBlueprint.tsx
 * @description Componente de UI para renderizar un "plano de forja" de activo.
 *              Exclusivo para el entorno de desarrollo. Cumple con los 7 Pilares.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";
import { DynamicIcon } from "@/components/ui";

interface AssetBlueprintProps {
  width: number;
  height: number;
  format?: "JPG" | "PNG" | "SVG" | "WebP";
  ecosystemId: string;
  label?: string;
  className?: string;
}

export function AssetBlueprint({
  width,
  height,
  format = "JPG",
  ecosystemId,
  label = "Asset Blueprint",
  className,
}: AssetBlueprintProps): React.ReactElement | null {
  // Este componente solo se renderiza en desarrollo.
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  logger.trace(`[AssetBlueprint] Renderizando plano para: ${ecosystemId}`);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/20 bg-muted/20 text-muted-foreground p-4 overflow-hidden",
        className
      )}
      style={{
        width: "100%",
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <span className="absolute top-2 right-2 text-xs font-mono bg-primary/10 text-primary/80 px-2 py-1 rounded">
        {label}
      </span>
      <DynamicIcon name="Image" className="h-12 w-12" />
      <div className="text-center font-mono text-xs">
        <p>
          <strong className="text-foreground/80">Dimensiones:</strong> {width}x
          {height}px
        </p>
        <p>
          <strong className="text-foreground/80">Formato:</strong> {format}
        </p>
        <p className="mt-2 text-primary/60">{ecosystemId}</p>
      </div>
    </div>
  );
}
