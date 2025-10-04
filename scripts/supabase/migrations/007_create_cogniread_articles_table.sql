-- ============================================================================
-- SCRIPT DE NIVELACIÓN: TABLA COGNIREAD_ARTICLES (v1.0)
-- Manifiesto de Origen: _docs/supabase/003_MANIFIESTO_TABLA_COGNIREAD_ARTICLES.md
-- VERIFICAR: pnpm diag:supabase:schema-cogniread
-- ============================================================================

BEGIN;

-- 1. Crear la tabla 'cogniread_articles'
CREATE TABLE IF NOT EXISTS public.cogniread_articles (
    id TEXT PRIMARY KEY CHECK (id ~ '^c[a-z0-9]{24}$'), -- Valida formato CUID2
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    study_dna JSONB NOT NULL,
    content JSONB NOT NULL,
    tags TEXT[],
    available_languages TEXT[],
    bavi_hero_image_id TEXT, -- Vínculo lógico a BAVI, no FK.
    related_prompt_ids TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.cogniread_articles IS 'Almacena análisis de estudios científicos y su contenido divulgativo.';
COMMENT ON COLUMN public.cogniread_articles.study_dna IS 'El genoma estructurado del estudio científico original (SSoT de la Evidencia).';
COMMENT ON COLUMN public.cogniread_articles.content IS 'El contenido divulgativo y multilingüe en formato Markdown (SSoT de la Comunicación).';

-- 2. Habilitar RLS
ALTER TABLE public.cogniread_articles ENABLE ROW LEVEL SECURITY;

-- 3. Crear Políticas RLS
-- 3.1. Política de Lectura Pública: Cualquiera puede leer artículos publicados.
DROP POLICY IF EXISTS "Public articles are viewable by everyone" ON public.cogniread_articles;
CREATE POLICY "Public articles are viewable by everyone" ON public.cogniread_articles FOR SELECT USING (status = 'published'::text);

-- 3.2. Política de Escritura: Solo los 'owners' de un workspace pueden gestionar artículos.
DROP POLICY IF EXISTS "Admin/Service can manage articles" ON public.cogniread_articles;
CREATE POLICY "Admin/Service can manage articles" ON public.cogniread_articles FOR ALL USING (
    (auth.role() = 'service_role') OR
    (EXISTS (
        SELECT 1
        FROM public.workspace_members
        WHERE workspace_members.user_id = auth.uid() AND workspace_members.role = 'owner'
    ))
);

-- 4. Crear Trigger para la actualización automática de 'available_languages'
--    Utiliza la función 'update_cogniread_available_languages' que ya creamos.
DROP TRIGGER IF EXISTS on_cogniread_content_change ON public.cogniread_articles;
CREATE TRIGGER on_cogniread_content_change
  BEFORE INSERT OR UPDATE ON public.cogniread_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_cogniread_available_languages();

-- 5. Crear Trigger para 'updated_at'
DROP TRIGGER IF EXISTS on_cogniread_article_update ON public.cogniread_articles;
CREATE TRIGGER on_cogniread_article_update
    BEFORE UPDATE ON public.cogniread_articles
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime(updated_at);

COMMIT;
-- ============================================================================
-- FIN DE NIVELACIÓN DE COGNIREAD
-- ============================================================================
