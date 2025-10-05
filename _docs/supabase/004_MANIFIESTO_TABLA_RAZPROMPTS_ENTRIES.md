// \_docs/supabase/004_MANIFIESTO_TABLA_RAZPROMPTS_ENTRIES.md
/\*\*

- @file 004_MANIFIESTO_TABLA_RAZPROMPTS_ENTRIES.md
- @description Manifiesto Canónico y SSoT para la tabla 'public.razprompts_entries'.
- @version 2.0.0 (Secure & Automated)
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto de Tabla Soberana: `public.razprompts_entries` v2.0

## 1. Visión y Propósito

Esta tabla es la **Bóveda Genómica Creativa** del ecosistema. Cada fila representa el "genoma" de un activo visual: el prompt, los parámetros y el modelo de IA que lo generaron, garantizando la reproducibilidad y la trazabilidad.

## 2. Esquema DDL (CREATE TABLE)

```sql
CREATE TABLE IF NOT EXISTS public.razprompts_entries (
    id TEXT PRIMARY KEY CHECK (id ~ '^c[a-z0-9]{24}$'),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_generation' CHECK (status IN ('pending_generation', 'generated', 'archived')),
    ai_service TEXT NOT NULL,
    keywords TEXT[],
    versions JSONB NOT NULL,
    tags JSONB,
    bavi_asset_ids TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.razprompts_entries IS 'Almacena el genoma creativo (prompts, parámetros) de los activos visuales.';
3. Automatización y Triggers
Actualización Automática de Timestamp (on_razprompt_update): Un trigger en la tabla se dispara BEFORE UPDATE para invocar la función moddatetime('updated_at'), manteniendo el campo updated_at siempre actualizado.
4. Políticas de Seguridad a Nivel de Fila (RLS)
La seguridad de esta tabla es mandatoria y se basa en la membresía del workspace.
Habilitación de RLS: ALTER TABLE public.razprompts_entries ENABLE ROW LEVEL SECURITY;
Política de Gestión Total (ALL): Solo los miembros del workspace al que pertenece un prompt pueden verlo, crearlo, actualizarlo o eliminarlo.
code
SQL
CREATE POLICY "Los miembros del workspace pueden gestionar sus prompts"
ON public.razprompts_entries FOR ALL
USING (public.is_workspace_member(workspace_id))
WITH CHECK (public.is_workspace_member(workspace_id));

---


```
