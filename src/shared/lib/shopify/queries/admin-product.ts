// RUTA: src/shared/lib/shopify/queries/admin-product.ts
/**
 * @file admin-product.ts
 * @description SSoT para las consultas GraphQL relacionadas con productos de la Admin API.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

// Fragmento básico para un producto en la Admin API.
// Nota: La Admin API tiene un esquema diferente al Storefront API.
export const adminProductFragment = /* GraphQL */ `
  fragment adminProduct on Product {
    id
    title
    handle
    status
    createdAt
    updatedAt
    variants(first: 1) {
      edges {
        node {
          price {
            amount
            currencyCode
          }
          inventoryItem {
            tracked
            unitCost {
              amount
              currencyCode
            }
          }
          inventoryQuantity
        }
      }
    }
  }
`;

export const getAdminProductsQuery = /* GraphQL */ `
  query getAdminProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...adminProduct
        }
      }
    }
  }
  ${adminProductFragment}
`;

export const getAdminProductByIdQuery = /* GraphQL */ `
  query getAdminProductById($id: ID!) {
    product(id: $id) {
      ...adminProduct
    }
  }
  ${adminProductFragment}
`;
