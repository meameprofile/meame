// RUTA: src/shared/lib/shopify/storefront-client.ts
/**
 * @file storefront-client.ts
 * @description SSoT para la comunicación de bajo nivel con la API GraphQL de Shopify STOREFRONT.
 *              Este cliente es responsable de todas las peticiones a la Storefront API.
 * @version 2.1.0 (Fix de Importación Obsoleta)
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";
import { TAGS } from "@/shared/lib/utils/constants"; // <-- Solo importamos TAGS

// Asegurarse de que las variables de entorno están cargadas.
// Este chequeo es vital para Server-Only módulos.
if (!process.env.SHOPIFY_STORE_DOMAIN) {
  throw new Error("SHOPIFY_STORE_DOMAIN is not defined.");
}
if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  throw new Error("SHOPIFY_STOREFRONT_ACCESS_TOKEN is not defined.");
}
if (!process.env.SHOPIFY_API_VERSION) {
  throw new Error("SHOPIFY_API_VERSION is not defined.");
}

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION;

// Construcción del endpoint directamente desde las variables de entorno, sin el import obsoleto.
const STOREFRONT_API_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

/**
 * @function shopifyStorefrontFetch
 * @description Realiza una petición GraphQL a la Storefront API de Shopify.
 * @template T El tipo de la respuesta GraphQL esperada.
 * @param {{ query: string; variables?: ExtractVariables<T>; cache?: RequestCache; tags?: string[] }} options
 * @returns {Promise<{ status: number; body: T }>} La respuesta de la API.
 * @throws {Error} Si la configuración es incorrecta o la petición falla.
 */
export async function shopifyStorefrontFetch<T>({
  query,
  variables,
  cache = "force-cache",
  tags,
}: {
  query: string;
  variables?: ExtractVariables<T>;
  cache?: RequestCache;
  tags?: string[];
}): Promise<{ status: number; body: T }> {
  const traceId = logger.startTrace("shopifyStorefrontFetch");
  logger.info("[Shopify Storefront DAL] Realizando petición GraphQL...", {
    url: STOREFRONT_API_ENDPOINT,
    cache,
    tags,
    traceId,
  });

  try {
    const result = await fetch(STOREFRONT_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache,
      next: { tags: tags || [TAGS.products, TAGS.cart] }, // Usar tags pasados o por defecto
    });

    const body = await result.json();

    if (body.errors) {
      logger.error(
        "[Shopify Storefront DAL] Errores en la respuesta GraphQL.",
        {
          errors: body.errors,
          traceId,
        }
      );
      throw new Error(
        body.errors[0].message || "Error en la API de Storefront."
      );
    }

    logger.traceEvent(traceId, "Petición a Storefront API exitosa.");
    return { status: result.status, body };
  } catch (e) {
    logger.error("[Shopify Storefront DAL] Fallo en shopifyStorefrontFetch.", {
      error: e,
      traceId,
    });
    throw e;
  } finally {
    logger.endTrace(traceId);
  }
}
