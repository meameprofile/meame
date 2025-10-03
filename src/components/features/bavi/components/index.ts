// RUTA: src/components/features/bavi/_components/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública para los componentes de la feature BAVI.
 *              v5.0.0 (Architectural Integrity Restoration): Se elimina la
 *              exportación del hook 'use-asset-explorer-logic', que ha sido
 *              movido a su ubicación soberana en shared/hooks, resolviendo
 *              un error crítico de build.
 * @version 5.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
export * from "./AssetUploader";
export * from "./AssetExplorer";
export * from "./AssetCard";
export * from "./AssetSelectorModal";
// La exportación de './use-asset-explorer-logic' ha sido eliminada.
// RUTA: src/components/features/bavi/_components/index.ts
