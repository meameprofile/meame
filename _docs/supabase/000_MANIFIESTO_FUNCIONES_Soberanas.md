// \_docs/supabase/000_MANIFIESTO_FUNCIONES_Soberanas.md
/\*\*

- @file 000_MANIFIESTO_FUNCIONES_Soberanas.md
- @description Manifiesto Canónico y SSoT para las funciones de base de datos fundacionales.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto de Funciones Soberanas v1.0

## 1. Visión y Propósito

Este documento define las funciones de PostgreSQL que actúan como la cimentación de la lógica de negocio, automatización y observabilidad de nuestra base de datos. Se crean antes que cualquier tabla para asegurar que los diagnósticos y los triggers estén disponibles desde el inicio.

## 2. Funciones Fundacionales

### 2.1. `public.get_system_diagnostics()`

- **Propósito:** Es el motor de nuestros scripts de diagnóstico. Realiza una introspección completa del esquema `public` y devuelve un único objeto JSON con el estado de todas las tablas, columnas, políticas, triggers y funciones.
- **Retorno:** `json`
- **Seguridad:** `SECURITY DEFINER` para asegurar que tenga los permisos necesarios para leer los catálogos del sistema.

### 2.2. `public.handle_new_user()`

- **Propósito:** Automatiza la creación de un perfil de usuario. Se activa mediante un trigger en `auth.users` después de un nuevo registro y crea la fila correspondiente en `public.profiles`. Garantiza la relación 1:1 entre autenticación y perfil.
- **Retorno:** `TRIGGER`

### 2.3. `public.update_cogniread_available_languages()`

- **Propósito:** Mantiene la integridad de los datos en la tabla `cogniread_articles`. Se activa mediante un trigger `BEFORE INSERT OR UPDATE` y extrae las claves de idioma del campo `content` (JSONB) para poblar automáticamente la columna `available_languages` (TEXT[]), optimizando las consultas.
- **Retorno:** `TRIGGER`

---
