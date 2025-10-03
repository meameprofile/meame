// RUTA: src/shared/lib/actions/campaign-suite/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública para las Server Actions de la SDC.
 *              v4.0.0 (Holistic & DRY Refactoring): Consolidado para eliminar
 *              exportaciones ambiguas y reflejar la nueva arquitectura soberana.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

// Exporta todas las acciones relacionadas con el ciclo de vida del borrador desde su SSoT.
export * from "./saveDraft.action";
export * from "./getDraft.action";
export * from "./deleteDraft.action";

// Exporta el resto de las acciones de la SDC desde sus módulos soberanos.
export * from "./getThemeFragments.action";
export * from "./saveCampaignAsset.action";
export * from "./publishCampaign.action";
export * from "./packageCampaign.action";
export * from "./getBaseCampaigns.action";
export * from "./saveAsTemplate.action";
export * from "./loadTemplate.action";
export * from "./getTemplates.action";
export * from "./getCampaignTemplates.action";
export * from "./getArtifactDownloadUrl.action";
export * from "./getArtifactsForDraft.action";
