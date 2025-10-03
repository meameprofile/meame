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

type Connection<T> = {
  edges: Array<{ node: T }>;
};

type Money = {
  amount: string;
  currencyCode: string;
};

type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

type SEO = {
  title: string;
  description: string;
};

// --- Tipos de Producto ---
export type ShopifyProduct = {
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
};

// --- Tipos de Carrito ---
export type CartItem = {
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
};

/**
 * @type ShopifyCart
 * @description Representa la forma de datos CRUDA devuelta por la API de Shopify.
 */
export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

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
export type ShopifyCartOperation = {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
  };
};

export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: ShopifyCart } };
};

export type ShopifyAddToCartOperation = {
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
};

export type ShopifyRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type ShopifyUpdateCartOperation = {
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
};

// Operaciones de Producto
export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
  };
};

export type ShopifyProductsOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
};
// shared/lib/shopify/types.ts
