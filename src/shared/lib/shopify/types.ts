// shared/lib/shopify/types.ts
/**
 * @file types.ts
 * @description SSoT para los contratos de tipos que modelan la API de Shopify.
 *              v3.0.0 (Sovereign Cart Contract): Introduce el tipo soberano `Cart`
 *              para desacoplar la aplicación de la estructura de la API de Shopify.
 * @version 3.0.0
 * @author razstore (original), RaZ Podestá - MetaShark Tech (adaptación)
 */
import type {
  ProductOption,
  ProductVariant,
} from "@/shared/lib/schemas/entities/product.schema";

interface Connection<T> {
  edges: { node: T }[];
}

interface Money {
  amount: string;
  currencyCode: string;
}

interface Image {
  url: string;
  altText: string;
  width: number;
  height: number;
}

interface SEO {
  title: string;
  description: string;
}

// --- Tipos de Producto ---
export interface ShopifyProduct {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
}

// --- Tipos de Carrito ---
export interface CartItem {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: ShopifyProduct;
  };
}

/**
 * @type ShopifyCart
 * @description Representa la forma de datos CRUDA devuelta por la API de Shopify.
 */
export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
}

/**
 * @type Cart
 * @description El tipo SOBERANO y "aplanado" que consume la aplicación.
 *              La propiedad `lines` es un array simple de `CartItem`.
 */
export type Cart = Omit<ShopifyCart, "lines"> & {
  lines: CartItem[];
};

// --- Tipos de Operaciones de API ---

// Operaciones de Carrito
export interface ShopifyCartOperation {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
  };
}

export interface ShopifyCreateCartOperation {
  data: { cartCreate: { cart: ShopifyCart } };
}

export interface ShopifyAddToCartOperation {
  data: {
    cartLinesAdd: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
}

export interface ShopifyRemoveFromCartOperation {
  data: {
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
}

export interface ShopifyUpdateCartOperation {
  data: {
    cartLinesUpdate: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
}

// Operaciones de Producto
export interface ShopifyProductOperation {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
  };
}

export interface ShopifyProductsOperation {
  data: {
    products: Connection<ShopifyProduct>;
  };
}
// shared/lib/shopify/types.ts
