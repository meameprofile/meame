// shared/lib/dev/preview-renderers/index.ts
/**
 * @file index.ts
 * @description SSoT y Registro de todos los renderizadores de previsualización atómicos.
 *              v2.0.0 (Architectural & Type Safety Fix): Se restaura el nombre
 *              canónico del archivo y se corrige el contrato a un `Record` de
 *              funciones `PreviewRenderer`, resolviendo el error crítico de tipo TS2322
 *              y la violación de `no-explicit-any`.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";
import type { PreviewRenderer } from "./_types";

// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA] ---
// Importaciones directas a los renderizadores atómicos.
import { StandardHeaderPreview } from "./StandardHeader.preview";
import { MinimalHeaderPreview } from "./MinimalHeader.preview";
import { StandardFooterPreview } from "./StandardFooter.preview";
import { BenefitsSectionPreview } from "./BenefitsSection.preview";
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA] ---

logger.trace(
  "[PreviewRegistry] Cargando registro de renderizadores de previsualización v2.0."
);

/**
 * @const previewRenderers
 * @description El registro soberano que mapea un componentName a su función
 *              de renderizado asíncrona.
 */
export const previewRenderers: Record<string, PreviewRenderer> = {
  StandardHeader: StandardHeaderPreview,
  MinimalHeader: MinimalHeaderPreview,
  StandardFooter: StandardFooterPreview,
  BenefitsSection: BenefitsSectionPreview,
};
// shared/lib/dev/preview-renderers/index.ts
