// RUTA: src/shared/lib/config/middleware/known-bots.ts
/**
 * @file known-bots.ts
 * @description SSoT para la lista de user-agents de bots conocidos.
 *              Este módulo es EXCLUSIVO DEL SERVIDOR.
 * @version 2.0.0 (Server-Only Hardening & Elite Observability)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { logger } from "@/shared/lib/logging";

logger.trace("[known-bots.ts] Manifiesto de bots cargado (v2.0).");

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
];
