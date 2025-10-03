// _docs/supabase/002_MANIFIESTO_TABLAS_BAVI.md
/**
 * @file 002_MANIFIESTO_TABLAS_BAVI.md
 * @description Manifiesto Canónico y SSoT para las tablas 'bavi_assets' y 'bavi_variants'.
 * @version 2.0.0 (Schema Alignment & Holism)
 * @author L.I.A. Legacy
 */

# Manifiesto de Tablas Soberanas: `bavi_assets` y `bavi_variants` v2.0

## 1. Visión y Propósito

El dominio BAVI se divide en dos entidades para garantizar la integridad y flexibilidad: el **Activo** (`bavi_assets`) es la entidad conceptual, mientras que la **Variante** (`bavi_variants`) es su manifestación física.

**Principio Raíz:** Un activo no puede existir sin, al menos, una variante. Esta regla de negocio es inmutable y se refuerza a nivel de base de datos.

## 2. Definición de Schema (DDL)

### 2.1. Tabla `public.bavi_assets`

```sql
-- Tabla: public.bavi_assets (El Contenedor Conceptual)
CREATE TABLE IF NOT EXISTS public.bavi_assets (
    asset_id TEXT PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'pending')),
    provider TEXT NOT NULL DEFAULT 'cloudinary',
    description TEXT,
    prompt_id TEXT,
    tags JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.bavi_assets IS 'Registro maestro de activos visuales en el ecosistema.';
COMMENT ON COLUMN public.bavi_assets.asset_id IS 'ID único basado en la nomenclatura SNIA.';
2.2. Tabla public.bavi_variants
code
SQL
-- Tabla: public.bavi_variants (La Manifestación Física)
CREATE TABLE IF NOT EXISTS public.bavi_variants (
    variant_id TEXT NOT NULL,
    asset_id TEXT NOT NULL REFERENCES public.bavi_assets(asset_id) ON DELETE CASCADE,
    public_id TEXT NOT NULL,
    state TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (asset_id, variant_id)
);
COMMENT ON TABLE public.bavi_variants IS 'Almacena las diferentes versiones y formatos de un activo BAVI.';
COMMENT ON COLUMN public.bavi_variants.asset_id IS 'Garantiza que cada variante pertenezca a un activo existente.';
3. Políticas de Seguridad a Nivel de Fila (RLS)
Habilitación de RLS: Ambas tablas DEBEN tener RLS habilitado.
Lectura Pública: Las políticas de SELECT para ambas tablas permiten el acceso de lectura a cualquier solicitud (USING (true)), ya que los activos son contenido público.
Gestión por Miembros del Workspace: Las políticas de INSERT, UPDATE y DELETE para ambas tablas están gobernadas por la función public.is_workspace_member(workspace_id), asegurando que solo los miembros autorizados puedan gestionar los activos.

---

