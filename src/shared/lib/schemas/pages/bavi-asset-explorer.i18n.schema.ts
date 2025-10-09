// src/shared/lib/schemas/pages/bavi-asset-explorer.i18n.schema.ts
/**
 * @file bavi-asset-explorer.i18n.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del AssetExplorer.
 * @version 3.0.0 (Holistic Contract Alignment)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const BaviAssetExplorerContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  searchPlaceholder: z.string(),
  searchButton: z.string(),
  filterByAILabel: z.string(),
  allAIsOption: z.string(),
  loadingAssets: z.string(),
  noAssetsFoundTitle: z.string(),
  noAssetsFoundDescription: z.string(),
  // --- [INICIO DE NIVELACIÓN DE CONTRATO v3.0.0] ---
  clearFiltersButton: z.string(), // Propiedad añadida para cumplir con la UI
  // --- [FIN DE NIVELACIÓN DE CONTRATO v3.0.0] ---
  previousPageButton: z.string(),
  nextPageButton: z.string(),
  pageInfo: z.string(),
  viewDetailsButton: z.string(),
  selectAssetButton: z.string(),
});

export const BaviAssetExplorerLocaleSchema = z.object({
  assetExplorer: BaviAssetExplorerContentSchema.optional(),
});
