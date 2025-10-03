// RUTA: src/shared/lib/middleware/config/known-bots.ts
/**
 * @file known-bots.ts
 * @description SSoT para la lista de user-agents de bots conocidos. Este
 *              manifiesto es consumido por el `visitorIntelligenceHandler`
 *              para filtrar tráfico no humano.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";

export const KNOWN_BOTS: readonly string[] = [
  "googlebot",
  "bingbot",
  "slurp",
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "sogou",
  "exabot",
  "facebot",
  "ia_archiver",
  "semrushbot",
  "ahrefsbot",
  "mj12bot",
  // Añadir más bots conocidos según sea necesario
];
