// RUTA: \_docs/supabase/006_MANIFIESTO_TABLA_AURA_INSIGHTS.md
/\*\*

- @file 006_MANIFIESTO_TABLA_AURA_INSIGHTS.md
- @description Manifiesto Canónico y SSoT para la tabla `aura_insights`.
-              Esta es la bóveda de la inteligencia generada por Temeo AI.
- @version 1.0.0
- @author L.I.A. Legacy
  \*/

# Manifiesto Soberano: Tabla `aura_insights`

## 1. Visión y Filosofía Raíz: "De la Inferencia a la Acción."

Esta tabla es el destino final del pipeline de inteligencia de Aura. Su misión es almacenar los "insights" —observaciones, análisis y recomendaciones— generados por el motor de IA Temeo.

Actúa como una bandeja de entrada estratégica para el superusuario, transformando el análisis complejo de datos en directivas claras y accionables que pueden ser revisadas y ejecutadas desde el DCC.

## 2. Arquitectura de Datos y Schema DDL

```sql
-- Habilita RLS para la nueva tabla.
ALTER TABLE public.aura_insights ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.aura_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,

    -- El Insight Generado por la IA
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    recommendation TEXT NOT NULL,

    -- Contexto y Trazabilidad
    related_data JSONB, -- Almacena el 'dossier de inteligencia' que originó el insight.

    -- Gestión del Ciclo de Vida
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    resolved_at TIMESTAMPTZ,

    -- Timestamps de Auditoría
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.aura_insights IS 'Bóveda para los insights estratégicos generados por el motor de IA de Aura (Temeo).';
3. Políticas de Seguridad (RLS)
Acceso Total para Miembros del Workspace: Los usuarios solo pueden ver y gestionar los insights pertenecientes a su workspace_id.
code
SQL
CREATE POLICY "Los miembros del workspace pueden gestionar sus insights"
ON public.aura_insights FOR ALL
USING (public.is_workspace_member(workspace_id))
WITH CHECK (public.is_workspace_member(workspace_id));

---

```
