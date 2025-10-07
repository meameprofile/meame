// RUTA: src/shared/hooks/campaign-suite/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública soberana para los hooks de la SDC.
 *              v2.0.0 (Centralized Forge Architecture): Refactorizado para
 *              exportar los hooks de la nueva arquitectura de estado centralizado
 *              y eliminar las dependencias a los stores atómicos obsoletos.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
export * from "./use-campaign-draft.hook";
export * from "./use-campaign-draft.store";
export * from "./use-campaign-lifecycle";
export * from "./use-campaign-templates";
export * from "./use-content-editor";
export * from "./use-iframe";
export * from "./use-live-preview-assets";
export * from "./use-preview-focus";
export * from "./use-preview-theme";
export * from "./use-template-loader";
