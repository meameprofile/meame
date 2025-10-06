// RUTA: src/components/features/dev-tools/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública SANEADA para los componentes de la feature `dev-tools`.
 *              v3.0.0 (Build Integrity): Se eliminan las exportaciones de componentes
 *              que dependen de lógica de servidor ("server-only") para prevenir la
 *              contaminación de la frontera Cliente-Servidor.
 * @version 3.0.0
 * @author L.I.A. Legacy
 */
export * from "./DeveloperErrorDisplay";
export * from "./ComponentCanvasHeader";
export * from "./ComponentMetadataPanel";
export * from "./DevRouteMenu";
export * from "./DevThemeSwitcher";
export * from "./DevToolsDropdown";
export * from "./ErrorPreview";
export * from "./AssetBlueprint";

// Las siguientes exportaciones han sido ELIMINADAS para prevenir fallos de build:
// export * from "./ComponentCanvas";
