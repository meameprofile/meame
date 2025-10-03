// lib/config/theming.config.ts
/**
 * @file theming.config.ts
 * @description SSoT para la configuración del sistema de Theming.
 *              Define el mapeo entre los prefijos de la Nomenclatura
 *              Estructurada de Trazos (NET) y sus directorios correspondientes.
 * @version 2.0.0 (Configuration Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";

logger.trace(
  "[Theming Config] Módulo de configuración de theming (v2.0.0) cargado."
);

/**
 * @const netTracePrefixToPathMap
 * @description El mapa canónico que traduce un prefijo de trazo NET
 *              (ej. 'cp') a su directorio de fragmentos correspondiente.
 */
export const netTracePrefixToPathMap: Record<string, string> = {
  cp: "colors", // Color Palette (para campañas)
  ft: "fonts", // Fonts (para campañas)
  rd: "radii", // Radius (geometría para campañas)
  // --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA] ---
  // Se elimina la entrada 'dcc' que apuntaba a un directorio inexistente.
  // --- [FIN DE CORRECCIÓN ARQUITECTÓNICA] ---
};
