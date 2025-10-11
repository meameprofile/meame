// RUTA: src/shared/lib/commerce/catalog.ts
/**
 * @file catalog.ts
 * @description Capa de Acceso a Datos (DAL) para el catálogo de productos local (JSON).
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import type { z } from "zod";

import { loadJsonAsset } from "@/shared/lib/i18n/campaign.data.loader";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import {
  ProductCatalogSchema,
  type Product,
} from "@/shared/lib/schemas/entities/product.schema";

type ProductCatalogI18n = Partial<
  Record<Locale, z.infer<typeof ProductCatalogSchema>>
>;

export async function getLocalProducts(locale: Locale): Promise<Product[]> {
  const traceId = logger.startTrace("getLocalProducts");
  try {
    const catalogData = await loadJsonAsset<ProductCatalogI18n>(
      "campaigns", // Root dir 'content/'
      "products",
      "catalog.i18n.json"
    );
    const catalogForLocale = catalogData[locale];
    if (!catalogForLocale) return [];

    const validation = ProductCatalogSchema.safeParse(catalogForLocale);
    if (!validation.success) {
      logger.error("[DAL Catálogo] Falló la validación del catálogo local.", {
        error: validation.error.flatten(),
        traceId,
      });
      return [];
    }

    const localProducts = validation.data.products.filter(
      (p) => p.producerInfo.name !== "Global Fitwell"
    );
    logger.traceEvent(
      traceId,
      `Se encontraron ${localProducts.length} productos locales.`
    );
    return localProducts;
  } catch (error) {
    logger.error("Fallo crítico al cargar el catálogo local.", {
      error,
      traceId,
    });
    return [];
  } finally {
    logger.endTrace(traceId);
  }
}
