// RUTA: src/shared/lib/dev/preview-renderers/_utils.ts
/**
 * @file _utils.ts
 * @description SSoT para la transformación de datos de tema a estilos en línea.
 *              v3.0.0 (Holistic Transformation): Ahora gestiona la transformación
 *              completa del tema, incluyendo colores y tipografía, para un
 *              cumplimiento estricto del principio DRY.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";

/**
 * @function getStyleFromTheme
 * @description Traduce un objeto de tema semántico a un objeto de estilo en línea
 *              compatible con el motor de renderizado de @vercel/og (Satori).
 *              Es resiliente a fragmentos de tema incompletos.
 * @param theme El objeto de tema ensamblado, que puede ser parcial.
 * @returns Un objeto con claves de estilo listas para ser usadas.
 */
export function getStyleFromTheme(theme: Partial<AssembledTheme>) {
  logger.trace("[Preview Utils] Mapeando tema a estilos en línea (v3.0)...");

  const colors = theme.colors ?? {};
  const geometry = theme.geometry ?? {};
  const fonts = theme.fonts ?? {};

  return {
    backgroundColor: `hsl(${colors.background || "0 0% 100%"})`,
    color: `hsl(${colors.foreground || "0 0% 3.9%"})`,
    borderColor: `hsl(${geometry["--border"] || "0 0% 89.8%"})`,
    primaryColor: `hsl(${colors.primary || "24.6 95% 53.1%"})`,
    primaryForegroundColor: `hsl(${
      colors.primaryForeground || "60 9.1% 97.8%"
    })`,
    mutedBackgroundColor: `hsl(${colors.muted || "60 4.8% 95.9%"})`,
    mutedForegroundColor: `hsl(${colors.mutedForeground || "25 5.3% 44.7%"})`,
    accentColor: `hsl(${colors.accent || "60 4.8% 95.9%"})`,
    accentForegroundColor: `hsl(${colors.accentForeground || "24 9.8% 10%"})`,
    // --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA] ---
    // La lógica de la fuente ahora reside aquí, en su SSoT.
    fontFamily: fonts.sans || '"Inter", sans-serif',
    // --- [FIN DE CORRECCIÓN ARQUITECTÓNICA] ---
  };
}
