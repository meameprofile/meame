// RUTA: shared/lib/shopify/queries/product.ts
/**
 * @file product.ts
 * @description SSoT para las consultas GraphQL relacionadas con productos.
 * @version 1.0.0
 * @author razstore (original), RaZ Podestá - MetaShark Tech (adaptación)
 */
import { productFragment } from "../fragments/product";

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts(
    $query: String
    $reverse: Boolean
    $sortKey: ProductSortKeys
  ) {
    products(first: 100, sortKey: $sortKey, reverse: $reverse, query: $query) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;
