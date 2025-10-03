// \_docs/supabase/003_MANIFIESTO_TABLA_COGNIREAD_ARTICLES.md
/\*\*

- @file 003_MANIFIESTO_TABLA_COGNIREAD_ARTICLES.md
- @description Manifiesto Canónico y SSoT para la tabla 'public.cogniread_articles'.
-              Define la arquitectura, el uso de JSONB, triggers y su
-              simbiosis con los dominios BAVI y RaZPrompts.
- @version 1.0.0
  -@author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto de Tabla Soberana: `public.cogniread_articles`

## 1. Visión y Propósito

Esta tabla es el corazón del **Motor de Credibilidad**. Almacena la versión digerida y estructurada de estudios científicos, transformando la investigación cruda en activos de conocimiento multilingües y listos para ser consumidos por el portal público y otras partes del ecosistema.

**Principio Raíz:** Cada fila representa un único estudio científico, enriquecido con contenido divulgativo y vinculado a otros dominios para maximizar su valor contextual.

## 2. Definición de Schema (DDL)

```sql
-- Tabla: public.cogniread_articles
CREATE TABLE IF NOT EXISTS public.cogniread_articles (
    id TEXT PRIMARY KEY CHECK (id ~ '^c[a-z0-9]{24}$'), -- Valida formato CUID2
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    study_dna JSONB NOT NULL,
    content JSONB NOT NULL,
    tags TEXT[],
    available_languages TEXT[],
    bavi_hero_image_id TEXT, -- No es una FK para desacoplamiento, es un public_id
    related_prompt_ids TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.cogniread_articles IS 'Almacena análisis de estudios científicos y su contenido divulgativo.';
COMMENT ON COLUMN public.cogniread_articles.study_dna IS 'El genoma estructurado del estudio científico original (SSoT de la Evidencia).';
COMMENT ON COLUMN public.cogniread_articles.content IS 'El contenido divulgativo y multilingüe en formato Markdown (SSoT de la Comunicación).';
3. Arquitectura de Datos y Justificación
Clave Primaria (id TEXT con CHECK): Se utiliza un CUID2 generado por la aplicación (createId()) como clave primaria. Esto garantiza un ID único, corto e impredecible, ideal para URLs y referencias externas, en lugar de un UUID de base de datos. La restricción CHECK mantiene la integridad del formato.
Columnas JSONB (study_dna, content): El uso de JSONB es una decisión de diseño deliberada. Proporciona la flexibilidad necesaria para esquemas de datos complejos y anidados que pueden evolucionar con el tiempo (como añadir nuevos campos al ADN de un estudio o soportar nuevos idiomas) sin requerir migraciones de la estructura de la tabla principal. PostgreSQL permite indexar y consultar eficientemente dentro de estos campos JSONB.
Columnas TEXT[] (tags, related_prompt_ids): Para listas simples de cadenas, como etiquetas o IDs, el tipo TEXT[] es más eficiente en almacenamiento y consulta que un array JSON.
4. Automatización y Sincronización (Triggers)
Generación de available_languages:
Función: public.update_cogniread_available_languages()
Trigger: Se dispara BEFORE INSERT OR UPDATE en cogniread_articles.
Lógica: Extrae automáticamente las claves de primer nivel del objeto content (ej. 'it-IT', 'es-ES') y las almacena en la columna available_languages. Esto optimiza las consultas al permitir filtrar por idioma disponible sin necesidad de escanear el JSONB completo.
5. Políticas de Seguridad a Nivel de Fila (RLS)
Public articles are viewable by everyone (SELECT): Permite el acceso de lectura a cualquier fila cuyo status sea 'published'. Esto es crucial para que el portal público (/news) pueda mostrar los artículos.
Admin/Service can manage articles (INSERT, UPDATE, DELETE): Permite todas las operaciones de escritura solo a los usuarios con el rol de service_role (usado por Server Actions) o a los usuarios autenticados que son owner de un workspace. Esta es una capa de seguridad para el DCC.
6. Sincronización con el Ecosistema
BAVI: La columna bavi_hero_image_id almacena el public_id de una variante de BAVI (ej. webvork/assets/.../v1-original). Es un vínculo lógico, no una FOREIGN KEY, para mantener los dominios desacoplados. La aplicación es responsable de asegurar que el public_id referenciado exista.
RaZPrompts: La columna related_prompt_ids almacena un array de promptId (CUID2) que se originan en la tabla razprompts_entries. Esto permite trazar el origen creativo de las imágenes o ideas de un artículo.
---

```
