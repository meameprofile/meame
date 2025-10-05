// .docs/000_MANIFIESTO_TABLA_PROFILES.md
/\*\*

- @file 000_MANIFIESTO_TABLA_PROFILES.md
- @description Manifiesto Canónico y SSoT para la tabla de perfiles de usuario.
-              Define la estructura, reglas de negocio y protocolos de sincronización
-              para garantizar la integridad de los datos de perfil.
- @version 1.0.0
  -@author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Canónico: Tabla `public.profiles`

## 1. Visión y Filosofía Raíz: "El Perfil es la Extensión Soberana del Usuario"

La tabla `public.profiles` actúa como el repositorio soberano para toda la metadata pública y de aplicación asociada a un usuario. Mientras que la tabla `auth.users` de Supabase gestiona la autenticación, `profiles` gestiona la **identidad** dentro de nuestro ecosistema.

Nuestra filosofía se basa en dos principios:

1.  **Sincronización Atómica:** Por cada usuario en `auth.users`, DEBE existir un y solo un registro correspondiente en `public.profiles`.
2.  **Observabilidad Completa:** Cada perfil debe tener un registro de auditoría inmutable (`created_at`, `updated_at`) para una trazabilidad completa.

## 2. Diagnóstico de Desalineamiento Histórico

Análisis previos de la base de datos revelaron una inconsistencia estructural: la tabla `profiles` carecía de la columna `created_at`. Esto no solo impedía la correcta ejecución de funciones de diagnóstico (`get_content_diagnostics`), sino que también violaba el pilar de observabilidad al no registrar la fecha de creación del perfil.

## 3. Arquitectura y Schema Definitivo

La siguiente estructura de tabla y sus reglas asociadas son la SSoT para la entidad `profiles`.

### 3.1. Estructura de Columnas (DDL)

```sql
-- Tabla: public.profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    last_sign_in_at TIMESTAMPTZ,
    last_sign_in_ip TEXT,
    last_sign_in_location TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
user_id: Es UNIQUE y tiene una FOREIGN KEY a auth.users(id) con ON DELETE CASCADE. Esto garantiza la regla de negocio 1:1 y que si un usuario es eliminado de Supabase Auth, su perfil se elimina automáticamente.
created_at: Es NOT NULL y tiene DEFAULT now(), garantizando que cada nuevo perfil registre su fecha de creación.
updated_at: Es NOT NULL y tiene DEFAULT now(). Se mantiene actualizado mediante un trigger.
3.2. Reglas de Negocio y Sincronización (Triggers y Funciones)
Para garantizar la sincronización atómica, se implementan las siguientes funciones y triggers en PostgreSQL:
Creación Automática de Perfil: Un trigger en la tabla auth.users invoca una función (handle_new_user) que crea automáticamente un registro en public.profiles cada vez que un nuevo usuario se registra.
Sincronización de updated_at: Un trigger (on_profile_update) actualiza automáticamente el campo updated_at cada vez que se modifica una fila en profiles.
Sincronización de last_sign_in_at: Un trigger en auth.users (on_auth_user_updated) invoca una función (update_user_last_sign_in) para mantener sincronizada la fecha del último inicio de sesión.
```
