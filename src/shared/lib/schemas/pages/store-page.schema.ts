// RUTA: shared/lib/schemas/pages/store-page.schema.ts
/**
 * @file store-page.schema.ts
 * @description SSoT para el contrato de datos de la Tienda v3.0 (Data by Reference).
 *              Ahora define qué productos mostrar por referencia (ID), en lugar
 *              de contener los datos completos del producto.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

// Se elimina la definición de ProductCardSchema. La SSoT para la entidad
// Producto es ahora 'shared/lib/schemas/entities/product.schema.ts'.

export const StorePageLocaleSchema = z.object({
  storePage: z
    .object({
      title: z.string(),
      subtitle: z.string(),
      filters: z.object({
        searchLabel: z.string(),
        searchPlaceholder: z.string(),
        categoryTitle: z.string(),
        priceTitle: z.string(),
        tagsTitle: z.string(),
        stockTitle: z.string(),
        inStockLabel: z.string(),
      }),
      bestsellerLabel: z.string(),
      addToCartButton: z.string(),
      viewDetailsButton: z.string(),
      // --- CAMBIO ARQUITECTÓNICO CLAVE ---
      // El contrato ahora es un array de IDs de producto.
      products: z.array(
        z.string().min(1, "El ID del producto no puede estar vacío.")
      ),
    })
    .optional(),
});
