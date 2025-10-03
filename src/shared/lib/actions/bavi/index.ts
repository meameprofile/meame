// app/[locale]/(dev)/bavi/_actions/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública para el módulo de Server Actions de BAVI.
 *              v3.0.0 (Holistic Integrity): Se añade la exportación para la nueva
 *              acción de obtención de contenido i18n, completando la arquitectura
 *              para el patrón "Server Shell" del ImageField.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
export * from "./uploadAsset.action";
export * from "./addAssetToManifests.action";
export * from "./getBaviAssets.action";
export * from "./getBaviI18nContent.action"; // <-- NUEVA EXPORTACIÓN
// app/[locale]/(dev)/bavi/_actions/index.ts
