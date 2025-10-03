// RUTA: src/shared/lib/utils/constants.ts
/**
 * @file constants.ts
 * @description SSoT para las constantes globales del ecosistema de la aplicación.
 *              Este módulo es EXCLUSIVO DEL SERVIDOR.
 * @version 3.1.0 (Limpieza de Sintaxis)
 * @author RaZ Podestá - MetaShark Tech
 */
"use server-only";

import { logger } from "@/shared/lib/logging";

logger.trace("[constants.ts] Módulo de constantes cargado.");

export const TAGS = {
  products: "products",
  cart: "cart",
} as const;

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// SHOPIFY_GRAPHQL_API_ENDPOINT ha sido eliminado.
// La construcción de la URL para las APIs de Shopify es ahora
// responsabilidad de los clientes dedicados (storefront-client.ts y admin-client.ts).
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
