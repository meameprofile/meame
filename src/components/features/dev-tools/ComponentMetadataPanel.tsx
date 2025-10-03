// RUTA: src/components/features/dev-tools/ComponentMetadataPanel.tsx
/**
 * @file ComponentMetadataPanel.tsx
 * @description Componente de presentación para mostrar los metadatos de un componente.
 *              v3.1.0 (Sovereign Path Restoration): Se corrige un error tipográfico
 *              en la ruta de importación del schema i18n, restaurando la
 *              integridad del build del DCC.
 * @version 3.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { LayoutGrid } from "lucide-react";
import { logger } from "@/shared/lib/logging";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// Se corrige el error tipográfico en la ruta de importación.
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

type PanelContent = NonNullable<Dictionary["componentCanvas"]>;

interface ComponentMetadataPanelProps {
  componentProps: Record<string, unknown>;
  content: Pick<PanelContent, "metadataPanelPropsLabel">;
}

export function ComponentMetadataPanel({
  componentProps,
  content,
}: ComponentMetadataPanelProps): React.ReactElement {
  logger.info(
    "[ComponentMetadataPanel] Renderizando v3.1 (Sovereign Path Restoration)."
  );

  return (
    <div className="mb-8 p-4 border border-muted/50 rounded-lg bg-secondary/20">
      <h3 className="font-bold text-foreground flex items-center gap-2 mb-2">
        <LayoutGrid className="h-4 w-4" /> {content.metadataPanelPropsLabel}
      </h3>
      <pre className="text-xs text-muted-foreground bg-secondary/30 p-2 rounded max-h-60 overflow-auto">
        {JSON.stringify(componentProps, null, 2)}
      </pre>
    </div>
  );
}
// RUTA: src/components/features/dev-tools/ComponentMetadataPanel.tsx
