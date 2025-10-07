// RUTA: src/shared/lib/i18n/implemented-locales.manifest.ts
/**
 * @file implemented-locales.manifest.ts
 * @description Manifiesto Soberano y SSoT para los locales que tienen contenido
 *              implementado y para los cuales se debe generar enrutamiento.
 * @version 2.0.0 (Architectural Purity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
// "server-only"; // <-- ESTA LÍNEA DEBE SER ELIMINADA

/**
 * @const IMPLEMENTED_LOCALES
 * @description La Única Fuente de Verdad para los locales que están funcionalmente
 *              implementados en la aplicación. El sistema de enrutamiento y la
 *              carga de diccionarios se basarán exclusivamente en esta lista.
 */
export const IMPLEMENTED_LOCALES = [
  "it-IT",
  "es-ES",
  "en-US",
  "pt-BR",
] as const;
