// RUTA: src/shared/lib/actions/shopify/getAdminProducts.action.ts
/**
 * @file getAdminProducts.action.ts
 * @description Server Action soberana para obtener productos de la Admin API.
 * @version 5.1.0 (Holistic Observability & Contract Integrity)
 * @author RaZ Podestá - MetaShark Tech
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
  const traceId = logger.startTrace("getAdminProductsAction_v5.1");
  const groupId = logger.startGroup(
    `[Shopify Action] Solicitando productos de Admin API...`,
    traceId
  );

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "auth_required" };
    logger.traceEvent(traceId, `Usuario ${user.id} autorizado.`);

    const { first = 10, after } = input;

    const response = await shopifyAdminFetch<ShopifyAdminProductsOperation>({
      query: getAdminProductsQuery,
      variables: { first, after },
      cache: "no-store",
    });
    logger.traceEvent(traceId, "Respuesta de Shopify recibida.");

    const productsData =
      response.body.data?.products?.edges.map((edge) => edge.node) || [];
    const pageInfo = response.body.data?.products?.pageInfo;

    const finalProducts = reshapeAdminProducts(productsData, traceId);

    logger.success(
      `[Shopify Action] ${finalProducts.length} productos obtenidos y transformados.`
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
    const msg = error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[Shopify Action] Fallo crítico.", { error: msg, traceId });
    return { success: false, error: `Error al cargar productos: ${msg}` };
  } finally {
    logger.endGroup(groupId);
    logger.endTrace(traceId);
  }
}
