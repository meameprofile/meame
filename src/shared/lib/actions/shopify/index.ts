// RUTA: src/shared/lib/actions/shopify/index.ts
/**
 * @file index.ts
 * @description Fachada pública y SSoT para las Server Actions de Shopify.
 *              v12.0.0 (Domain Boundary Enforcement): Se elimina la re-exportación
 *              de los shapers para reforzar las fronteras del dominio.
 * @version 12.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { logger } from "@/shared/lib/logging";

logger.trace("[Shopify Actions Façade] Módulo de acciones de Shopify cargado.");

export * from "./getAdminProducts.action";
