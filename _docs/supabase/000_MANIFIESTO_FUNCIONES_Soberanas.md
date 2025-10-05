// \_docs/supabase/000_MANIFIESTO_FUNCIONES_Soberanas.md
/\*\*

- @file 000_MANIFIESTO_FUNCIONES_Soberanas.md
- @description Manifiesto Canónico y SSoT para las funciones de base de datos fundacionales y de seguridad.
- @version 2.0.0 (Security & Utility Functions Integration)
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto de Funciones Soberanas v2.0

## 1. Visión y Propósito

Este documento define las funciones de PostgreSQL que actúan como la cimentación de la lógica de negocio, automatización, seguridad y observabilidad de nuestra base de datos. Se crean antes que cualquier tabla para asegurar que los diagnósticos, los triggers y las políticas de seguridad a nivel de fila (RLS) estén disponibles desde el inicio.

## 2. Funciones de Diagnóstico y Automatización

### 2.1. `public.get_system_diagnostics()`

- **Propósito:** Es el motor de nuestros scripts de diagnóstico. Realiza una introspección completa del esquema `public` y devuelve un único objeto JSON con el estado de todas las tablas, columnas, políticas, triggers y funciones.
- **Retorno:** `json`
- **Seguridad:** `SECURITY DEFINER` para asegurar que tenga los permisos necesarios para leer los catálogos del sistema.
- **DDL:**
  ```sql
  -- (La implementación de esta función es compleja y se gestiona internamente,
  -- pero su existencia y contrato se declaran aquí).
  ```

### 2.2. `public.handle_new_user()`

- **Propósito:** Automatiza la creación de un perfil de usuario. Se activa mediante un trigger en `auth.users` después de un nuevo registro y crea la fila correspondiente en `public.profiles`. Garantiza la relación 1:1 entre autenticación y perfil.
- **Retorno:** `TRIGGER`
- **DDL:**
  ```sql
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
      INSERT INTO public.profiles (id)
      VALUES (new.id);
      RETURN new;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  ```

### 2.3. `public.update_cogniread_available_languages()`

- **Propósito:** Mantiene la integridad de los datos en la tabla `cogniread_articles`. Se activa mediante un trigger `BEFORE INSERT OR UPDATE` y extrae las claves de idioma del campo `content` (JSONB) para poblar automáticamente la columna `available_languages` (TEXT[]), optimizando las consultas.
- **Retorno:** `TRIGGER`
- **DDL:**
  ```sql
  CREATE OR REPLACE FUNCTION public.update_cogniread_available_languages()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.available_languages = ARRAY(SELECT jsonb_object_keys(NEW.content));
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  ```

## 3. Funciones de Seguridad y Pertenencia (Guardianes RLS)

### 3.1. `public.is_workspace_member(workspace_id_to_check UUID)`

- **Propósito:** Es la piedra angular de nuestra seguridad multi-tenant. Verifica si el usuario actualmente autenticado (`auth.uid()`) es miembro del `workspace_id` proporcionado. Es la función principal utilizada en las políticas RLS para aislar los datos.
- **Retorno:** `boolean`
- **Seguridad:** `SECURITY DEFINER` para permitir que la función consulte la tabla `workspace_members` en nombre del usuario, incluso si el usuario no tiene permisos de `SELECT` directos sobre ella.
- **DDL:**
  ```sql
  CREATE OR REPLACE FUNCTION public.is_workspace_member(workspace_id_to_check UUID)
  RETURNS boolean AS $$
  BEGIN
      IF auth.uid() IS NULL THEN
          RETURN false;
      END IF;
      RETURN EXISTS (
          SELECT 1
          FROM public.workspace_members
          WHERE workspace_id = workspace_id_to_check AND user_id = auth.uid()
      );
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  ```

### 3.2. `public.get_user_role_in_workspace(workspace_id_to_check UUID)`

- **Propósito:** Recupera el rol específico ('owner' o 'member') del usuario actual dentro de un workspace determinado. Se utiliza para políticas RLS que requieren un nivel de permiso específico (ej. solo los 'owners' pueden eliminar ciertos recursos).
- **Retorno:** `text`
- **Seguridad:** `SECURITY DEFINER`
- **DDL:**

  ```sql
  CREATE OR REPLACE FUNCTION public.get_user_role_in_workspace(workspace_id_to_check UUID)
  RETURNS text AS $$
  DECLARE
      user_role text;
  BEGIN
      IF auth.uid() IS NULL THEN
          RETURN NULL;
      END IF;

      SELECT role INTO user_role
      FROM public.workspace_members
      WHERE workspace_id = workspace_id_to_check AND user_id = auth.uid();

      RETURN user_role;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  ```

## 4. Funciones de Vinculación de Identidad ("Sesión Ascendente")

### 4.1. `public.link_fingerprint_to_user(p_fingerprint_id TEXT, p_user_id UUID)`

- **Propósito:** Orquesta atómicamente el "Traspaso de Identidad". Actualiza un registro en `visitor_sessions`, vinculando una sesión anónima (identificada por `fingerprint_id`) a un usuario autenticado (`user_id`).
- **Retorno:** `void`
- **Seguridad:** `LANGUAGE plpgsql` (no requiere `SECURITY DEFINER` si se invoca desde una Server Action con rol de servicio).
- **DDL:**
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

---
