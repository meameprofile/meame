// Ruta correcta: src/shared/lib/utils/theming/theme-utils.ts
/**
 * @file theme-utils.ts
 * @description SSoT para las utilidades de theming. Contiene la lógica para
 *              parsear trazos NET y generar variables CSS a partir de un objeto de tema.
 *              v2.1.0 (Isomorphic Fix): Se elimina la directiva 'server-only'
 *              para permitir que el módulo sea consumido tanto por el servidor
 *              como por los hooks del cliente.
 * @version 2.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
import type { AssembledTheme } from "@/shared/lib/schemas/theming/assembled-theme.schema";
import { logger } from "@/shared/lib/logging";

/**
 * @function generateCssVariablesFromTheme
 * @description Genera una cadena de variables CSS a partir de un objeto de tema ensamblado.
 * @param {AssembledTheme} theme - El objeto de tema validado.
 * @returns {string} Una cadena de texto con las reglas CSS.
 */
export function generateCssVariablesFromTheme(theme: AssembledTheme): string {
  logger.trace("[ThemeUtils] Generando variables CSS desde el objeto de tema.");
  let cssString = "";

  const processObject = (obj: Record<string, unknown>, prefix = "") => {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        cssString += `${prefix}${key}: ${value};`;
      }
    }
  };

  if (theme.colors) {
    processObject(theme.colors, "--");
  }
  if (theme.fonts) {
    processObject(theme.fonts); // Los prefijos ya están en las claves
  }
  if (theme.geometry) {
    processObject(theme.geometry); // Los prefijos ya están en las claves
  }

  return cssString;
}

/**
 * @function parseThemeNetString
 * @description Parsea una cadena de Nomenclatura Estructurada de Trazos (NET).
 * @param {string} netString - La cadena de entrada (ej. "cp-vitality.ft-poppins-inter.rd-soft").
 * @returns {Record<string, string>} Un objeto que mapea prefijos a nombres.
 */
export function parseThemeNetString(netString: string): Record<string, string> {
  const parts = netString.split(".");
  const themePlan: Record<string, string> = {};
  parts.forEach((part) => {
    const [prefix, ...nameParts] = part.split("-");
    if (prefix && nameParts.length > 0) {
      themePlan[prefix] = nameParts.join("-");
    }
  });
  return themePlan;
}
// Ruta correcta: src/shared/lib/utils/theming/theme-utils.ts
