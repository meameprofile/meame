// \_docs/supabase/000_MANIFIESTO_VISITOR_INTELLIGENCE.md
/\*\*

- @file 000_MANIFIESTO_VISITOR_INTELLIGENCE.md
- @description Manifiesto Canónico y SSoT para el dominio de Inteligencia de Visitantes.
- @version 1.0.0
- @author L.I.A. Legacy
  \*/

# Manifiesto Soberano: Dominio de Inteligencia de Visitantes

## 1. Visión y Filosofía Raíz: "Cada Interacción es un Dato, Cada Visitante un Viaje."

Este dominio captura cada interacción para construir una visión de 360 grados del viaje del usuario, desde su primera visita anónima hasta su conversión. Nuestra arquitectura se basa en el principio de **"Sesión Ascendente"**: una sesión nace anónima y puede "ascender" a identificada, llevando consigo todo su historial.

## 2. Arquitectura de Datos de Élite

### 2.1. Tabla `public.visitor_sessions` (SSoT de Sesiones)

Esta tabla híbrida gestiona tanto a visitantes anónimos como a usuarios autenticados.

- **Schema DDL:**
  ```sql
  CREATE TABLE IF NOT EXISTS public.visitor_sessions (
      session_id TEXT PRIMARY KEY, -- CUID2
      fingerprint_id TEXT UNIQUE,
      user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
      ip_address_encrypted TEXT,
      user_agent_encrypted TEXT,
      geo_encrypted JSONB,
      first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ```
- **Políticas RLS:** El acceso a esta tabla debe estar restringido exclusivamente al rol `service_role`.

### 2.2. Tabla `public.visitor_campaign_events` ("Contenido" Granular)

Almacena cada evento de telemetría (pageviews, clics, etc.).

- **Schema DDL:**
  ```sql
  CREATE TABLE IF NOT EXISTS public.visitor_campaign_events (
      event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id TEXT NOT NULL REFERENCES public.visitor_sessions(session_id) ON DELETE CASCADE,
      campaign_id TEXT NOT NULL,
      variant_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      payload JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ```
- **Integridad Referencial:** La `FOREIGN KEY` a `visitor_sessions` con `ON DELETE CASCADE` es innegociable.

## 3. El Proceso de "Traspaso": Vinculación Atómica

La transición de anónimo a identificado se orquesta a través de una función de base de datos.

- **Función DDL:**
  ```sql
  CREATE OR REPLACE FUNCTION public.link_fingerprint_to_user(p_fingerprint_id TEXT, p_user_id UUID)
  RETURNS void AS $$
  BEGIN
      UPDATE public.visitor_sessions
      SET user_id = p_user_id, last_seen_at = now()
      WHERE fingerprint_id = p_fingerprint_id AND user_id IS NULL;
  END;
  $$ LANGUAGE plpgsql;
  ```
