// RUTA: src/shared/lib/shopify/admin-client.ts
/**
 * @file admin-client.ts
 * @description SSoT para la comunicación con la API GraphQL de Shopify ADMIN.
 *              v2.0.0 (Lazy Initialization): Refactorizado para una inicialización
 *              diferida de las variables de entorno, garantizando la compatibilidad
 *              con orquestadores de scripts como `run-with-env.ts`.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export async function shopifyAdminFetch<T>({
  query,
  variables,
  cache = "no-store",
  tags,
}: {
  query: string;
  variables?: ExtractVariables<T>;
  cache?: RequestCache;
  tags?: string[];
}): Promise<{ status: number; body: T }> {
  const traceId = logger.startTrace("shopifyAdminFetch_v2.0");

  // --- INICIO DE REFACTORIZACIÓN: INICIALIZACIÓN DIFERIDA ---
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const apiVersion = process.env.SHOPIFY_API_VERSION;

  if (!domain || !adminToken || !apiVersion) {
    logger.error(
      "[Shopify Admin DAL] Variables de entorno de Shopify no configuradas en tiempo de ejecución.",
      { traceId }
    );
    throw new Error(
      "Las variables de entorno de Shopify no están disponibles."
    );
  }

  const endpoint = `https://${domain}/admin/api/${apiVersion}/graphql.json`;
  // --- FIN DE REFACTORIZACIÓN ---

  logger.info("[Shopify Admin DAL] Realizando petición GraphQL...", {
    url: endpoint,
    cache,
    tags,
    traceId,
  });

  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({ query, variables }),
      cache,
      next: { tags: tags || [] },
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
