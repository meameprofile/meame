// RUTA: src/shared/lib/actions/theme-fragments/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública para las Server Actions de fragmentos de tema.
 *              La lógica de transformación reside en `_shapers/` pero no se
 *              expone, cumpliendo el principio de encapsulación.
 * @version 3.0.0 (Holistic CRUD API & Encapsulation)
 * @author L.I.A. Legacy
 */
export * from "./getThemeFragments.action";
export * from "./createThemeFragment.action";
export * from "./updateThemeFragment.action";
export * from "./deleteThemeFragment.action";
