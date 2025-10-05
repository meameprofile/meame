// \_docs/supabase/007_MANIFIESTO_TABLA_AI_CONVERSATIONS.md
/\*\*

- @file 007_MANIFIESTO_TABLA_AI_CONVERSATIONS.md
- @description Manifiesto Canónico y SSoT para la tabla `ai_conversations`.
-              Esta es la Bóveda de Memoria Contextual del ecosistema.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Soberano: Tabla `ai_conversations`

## 1. Visión y Filosofía Raíz: "Ninguna Conversación se Pierde, Ningún Contexto se Olvida."

Esta tabla es el sistema de memoria persistente de nuestras interacciones con la IA. Su misión es capturar y estructurar cada hilo conversacional, transformando las interacciones de ser transaccionales y sin estado a ser contextuales y con memoria.

Cada fila representa un diálogo completo sobre una tarea o entidad específica, permitiendo a la IA "recordar" intercambios previos para proporcionar respuestas más inteligentes, coherentes y personalizadas.

## 2. Arquitectura de Datos y Schema DDL

La tabla está diseñada para vincular una conversación a un usuario y a un contexto de negocio específico (ej. un prompt, un artículo, una campaña).

- **Schema DDL:**

  ```sql
  CREATE TABLE IF NOT EXISTS public.ai_conversations (
      conversation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
      context_key TEXT NOT NULL,
      messages JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  COMMENT ON TABLE public.ai_conversations IS 'Almacena el historial completo de interacciones conversacionales con la IA.';
  COMMENT ON COLUMN public.ai_conversations.context_key IS 'Identificador único que vincula la conversación a una entidad o tarea específica (ej: "razprompt::clyd1q2w3...")';
  COMMENT ON COLUMN public.ai_conversations.messages IS 'Array de objetos de mensaje, siguiendo el formato de la API de Gemini: [{"role": "user", "parts": [{"text": "..."}]}, {"role": "model", "parts": [{"text": "..."}]}]';
  ```

3. Políticas de Seguridad (RLS)
   El acceso a las conversaciones es estrictamente confidencial y se limita al propietario dentro de su workspace.
   Política de Gestión Total: Los usuarios solo pueden ver, crear, actualizar y eliminar las conversaciones que pertenecen a un workspace del que son miembros.
   code
   SQL
   CREATE POLICY "Los miembros del workspace pueden gestionar sus conversaciones"
   ON public.ai_conversations FOR ALL
   USING (public.is_workspace_member(workspace_id))
   WITH CHECK (public.is_workspace_member(workspace_id));
4. Flujo de Trabajo y Ciclo de Vida
   Inicio: Al comenzar una nueva tarea conversacional, se crea una fila en ai_conversations con el user_id, workspace_id y un context_key relevante.
   Continuación: Antes de cada nueva llamada a la IA, se recupera el array messages de la conversación activa.
   Ejecución: El historial completo de messages se envía a la API de la IA junto con el nuevo prompt del usuario.
   Persistencia: La nueva pregunta del usuario y la respuesta del modelo de IA se añaden como nuevos objetos al array messages y se actualiza la fila en la base de datos.

---
