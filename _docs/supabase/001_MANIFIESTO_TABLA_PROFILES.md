// _docs/supabase/001_MANIFIESTO_TABLA_PROFILES.md
/**
 * @file 001_MANIFIESTO_TABLA_PROFILES.md
 * @description Manifiesto Canónico y SSoT para la tabla 'public.profiles'.
 * @version 3.0.0 (Hybrid Identity Architecture)
 * @author L.I.A. Legacy
 */

# Manifiesto de Tabla Soberana: `public.profiles` v3.0

## 1. Visión y Propósito

Esta tabla es la extensión soberana de la entidad `auth.users`. Almacena metadatos de aplicación que definen la identidad de un usuario en nuestro ecosistema.

## 2. Arquitectura de Identidad Híbrida

Este sistema sigue un principio de identidad híbrida para lograr tanto la manejabilidad humana como el rendimiento de la máquina:

*   **Clave Primaria Inmutable (UUID):** La relación fundamental entre las tablas se basa en el `id` de tipo `UUID` de la tabla `auth.users`. Este es el identificador interno, estable y de alto rendimiento.
*   **Identificador Legible (Email):** La columna `email` en `auth.users` tiene una restricción `UNIQUE`. Actúa como un "identificador natural" y legible por humanos que se puede usar para buscar un usuario específico y obtener su `id` inmutable.

**Principio Raíz:** Por cada registro en `auth.users`, debe existir uno y solo un registro correspondiente en `public.profiles`, vinculado inmutablemente por el `user_id` (UUID). **Nunca se usará el email como clave primaria o foránea.**

## 3. Definición de Schema (DDL)

```sql
-- La tabla 'profiles' se vincula a 'auth.users' a través del UUID inmutable.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    -- ... otras columnas de perfil
);
code
Code
**Acción 2: Forjar los Esquemas DDL para `workspaces` y el Sistema de Visitantes**

Aquí están los esquemas SQL para las nuevas tablas que solicitaste, diseñados bajo esta arquitectura robusta.

```sql
-- pnpm tsx scripts/run-with-env.ts scripts/supabase/migrations/create-visitor-intelligence-schema.ts

-- Tabla: public.workspaces (Contenedor de Equipos/Proyectos)
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.workspaces IS 'Registro maestro de los workspaces o equipos en el ecosistema.';

-- Tabla: public.workspace_members (Relación Usuario-Workspace)
CREATE TABLE IF NOT EXISTS public.workspace_members (
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'member')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (workspace_id, user_id)
);
COMMENT ON TABLE public.workspace_members IS 'Tabla pivote que define la membresía y el rol de un usuario en un workspace.';

