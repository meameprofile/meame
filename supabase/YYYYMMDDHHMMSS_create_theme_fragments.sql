-- RUTA: supabase/migrations/YYYYMMDDHHMMSS_create_theme_fragments.sql
/**
 * @file YYYYMMDDHHMMSS_create_theme_fragments.sql
 * @description Migración de base de datos para crear la tabla soberana
 *              'theme_fragments' y su política de seguridad RLS.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

-- 1. Crear la tabla `theme_fragments`
CREATE TABLE public.theme_fragments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id), -- El creador original del fragmento
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('color', 'font', 'geometry')),
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_workspace_name_type UNIQUE (workspace_id, name, type) -- Evita fragmentos duplicados en el mismo workspace
);

-- 2. Añadir comentarios para la introspección del esquema
COMMENT ON TABLE public.theme_fragments IS 'Almacena fragmentos de tema (colores, fuentes, geometría) propiedad de un workspace.';
COMMENT ON COLUMN public.theme_fragments.id IS 'Identificador único del fragmento.';
COMMENT ON COLUMN public.theme_fragments.workspace_id IS 'FK al workspace al que pertenece este fragmento.';
COMMENT ON COLUMN public.theme_fragments.user_id IS 'FK al usuario que creó originalmente el fragmento.';
COMMENT ON COLUMN public.theme_fragments.name IS 'Nombre legible del fragmento (ej. "vitality", "poppins-inter").';
COMMENT ON COLUMN public.theme_fragments.type IS 'Tipo de fragmento: color, font, o geometry.';
COMMENT ON COLUMN public.theme_fragments.data IS 'El objeto JSON que contiene los datos del estilo (ej. { "colors": { "--primary": "..." } }).';

-- 3. Activar la Seguridad a Nivel de Fila (RLS)
ALTER TABLE public.theme_fragments ENABLE ROW LEVEL SECURITY;

-- 4. Crear la política de seguridad
--    Esta política utiliza la función `is_workspace_member` que ya creamos.
CREATE POLICY "Los miembros del workspace pueden gestionar sus fragmentos"
    ON public.theme_fragments
    FOR ALL
    USING (is_workspace_member(workspace_id));

-- 5. Crear índices para optimizar las consultas
CREATE INDEX idx_theme_fragments_workspace_id ON public.theme_fragments(workspace_id);
CREATE INDEX idx_theme_fragments_type ON public.theme_fragments(type);

-- 6. Crear un trigger para actualizar automáticamente `updated_at`
CREATE TRIGGER handle_theme_fragments_update
    BEFORE UPDATE ON public.theme_fragments
    FOR EACH ROW
    EXECUTE FUNCTION moddatetime(updated_at);
