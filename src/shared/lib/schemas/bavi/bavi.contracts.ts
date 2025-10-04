// RUTA: src/shared/lib/schemas/bavi/bavi.contracts.ts
/**
 * @file bavi.contracts.ts
 * @description Contrato de Tipos Atómico y Soberano para el Dominio BAVI.
 * @version 2.0.0 (Isomorphic Type Safety)
 * @author L.I.A. Legacy
 */
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/shared/lib/supabase/database.types";

export type BaviAssetRow = Tables<"bavi_assets">;
export type BaviAssetInsert = TablesInsert<"bavi_assets">;
export type BaviAssetUpdate = TablesUpdate<"bavi_assets">;

export type BaviVariantRow = Tables<"bavi_variants">;
export type BaviVariantInsert = TablesInsert<"bavi_variants">;
export type BaviVariantUpdate = TablesUpdate<"bavi_variants">;
