// \_docs/databases-schemas/005_MANIFIESTO_TABLA_USER_PROFILE_SUMMARY.md
/\*\*

- @file 005_MANIFIESTO_TABLA_USER_PROFILE_SUMMARY.md
- @description Manifiesto Canónico y SSoT para la tabla de perfiles agregados,
-              el corazón del motor de Temeo Insights.
- @version 1.0.0
- @author L.I.A. Legacy
  \*/

# Manifiesto Soberano: Tabla `user_profile_summary` v1.0

## 1. Visión y Filosofía Raíz: "De los Datos Crudos a la Inteligencia Accionable."

Esta tabla no es un simple registro; es un **Data Mart de Perfiles de Usuario**. Su misión es transformar el torrente de eventos crudos de `visitor_sessions` y `visitor_campaign_events` en perfiles de usuario enriquecidos y métricas de comportamiento agregadas.

Actúa como la capa de abstracción entre los datos transaccionales y los modelos de IA. Al pre-calcular y resumir los datos, permitimos que `Temeo Insights` realice análisis de tendencias, segmentación y predicción de forma extremadamente rápida y eficiente, sin tener que procesar millones de eventos en cada consulta.

## 2. Arquitectura de Datos y Schema DDL

Esta tabla mantiene una relación 1 a 1 con `auth.users`, pero también puede incluir perfiles de visitantes anónimos de alto valor en el futuro.

- **Schema DDL:**

  ```sql
  CREATE TABLE IF NOT EXISTS public.user_profile_summary (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      user_type TEXT NOT NULL CHECK (user_type IN ('tenant', 'customer')),
      -- Métricas de Actividad Agregadas
      total_sessions INT NOT NULL DEFAULT 0,
      total_events INT NOT NULL DEFAULT 0,
      total_conversions INT NOT NULL DEFAULT 0,
      -- Métricas de Recencia y Frecuencia
      first_seen_at TIMESTAMPTZ,
      last_seen_at TIMESTAMPTZ,
      -- Perfil de Comportamiento
      most_frequent_country TEXT,
      last_campaign_id_seen TEXT,
      last_variant_id_seen TEXT,
      -- Metadatos de IA
      last_insight_generated_at TIMESTAMPTZ,
      -- Timestamps de Auditoría
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  COMMENT ON TABLE public.user_profile_summary IS 'Tabla agregada con perfiles y KPIs de comportamiento de usuario, optimizada para análisis de IA (Temeo Insights).';
  COMMENT ON COLUMN public.user_profile_summary.user_type IS 'Distingue entre usuarios del DCC (tenant) y clientes del portal (customer).';
  ```

3.  El Motor de Agregación: La Función ETL Soberana
    Esta función PostgreSQL es el motor que mantiene la tabla actualizada. Será invocada periódicamente por un Cron Job de Supabase.
    Función DDL update_user_profile_summaries:
    code
    SQL
    CREATE OR REPLACE FUNCTION public.update_user_profile_summaries()
    RETURNS void AS $$
    BEGIN
    -- Lógica para insertar nuevos usuarios que aún no están en la tabla de resumen
    INSERT INTO public.user_profile_summary (id, user_type, first_seen_at)
    SELECT
    u.id,
    CASE
    WHEN EXISTS (SELECT 1 FROM public.workspaces w WHERE w.owner_id = u.id) THEN 'tenant'
    ELSE 'customer'
    END AS user_type,
    MIN(vs.first_seen_at)
    FROM
    auth.users u
    LEFT JOIN
    public.visitor_sessions vs ON u.id = vs.user_id
    WHERE
    u.id NOT IN (SELECT id FROM public.user_profile_summary)
    GROUP BY u.id;

        -- Lógica para actualizar las métricas de todos los usuarios existentes
        WITH user_metrics AS (
            SELECT
                vs.user_id,
                COUNT(DISTINCT vs.session_id) as session_count,
                COUNT(vce.event_id) as event_count,
                COUNT(CASE WHEN vce.event_type = 'conversion' THEN 1 ELSE NULL END) as conversion_count,
                MIN(vs.first_seen_at) as min_first_seen,
                MAX(vs.last_seen_at) as max_last_seen,
                (array_agg(geo.country_code ORDER BY vs.last_seen_at DESC)) as latest_country,
                (array_agg(vce.campaign_id ORDER BY vce.created_at DESC)) as latest_campaign,
                (array_agg(vce.variant_id ORDER BY vce.created_at DESC)) as latest_variant
            FROM
                public.visitor_sessions vs
            LEFT JOIN
                public.visitor_campaign_events vce ON vs.session_id = vce.session_id
            LEFT JOIN LATERAL (SELECT (vs.geo_encrypted::jsonb)->>'countryCode' as country_code) as geo ON true
            WHERE
                vs.user_id IS NOT NULL
            GROUP BY
                vs.user_id
        )
        UPDATE
            public.user_profile_summary ups
        SET
            total_sessions = COALESCE(um.session_count, 0),
            total_events = COALESCE(um.event_count, 0),
            total_conversions = COALESCE(um.conversion_count, 0),
            first_seen_at = COALESCE(ups.first_seen_at, um.min_first_seen),
            last_seen_at = um.max_last_seen,
            most_frequent_country = um.latest_country, -- Simplificado a 'último', se puede mejorar a 'más frecuente'
            last_campaign_id_seen = um.latest_campaign,
            last_variant_id_seen = um.latest_variant,
            updated_at = now()
        FROM
            user_metrics um
        WHERE
            ups.id = um.user_id;

    END;

    $$
    LANGUAGE plpgsql SECURITY DEFINER;
    $$

4.  Orquestación: El Cron Job
    Para automatizar la actualización, se configurará un Cron Job en Supabase.
    Expresión CRON: 0 2 \* \* \* (Se ejecutará todos los días a las 2:00 AM UTC).
    Acción: Invocará la función public.update_user_profile_summaries().
