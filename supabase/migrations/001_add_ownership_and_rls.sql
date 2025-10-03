-- ARCHIVO: supabase/migrations/001_add_ownership_and_rls.sql
/**
 * Migración 001: Añade la propiedad de usuario y activa la Seguridad a Nivel de Fila (RLS).
 * Este script es el fundamento de nuestra arquitectura de autorización.
 */

-- 1. Añadir la columna de propietario a la tabla de plantillas.
ALTER TABLE public.campaign_templates
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- (Repetir para otras tablas como `bavi_assets`, `raz_prompts`, etc.)
-- ALTER TABLE public.bavi_assets
-- ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Activar RLS en la tabla de plantillas.
-- ¡IMPORTANTE! Una vez que esto se activa, NADIE podrá acceder a los datos
-- hasta que se cree una política que otorgue acceso.
ALTER TABLE public.campaign_templates ENABLE ROW LEVEL SECURITY;

-- 3. Crear la política de acceso para las plantillas.
-- Esta política permite a un usuario realizar CUALQUIER acción (SELECT, INSERT, UPDATE, DELETE)
-- SÓLO en las filas que le pertenecen.
CREATE POLICY "Los usuarios pueden gestionar sus propias plantillas"
ON public.campaign_templates
FOR ALL
USING (auth.uid() = user_id);

-- (Repetir para otras tablas)
-- ALTER TABLE public.bavi_assets ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Los usuarios pueden gestionar sus propios activos"
-- ON public.bavi_assets FOR ALL USING (auth.uid() = user_id);
