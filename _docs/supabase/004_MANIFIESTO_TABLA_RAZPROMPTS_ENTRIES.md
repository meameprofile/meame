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
/**
 * @file 004_MANIFIESTO_TABLA_RAZPROMPTS_ENTRIES.md
 * @description Manifiesto Canónico y SSoT para la tabla 'public.razprompts_entries'.
 * @version 3.0.0 (AI Conversation Integration)
 * @author RaZ Podestá - MetaShark Tech
 */

# Manifiesto de Tabla Soberana: `public.razprompts_entries` v3.0

## 1. Visión y Propósito
...

## 2. Esquema DDL (CREATE TABLE)
...

## 3. Simbiosis con el Ecosistema

### 3.1 Integración con Conversaciones de IA (Tabla `ai_conversations`)

La tabla `razprompts_entries` actúa como un ancla contextual para las conversaciones de IA. Esto permite funcionalidades avanzadas como "chatear para refinar un prompt".

-   **Vínculo Inmutable:** Una conversación sobre un prompt específico se vincula utilizando un `context_key` en la tabla `ai_conversations`.
-   **Formato del `context_key`:** `razprompt::<id>`, donde `<id>` es el `id` (CUID2) de la fila en `razprompts_entries`.
-   **Flujo:** Un usuario puede iniciar un "chat" desde un prompt existente. El sistema creará o recuperará la conversación en `ai_conversations` usando esta clave, permitiendo a la IA tener el contexto completo del genoma del prompt y de los intercambios anteriores para refinarlo.

---


```
