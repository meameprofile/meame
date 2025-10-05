// RUTA: \_docs/supabase/008_MANIFIESTO_TABLA_I18N_CONTENT_ENTRIES.md
/\*\*

- @file 008_MANIFIESTO_TABLA_I18N_CONTENT_ENTRIES.md
- @description Manifiesto Canónico y SSoT para la tabla de contenido i18n.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Soberano: Tabla `i18n_content_entries`

## 1. Visión y Propósito

Esta tabla es el repositorio centralizado para todo el contenido de internacionalización (i18n). Reemplaza el sistema de archivos `messages/` para permitir la gestión dinámica de contenido. Cada fila representa un "documento" de traducción, análogo a un archivo `.i18n.json`, manteniendo la cohesión lógica del contenido.

## 2. Esquema DDL

CREATE TABLE IF NOT EXISTS public.i18n_content_entries (
entry_key TEXT PRIMARY KEY,
translations JSONB NOT NULL,
domain TEXT GENERATED ALWAYS AS (split_part(entry_key, '/', 1)) STORED,
last_modified_by UUID REFERENCES auth.users(id),
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.i18n_content_entries IS 'Almacena documentos de traducción i18n, donde cada fila es análoga a un archivo .i18n.json.';
COMMENT ON COLUMN public.i18n_content_entries.entry_key IS 'Clave única e inmutable, basada en la ruta del archivo original (ej: "components/header/header.i18n.json").';
COMMENT ON COLUMN public.i18n_content_entries.translations IS 'Objeto JSON que contiene todas las traducciones para todas las locales, replicando la estructura del archivo JSON.';
COMMENT ON COLUMN public.i18n_content_entries.domain IS 'Dominio funcional extraído del entry_key para una indexación y consulta más rápidas.';

## 3. Políticas RLS

- **Lectura Pública:** Los datos de i18n son contenido público. Se permitirá el acceso de LECTURA (SELECT) a todos, autenticados o no.
  `CREATE POLICY "Allow public read access" ON public.i18n_content_entries FOR SELECT USING (true);`
- **Gestión Restringida:** Las operaciones de ESCRITURA (INSERT, UPDATE, DELETE) estarán restringidas a un rol de `service_role` o a futuros roles de `content_manager`.

3. La Nueva Capa de Acceso a Datos (DAL): Rendimiento a través de Caching Agresivo
   El principal desafío es igualar el rendimiento de la lectura de archivos locales. La solución es simple y de élite: cachear agresivamente en el servidor.

---