-- Tabla: public.visitor_sessions (SSoT para Sesiones Anónimas e Identificadas)
CREATE TABLE IF NOT EXISTS public.visitor_sessions (
    session_id TEXT PRIMARY KEY, -- CUID2 generado por la aplicación
    fingerprint_id TEXT UNIQUE, -- El identificador del navegador anónimo
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Se puebla al hacer login
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
    ip_address_encrypted TEXT,
    user_agent_encrypted TEXT,
    geo_encrypted JSONB,
    first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.visitor_sessions IS 'Almacena cada sesión de visitante, comenzando como anónima y potencialmente vinculada a un usuario.';
COMMENT ON COLUMN public.visitor_sessions.user_id IS 'NULL si la sesión es anónima, se rellena al iniciar sesión para vincular el historial.';

-- Tabla: public.visitor_campaign_events (El "Contenido" Granular)
CREATE TABLE IF NOT EXISTS public.visitor_campaign_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL REFERENCES public.visitor_sessions(session_id) ON DELETE CASCADE,
    campaign_id TEXT NOT NULL,
    variant_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- ej. 'pageview', 'click', 'rrweb_event'
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.visitor_campaign_events IS 'Registro granular de cada evento de telemetría que ocurre durante una sesión.';
COMMENT ON COLUMN public.visitor_campaign_events.session_id IS 'Garantiza que cada evento pertenezca a una sesión, manteniendo la integridad referencial.';

---
ACTUALIZACION
// _docs/supabase/001_MANIFIESTO_TABLA_PROFILES.md
/**
 * @file 001_MANIFIESTO_TABLA_PROFILES.md
 * @description Manifiesto Canónico y SSoT para la entidad `profiles` y el
 *              sistema de "Sesión Ascendente" que vincula la identidad anónima
 *              y la autenticada.
 * @version 4.0.0 (Holistic Identity & Leveling Protocol)
 * @author L.I.A. Legacy
 */

# Manifiesto Soberano: Entidad `profiles` y Arquitectura de Identidad

## 1. Visión y Filosofía Raíz: "Una Identidad, Un Viaje."

La entidad `profiles` es la extensión soberana de `auth.users`, pero su verdadero poder reside en su simbiosis con el sistema de **"Sesión Ascendente"**. Nuestra filosofía es que cada visitante, desde su primera interacción anónima, comienza un único viaje. Cuando elige registrarse, no creamos un nuevo viaje; "ascendemos" el existente, vinculando todo su historial anónimo a su nueva identidad persistente.

## 2. Arquitectura de Identidad Híbrida (SSoT)

*   **Clave Inmutable (`UUID`):** El `user_id` (un UUID de `auth.users`) es la **única clave primaria y foránea** utilizada para las relaciones internas. Garantiza rendimiento, estabilidad e inmutabilidad.
*   **Identificador Legible (`email`):** El `email` (un `TEXT` de `auth.users`) tiene una restricción `UNIQUE`. Es la "matrícula" legible por humanos, utilizada **exclusivamente para búsquedas** y para iniciar el proceso de vinculación.

**Principio Raíz:** El `email` encuentra al usuario; el `UUID` define sus relaciones.

## 3. El Mecanismo de "Traspaso" (Vinculación Anónimo -> Identificado)

El "traspaso" ocurre cuando un visitante con un `fingerprint_id` se registra.

1.  **Cliente:** Tras un registro o login exitoso, el cliente posee tanto el `fingerprint_id` (de su almacenamiento local) como el `user_id` (de la nueva sesión de Supabase).
2.  **Server Action:** El cliente invoca una Server Action (`linkAnonymousSessionToUser`), pasando ambos identificadores.
3.  **Base de Datos:** La Server Action llama a la función `public.link_fingerprint_to_user(p_fingerprint_id, p_user_id)`. Esta función **atómicamente** actualiza la tabla `visitor_sessions`, rellenando el campo `user_id` en la fila que coincide con el `fingerprint_id`.

## 4. Esquema DDL y Reglas de Negocio

### 4.1. Tabla `public.profiles`
```sql
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    -- Columnas para la identidad multi-proveedor
    provider_name TEXT,
    provider_avatar_url TEXT,
    -- Timestamps de auditoría
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.profiles IS 'Almacena metadatos de aplicación para los usuarios, unificando perfiles de múltiples proveedores de identidad.';
4.2. Triggers y Funciones Asociadas
handle_new_user (Trigger en auth.users AFTER INSERT): Crea automáticamente un registro en public.profiles para cada nuevo usuario, garantizando la relación 1:1.
on_profile_update (Trigger en public.profiles BEFORE UPDATE): Actualiza automáticamente el campo updated_at.
4.3. Políticas RLS
SELECT: (auth.uid() = id) - Un usuario solo puede leer su propio perfil.
UPDATE: (auth.uid() = id) - Un usuario solo puede actualizar su propio perfil.
INSERT: (auth.uid() = id) - Un usuario solo puede crear su propio perfil.
5. Protocolo de Nivelación Quirúrgica
La implementación o modificación de esta tabla DEBE seguir el "Ciclo de Nivelación de 5 Fases":
Definición Conceptual: Este manifiesto es el plano.
Diagnóstico de Esquema: Ejecutar pnpm diag:supabase:schema-all.
Análisis de Desviación: Comparar el informe con este manifiesto.
Nivelación: Aplicar los scripts SQL de migración (ALTER TABLE, etc.) para corregir las desviaciones sin destruir datos.
Verificación: Volver a ejecutar el diagnóstico de esquema para confirmar el alineamiento. La ejecución final de pnpm diag:supabase:content validará la integridad referencial en la práctica.
code
Code
#### **Aparato 2: Código de Nivelación Quirúrgica para `profiles`**

Este es el script de migración (Fase 4) que alinea tu base de datos con el manifiesto. Ejecútalo en tu editor SQL de Supabase.

```sql
-- pnpm tsx scripts/supabase/migrations/level-profiles-table.ts

-- Sentencia 1: Añadir las columnas faltantes para la identidad multi-proveedor.
-- El comando 'ADD COLUMN IF NOT EXISTS' es seguro y no destructivo.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS provider_name TEXT,
ADD COLUMN IF NOT EXISTS provider_avatar_url TEXT;

-- Sentencia 2: Asegurar la existencia y el tipo correcto de 'created_at'.
-- Este bloque es más complejo para ser resiliente.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now();
    ELSE
        ALTER TABLE public.profiles ALTER COLUMN created_at SET NOT NULL;
        ALTER TABLE public.profiles ALTER COLUMN created_at SET DEFAULT now();
    END IF;
END $$;

-- Sentencia 3: Fortalecer la política RLS de INSERT.
-- Elimina la política antigua si existe y la crea con la regla correcta.
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile."
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Sentencia 4: Asegurar que el trigger de 'updated_at' exista.
CREATE OR REPLACE TRIGGER on_profile_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION moddatetime(updated_at);

---

