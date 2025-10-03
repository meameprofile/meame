// RUTA: src/shared/lib/shopify/admin-client.ts
/**
 * @file admin-client.ts
 * @description SSoT para la comunicación de bajo nivel con la API GraphQL de Shopify ADMIN.
 *              Este cliente es responsable de todas las peticiones a la Admin API.
 * @version 1.0.0 (Dedicated Admin Client)
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";

// Asegurarse de que las variables de entorno están cargadas.
// CRÍTICO: SHOPIFY_ADMIN_ACCESS_TOKEN es un secreto de servidor.
if (!process.env.SHOPIFY_STORE_DOMAIN) {
  throw new Error("SHOPIFY_STORE_DOMAIN is not defined.");
}
if (!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
  throw new Error("SHOPIFY_ADMIN_ACCESS_TOKEN is not defined.");
}
if (!process.env.SHOPIFY_API_VERSION) {
  throw new Error("SHOPIFY_API_VERSION is not defined.");
}

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION;

const ADMIN_API_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

/**
 * @function shopifyAdminFetch
 * @description Realiza una petición GraphQL a la Admin API de Shopify.
 * @template T El tipo de la respuesta GraphQL esperada.
 * @param {{ query: string; variables?: ExtractVariables<T>; cache?: RequestCache; tags?: string[] }} options
 * @returns {Promise<{ status: number; body: T }>} La respuesta de la API.
 * @throws {Error} Si la configuración es incorrecta o la petición falla.
 */
export async function shopifyAdminFetch<T>({
  query,
  variables,
  cache = "no-store", // La Admin API a menudo requiere datos frescos.
  tags,
}: {
  query: string;
  variables?: ExtractVariables<T>;
  cache?: RequestCache;
  tags?: string[];
}): Promise<{ status: number; body: T }> {
  const traceId = logger.startTrace("shopifyAdminFetch");
  logger.info("[Shopify Admin DAL] Realizando petición GraphQL...", {
    url: ADMIN_API_ENDPOINT,
    cache,
    tags,
    traceId,
  });

  try {
    const result = await fetch(ADMIN_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN, // Usar Admin Access Token
      },
      body: JSON.stringify({ query, variables }),
      cache,
      next: { tags: tags || [] }, // Los tags son menos comunes para Admin API, pero permitidos.
    });

    const body = await result.json();

    if (body.errors) {
      logger.error("[Shopify Admin DAL] Errores en la respuesta GraphQL.", {
        errors: body.errors,
        traceId,
      });
      throw new Error(body.errors[0].message || "Error en la Admin API.");
    }

    logger.traceEvent(traceId, "Petición a Admin API exitosa.");
    return { status: result.status, body };
  } catch (e) {
    logger.error("[Shopify Admin DAL] Fallo en shopifyAdminFetch.", {
      error: e,
      traceId,
    });
    throw e;
  } finally {
    logger.endTrace(traceId);
  }
}
