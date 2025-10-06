// RUTA: src/shared/lib/actions/analytics/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública para las Server Actions del dominio Analytics.
 * @version 3.0.0 (Elite Observability)
 * @author L.I.A. Legacy
 */
import { logger } from "@/shared/lib/logging";

logger.trace(
  "[Analytics Actions Façade] Módulo de acciones de analíticas cargado."
);

export * from "./getCampaignAnalytics.action";
export * from "./getDecryptedEventsForDebug.action";
