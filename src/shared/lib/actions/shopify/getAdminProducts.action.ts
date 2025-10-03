// RUTA: src/shared/lib/actions/shopify/getAdminProducts.action.ts
/**
 * @file getAdminProducts.action.ts
 * @description Server Action soberana para obtener productos de la Admin API,
 *              ahora con observabilidad de élite y un "Guardián de Resiliencia" holístico.
 * @version 4.0.0 (Elite Observability & Resilience)
 *@author RaZ Podestá - MetaShark Tech
 */
"use server";

import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { ActionResult } from "@/shared/lib/types/actions.types";
import { shopifyAdminFetch } from "@/shared/lib/shopify/admin-client";
import { getAdminProductsQuery } from "@/shared/lib/shopify/queries/admin-product";
import type { ShopifyAdminProductsOperation } from "@/shared/lib/shopify/types/admin.types";
import {
  reshapeAdminProducts,
  type AdminProduct,
} from "@/shared/lib/shopify/admin.shapers";

interface GetAdminProductsInput {
  first?: number;
  after?: string;
}

export async function getAdminProductsAction(
  input: GetAdminProductsInput = {}
): Promise<
  ActionResult<{
    products: AdminProduct[];
    hasNextPage: boolean;
    endCursor: string | null;
  }>
> {
  const traceId = logger.startTrace("getAdminProductsAction_v4.0");
  logger.info(
    "[Shopify Admin Action] Solicitando productos de la Admin API...",
    { input, traceId }
  );

  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- [GUARDIÁN DE AUTORIZACIÓN] ---
  if (!user) {
    logger.warn("[Shopify Admin Action] Intento de acceso no autorizado.", {
      traceId,
    });
    logger.endTrace(traceId);
    return { success: false, error: "auth_required" };
  }
  logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

  // --- [GUARDIÁN DE RESILIENCIA HOLÍSTICO] ---
  try {
    const { first = 10, after } = input;

    logger.traceEvent(traceId, "Iniciando llamada a shopifyAdminFetch...");
    const response = await shopifyAdminFetch<ShopifyAdminProductsOperation>({
      query: getAdminProductsQuery,
      variables: { first, after },
      cache: "no-store",
    });
    logger.traceEvent(traceId, "Respuesta de Shopify recibida con éxito.");

    const productsData =
      response.body.data?.products?.edges.map((edge) => edge.node) || [];
    const pageInfo = response.body.data?.products?.pageInfo;

    logger.traceEvent(
      traceId,
      `Iniciando transformación de ${productsData.length} productos a través del shaper...`
    );
    const finalProducts = reshapeAdminProducts(productsData);
    logger.traceEvent(
      traceId,
      `Transformación completada. ${finalProducts.length} productos válidos.`
    );

    logger.success(
      `[Shopify Admin Action] ${finalProducts.length} productos obtenidos y transformados.`,
      { traceId }
    );
    return {
      success: true,
      data: {
        products: finalProducts,
        hasNextPage: pageInfo?.hasNextPage || false,
        endCursor: pageInfo?.endCursor || null,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error(
      "[Shopify Admin Action] Fallo crítico durante la obtención de productos.",
      {
        error: errorMessage,
        traceId,
      }
    );
    return {
      success: false,
      error: `Error al cargar productos de Shopify Admin: ${errorMessage}`,
    };
  } finally {
    logger.endTrace(traceId);
  }
}
