// RUTA: src/shared/lib/shopify/types/admin.types.ts
/**
 * @file admin.types.ts
 * @description SSoT para los contratos de tipos que modelan la Admin API de Shopify.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

interface Connection<T> {
  edges: { node: T }[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
}

interface Money {
  amount: string;
  currencyCode: string;
}

// --- Tipos de Inventario ---
export interface ShopifyAdminInventoryItem {
  tracked: boolean;
  unitCost: Money;
}

// --- Tipos de Variantes ---
export interface ShopifyAdminProductVariant {
  price: Money;
  inventoryItem: ShopifyAdminInventoryItem;
  inventoryQuantity: number;
}

// --- Tipos de Producto (Admin) ---
export interface ShopifyAdminProduct {
  id: string; // Global ID (ej. "gid://shopify/Product/12345")
  title: string;
  handle: string;
  status: string; // (ej. "ACTIVE", "ARCHIVED", "DRAFT")
  createdAt: string;
  updatedAt: string;
  variants: Connection<ShopifyAdminProductVariant>;
}

// --- Tipos de Operaciones de API (Admin) ---
export interface ShopifyAdminProductsOperation {
  data: {
    products: Connection<ShopifyAdminProduct>;
  };
  variables: {
    first: number;
    after?: string;
  };
}

export interface ShopifyAdminProductOperation {
  data: {
    product: ShopifyAdminProduct;
  };
  variables: {
    id: string;
  };
}
