// RUTA: src/shared/lib/actions/shopify/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública y SSoT para las Server Actions de Shopify.
 * @version 13.0.0 (Holistic Elite Leveling)
 * @author L.I.A. Legacy
 */
import "server-only";
import { logger } from "@/shared/lib/logging";

logger.trace("[Shopify Actions Façade] Módulo de acciones de Shopify cargado.");

export * from "./getAdminProducts.action";
