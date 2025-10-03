// RUTA: src/shared/lib/shopify/index.ts
/**
 * @file index.ts
 * @description Fachada pública y SSoT para la Capa de Acceso a Datos de Shopify.
 * @version 10.0.0 (Admin Products Action & Final Client Decoupling)
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";

// Clientes dedicados de la API
export * from "./storefront-client"; // <-- EXPORTA EL CLIENTE DE STOREFRONT
export * from "./admin-client"; // <-- EXPORTA EL CLIENTE DE ADMIN

// Operaciones de API de alto nivel (que usan los clientes anteriores)
export * from "./products";
export * from "./cart";
export * from "./shapers";
export * from "@/shared/lib/actions/shopify"; // Exportación de la Server Action

// Exportar types y queries específicos de Admin
export * from "./types/admin.types";
export * from "./queries/admin-product";
