// lib/schemas/pages/bavi-asset-explorer.i18n.schema.ts
/**
 * @file bavi-asset-explorer.i18n.schema.ts
 * @description SSoT para el contrato de datos del contenido i18n del AssetExplorer.
 *              v2.0.0 (Contract Integrity): Se añade 'selectAssetButton' para
 *              soportar el modo de selección del modal.
 * @version 2.0.0
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
  previousPageButton: z.string(),
  nextPageButton: z.string(),
  pageInfo: z.string(),
  viewDetailsButton: z.string(),
  // --- [INICIO DE CORRECCIÓN DE CONTRATO] ---
  selectAssetButton: z.string(), // Clave ahora requerida por el contrato.
  // --- [FIN DE CORRECCIÓN DE CONTRATO] ---
});

export const BaviAssetExplorerLocaleSchema = z.object({
  assetExplorer: BaviAssetExplorerContentSchema.optional(),
});
// lib/schemas/pages/bavi-asset-explorer.i18n.schema.ts
